import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const popup = await prisma.popupSponsor.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(popup);
  } catch (error) {
    console.error("Update popup sponsor error:", error);
    return NextResponse.json({ error: "Failed to update popup sponsor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.popupSponsor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete popup sponsor error:", error);
    return NextResponse.json({ error: "Failed to delete popup sponsor" }, { status: 500 });
  }
}
