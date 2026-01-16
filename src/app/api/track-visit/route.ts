import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { visitorHash } = await request.json();

    if (!visitorHash) {
      return NextResponse.json({ error: "Missing visitorHash" }, { status: 400 });
    }

    // Check if visitor exists
    let visitor = await prisma.visitor.findUnique({
      where: { visitorHash },
    });

    let isNewVisitor = false;

    // Create visitor if not exists
    if (!visitor) {
      visitor = await prisma.visitor.create({
        data: {
          visitorId: `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          visitorHash,
        },
      });
      isNewVisitor = true;
    }

    // Record visit
    await prisma.visit.create({
      data: {
        visitorId: visitor.visitorId,
      },
    });

    // Update SiteStats - upsert ile yoksa oluştur
    await prisma.siteStats.upsert({
      where: { id: "main" },
      create: {
        id: "main",
        totalVisitors: 1,
        uniqueVisitors: 1,
        todayVisitors: 1,
      },
      update: {
        totalVisitors: { increment: 1 },
        todayVisitors: { increment: 1 },
        // Yeni ziyaretçi ise uniqueVisitors'ı da artır
        ...(isNewVisitor && { uniqueVisitors: { increment: 1 } }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track visit error:", error);
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}
