import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Günlük istatistikleri sıfırla (yeni gün başladıysa)
async function checkAndResetDailyStats() {
  const stats = await prisma.siteStats.findUnique({
    where: { id: "main" },
  });

  if (!stats) {
    // İlk kez oluştur
    return await prisma.siteStats.create({
      data: { id: "main" },
    });
  }

  // Son reset tarihini kontrol et
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastReset = new Date(stats.lastResetDate);
  lastReset.setHours(0, 0, 0, 0);

  // Eğer yeni gün başladıysa todayVisitors'ı sıfırla
  if (today > lastReset) {
    return await prisma.siteStats.update({
      where: { id: "main" },
      data: {
        todayVisitors: 0,
        lastResetDate: today,
      },
    });
  }

  return stats;
}

export async function GET() {
  try {
    // Günlük reset kontrolü yap ve istatistikleri al
    const stats = await checkAndResetDailyStats();

    return NextResponse.json({
      totalVisitors: stats.totalVisitors,
      uniqueVisitors: stats.uniqueVisitors,
      todayVisitors: stats.todayVisitors,
      totalClicks: stats.totalClicks,
      sponsorClicks: stats.sponsorClicks,
      bannerClicks: stats.bannerClicks,
      eventClicks: stats.eventClicks,
      popupClicks: stats.popupClicks,
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
