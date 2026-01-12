import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const popups = await prisma.popupSponsor.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(popups);
  } catch (error) {
    console.error("Popup sponsors error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const popup = await prisma.popupSponsor.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(popup);
  } catch (error) {
    console.error("Create popup sponsor error:", error);
    return NextResponse.json({ error: "Failed to create popup sponsor" }, { status: 500 });
  }
}
