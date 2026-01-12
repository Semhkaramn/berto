import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        position: body.position,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Update banner error:", error);
    return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
  }
}
