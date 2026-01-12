import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error("Events error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
