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

    // Create visitor if not exists
    if (!visitor) {
      visitor = await prisma.visitor.create({
        data: {
          visitorId: `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          visitorHash,
        },
      });
    }

    // Record visit
    await prisma.visit.create({
      data: {
        visitorId: visitor.visitorId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Track visit error:", error);
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}
