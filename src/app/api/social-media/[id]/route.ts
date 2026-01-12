import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const socialMedia = await prisma.socialMedia.update({
      where: { id },
      data: {
        platform: body.platform,
        name: body.name,
        linkUrl: body.linkUrl,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
      },
    });
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error("Update social media error:", error);
    return NextResponse.json({ error: "Failed to update social media" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.socialMedia.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete social media error:", error);
    return NextResponse.json({ error: "Failed to delete social media" }, { status: 500 });
  }
}
