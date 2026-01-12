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

    return NextResponse.json({
      totalVisitors,
      uniqueVisitors,
      todayVisitors,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { totalVisitors: 0, uniqueVisitors: 0, todayVisitors: 0 },
      { status: 200 }
    );
  }
}
