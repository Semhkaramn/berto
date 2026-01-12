import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Telegram kanal bilgilerini çek
async function fetchTelegramChannelInfo(username: string) {
  try {
    const cleanUsername = username.replace(/^@/, '');

    const response = await fetch(`https://t.me/${cleanUsername}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Bot/1.0)',
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    const titleMatch = html.match(/<meta property="og:title" content="([^"]*)">/);
    const descMatch = html.match(/<meta property="og:description" content="([^"]*)">/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]*)">/);

    const memberMatch = html.match(/(\d[\d\s]*)\s*(members?|subscribers?|aboneler?|üye)/i);
    let memberCount = null;
    if (memberMatch) {
      memberCount = parseInt(memberMatch[1].replace(/\s/g, ''), 10);
    }

    return {
      title: titleMatch ? titleMatch[1] : cleanUsername,
      description: descMatch ? descMatch[1] : null,
      photoUrl: imageMatch ? imageMatch[1] : null,
      memberCount,
    };
  } catch (error) {
    console.error("Telegram info fetch error:", error);
    return null;
  }
}

// PUT - Telegram kanalını güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { username, isActive, sortOrder, refreshInfo } = body;

    const updateData: Record<string, unknown> = {};

    if (username !== undefined) {
      const cleanUsername = username.replace(/^@/, '');
      updateData.username = cleanUsername;

      // Yeni username varsa bilgileri yenile
      const telegramInfo = await fetchTelegramChannelInfo(cleanUsername);
      if (telegramInfo) {
        updateData.title = telegramInfo.title;
        updateData.description = telegramInfo.description;
        updateData.photoUrl = telegramInfo.photoUrl;
        updateData.memberCount = telegramInfo.memberCount;
      }
    }

    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    // Sadece bilgileri yenile
    if (refreshInfo) {
      const channel = await prisma.telegramChannel.findUnique({
        where: { id },
      });

      if (channel) {
        const telegramInfo = await fetchTelegramChannelInfo(channel.username);
        if (telegramInfo) {
          updateData.title = telegramInfo.title;
          updateData.description = telegramInfo.description;
          updateData.photoUrl = telegramInfo.photoUrl;
          updateData.memberCount = telegramInfo.memberCount;
        }
      }
    }

    const channel = await prisma.telegramChannel.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.error("Telegram channel update error:", error);
    return NextResponse.json(
      { error: "Kanal güncellenirken hata oluştu" },
      { status: 500 }
    );
  }
}

// DELETE - Telegram kanalını sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.telegramChannel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Telegram channel delete error:", error);
    return NextResponse.json(
      { error: "Kanal silinirken hata oluştu" },
      { status: 500 }
    );
  }
}
