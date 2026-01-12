import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const socialMedia = await prisma.socialMedia.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error("Social media error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const socialMedia = await prisma.socialMedia.create({
      data: {
        platform: body.platform,
        name: body.name,
        linkUrl: body.linkUrl,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error("Create social media error:", error);
    return NextResponse.json({ error: "Failed to create social media" }, { status: 500 });
  }
}
