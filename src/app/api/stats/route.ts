import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get total visits
    const totalVisitors = await prisma.visit.count();

    // Get unique visitors
    const uniqueVisitors = await prisma.visitor.count();

    // Get today's visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayVisitors = await prisma.visit.count({
      where: {
        visitedAt: {
          gte: today,
        },
      },
    });

    // Get click statistics
    const totalClicks = await prisma.clickEvent.count();

    const sponsorClicks = await prisma.clickEvent.count({
      where: { type: "sponsor" },
    });

    const bannerClicks = await prisma.clickEvent.count({
      where: { type: "banner" },
    });

    const eventClicks = await prisma.clickEvent.count({
      where: { type: "event" },
    });

    const popupClicks = await prisma.clickEvent.count({
      where: { type: "popup" },
    });

    return NextResponse.json({
      totalVisitors,
      uniqueVisitors,
      todayVisitors,
      totalClicks,
      sponsorClicks,
      bannerClicks,
      eventClicks,
      popupClicks,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      {
        totalVisitors: 0,
        uniqueVisitors: 0,
        todayVisitors: 0,
        totalClicks: 0,
        sponsorClicks: 0,
        bannerClicks: 0,
        eventClicks: 0,
        popupClicks: 0,
      },
      { status: 200 }
    );
  }
}
