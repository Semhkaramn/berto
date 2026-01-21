import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    const banners = await prisma.banner.findMany({
      where: showAll ? {} : { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Banners error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const banner = await prisma.banner.create({
      data: {
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        position: body.position,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Create banner error:", error);
    return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
  }
}
