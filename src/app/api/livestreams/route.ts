import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const streams = await prisma.liveStream.findMany({
      orderBy: [
        { isLive: "desc" },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(streams);
  } catch (error) {
    console.error("Livestreams error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const stream = await prisma.liveStream.create({
      data: {
        title: body.title,
        description: body.description,
        embedUrl: body.embedUrl,
        thumbnailUrl: body.thumbnailUrl,
        isLive: body.isLive ?? false,
      },
    });
    return NextResponse.json(stream);
  } catch (error) {
    console.error("Create livestream error:", error);
    return NextResponse.json({ error: "Failed to create livestream" }, { status: 500 });
  }
}
