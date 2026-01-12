import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: "Sponsor Portal",
        },
      });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json({
      siteName: "Sponsor Portal",
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    let settings = await prisma.siteSettings.findFirst();

    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          siteName: body.siteName,
          logoUrl: body.logoUrl,
          youtubeChannelId: body.youtubeChannelId,
          youtubeApiKey: body.youtubeApiKey,
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          siteName: body.siteName,
          logoUrl: body.logoUrl,
          youtubeChannelId: body.youtubeChannelId,
          youtubeApiKey: body.youtubeApiKey,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
