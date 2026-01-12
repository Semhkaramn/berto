import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const stream = await prisma.liveStream.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        embedUrl: body.embedUrl,
        thumbnailUrl: body.thumbnailUrl,
        isLive: body.isLive,
      },
    });
    return NextResponse.json(stream);
  } catch (error) {
    console.error("Update livestream error:", error);
    return NextResponse.json({ error: "Failed to update livestream" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.liveStream.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete livestream error:", error);
    return NextResponse.json({ error: "Failed to delete livestream" }, { status: 500 });
  }
}
