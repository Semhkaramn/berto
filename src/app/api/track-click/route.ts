import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, targetId, visitorHash } = body;

    if (!type || !targetId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Tıklama kaydı oluştur
    const clickData: {
      type: string;
      targetId: string;
      visitorHash?: string;
      sponsorId?: string;
      popupSponsorId?: string;
      eventId?: string;
      bannerId?: string;
    } = {
      type,
      targetId,
      visitorHash: visitorHash || null,
    };

    // SiteStats güncelleme verisi
    const statsUpdate: {
      totalClicks: { increment: number };
      sponsorClicks?: { increment: number };
      bannerClicks?: { increment: number };
      eventClicks?: { increment: number };
      popupClicks?: { increment: number };
    } = {
      totalClicks: { increment: 1 },
    };

    // İlgili modele bağla
    if (type === "sponsor") {
      clickData.sponsorId = targetId;
      statsUpdate.sponsorClicks = { increment: 1 };
      // Sponsor'un clickCount'unu artır
      await prisma.sponsor.update({
        where: { id: targetId },
        data: { clickCount: { increment: 1 } },
      });
    } else if (type === "popup") {
      clickData.popupSponsorId = targetId;
      statsUpdate.popupClicks = { increment: 1 };
      // Popup sponsor'un clickCount'unu artır
      await prisma.popupSponsor.update({
        where: { id: targetId },
        data: { clickCount: { increment: 1 } },
      });
    } else if (type === "event") {
      clickData.eventId = targetId;
      statsUpdate.eventClicks = { increment: 1 };
      // Event'in clickCount'unu artır
      await prisma.event.update({
        where: { id: targetId },
        data: { clickCount: { increment: 1 } },
      });
    } else if (type === "banner") {
      clickData.bannerId = targetId;
      statsUpdate.bannerClicks = { increment: 1 };
      // Banner'ın clickCount'unu artır
      await prisma.banner.update({
        where: { id: targetId },
        data: { clickCount: { increment: 1 } },
      });
    }

    // ClickEvent kaydı oluştur
    await prisma.clickEvent.create({
      data: clickData,
    });

    // SiteStats güncelle
    await prisma.siteStats.upsert({
      where: { id: "main" },
      create: {
        id: "main",
        totalClicks: 1,
        ...(type === "sponsor" && { sponsorClicks: 1 }),
        ...(type === "popup" && { popupClicks: 1 }),
        ...(type === "event" && { eventClicks: 1 }),
        ...(type === "banner" && { bannerClicks: 1 }),
      },
      update: statsUpdate,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track click error:", error);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}

// İstatistikleri getir - artık SiteStats'tan okuyor
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const targetId = searchParams.get("targetId");

    if (type && targetId) {
      const clicks = await prisma.clickEvent.count({
        where: { type, targetId },
      });
      return NextResponse.json({ clicks });
    }

    // Genel istatistikler - SiteStats'tan oku
    const stats = await prisma.siteStats.findUnique({
      where: { id: "main" },
    });

    if (!stats) {
      return NextResponse.json({
        sponsorClicks: 0,
        popupClicks: 0,
        eventClicks: 0,
        bannerClicks: 0,
        totalClicks: 0,
      });
    }

    return NextResponse.json({
      sponsorClicks: stats.sponsorClicks,
      popupClicks: stats.popupClicks,
      eventClicks: stats.eventClicks,
      bannerClicks: stats.bannerClicks,
      totalClicks: stats.totalClicks,
    });
  } catch (error) {
    console.error("Get clicks error:", error);
    return NextResponse.json({ error: "Failed to get clicks" }, { status: 500 });
  }
}
