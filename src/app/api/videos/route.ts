import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Videos error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const video = await prisma.video.create({
      data: {
        title: body.title,
        description: body.description,
        embedUrl: body.embedUrl,
        thumbnailUrl: body.thumbnailUrl,
      },
    });
    return NextResponse.json(video);
  } catch (error) {
    console.error("Create video error:", error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}
