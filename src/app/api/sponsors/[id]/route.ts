import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const sponsor = await prisma.sponsor.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        type: body.type,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(sponsor);
  } catch (error) {
    console.error("Update sponsor error:", error);
    return NextResponse.json({ error: "Failed to update sponsor" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.sponsor.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete sponsor error:", error);
    return NextResponse.json({ error: "Failed to delete sponsor" }, { status: 500 });
  }
}
