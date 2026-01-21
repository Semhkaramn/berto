import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    const sponsors = await prisma.sponsor.findMany({
      where: showAll ? {} : { isActive: true },
      orderBy: [
        { type: "asc" },
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });
    return NextResponse.json(sponsors);
  } catch (error) {
    console.error("Sponsors error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sponsor = await prisma.sponsor.create({
      data: {
        name: body.name,
        description: body.description,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl,
        type: body.type || "normal",
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(sponsor);
  } catch (error) {
    console.error("Create sponsor error:", error);
    return NextResponse.json({ error: "Failed to create sponsor" }, { status: 500 });
  }
}
