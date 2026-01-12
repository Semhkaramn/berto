import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const popups = await prisma.popupSponsor.findMany({
      where: { isActive: true },
    });

    if (popups.length === 0) {
      return NextResponse.json(null);
    }

    // Pick random popup
    const randomIndex = Math.floor(Math.random() * popups.length);
    return NextResponse.json(popups[randomIndex]);
  } catch (error) {
    console.error("Popup sponsor error:", error);
    return NextResponse.json(null);
  }
}
