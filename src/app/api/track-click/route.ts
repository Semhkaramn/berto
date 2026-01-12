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

    // İlgili modele bağla
    if (type === "sponsor") {
      clickData.sponsorId = targetId;
      // Sponsor'un clickCount'unu artır
      await prisma.sponsor.update({
        where: { id: targetId },
        data: { clickCount: { increment: 1 } },
      });
    } else if (type === "popup") {
      clickData.popupSponsorId = targetId;
      // Popup sponsor'un clickCount'unu artır
      await prisma.popupSponsor.update({
        where: { id: targetId },
        data: { clickCount: { increment: 1 } },
      });
    } else if (type === "event") {
      clickData.eventId = targetId;
      // Event'in clickCount'unu artır
      await prisma.event.update({
        where: { id: targetId },
        data: { clickCount: { increment: 1 } },
      });
    } else if (type === "banner") {
      clickData.bannerId = targetId;
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track click error:", error);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}

// İstatistikleri getir
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

    // Genel istatistikler
    const sponsorClicks = await prisma.clickEvent.count({ where: { type: "sponsor" } });
    const popupClicks = await prisma.clickEvent.count({ where: { type: "popup" } });
    const eventClicks = await prisma.clickEvent.count({ where: { type: "event" } });
    const bannerClicks = await prisma.clickEvent.count({ where: { type: "banner" } });

    return NextResponse.json({
      sponsorClicks,
      popupClicks,
      eventClicks,
      bannerClicks,
      totalClicks: sponsorClicks + popupClicks + eventClicks + bannerClicks,
    });
  } catch (error) {
    console.error("Get clicks error:", error);
    return NextResponse.json({ error: "Failed to get clicks" }, { status: 500 });
  }
}
