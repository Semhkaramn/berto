import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Telegram kanal bilgilerini çek
async function fetchTelegramChannelInfo(username: string) {
  try {
    // @ işaretini kaldır
    const cleanUsername = username.replace(/^@/, '');

    // Telegram'ın public API'si ile kanal bilgilerini çekelim
    // t.me/<username> sayfasından og meta tagları çekiyoruz
    const response = await fetch(`https://t.me/${cleanUsername}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Bot/1.0)',
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Meta taglardan bilgileri çıkar
    const titleMatch = html.match(/<meta property="og:title" content="([^"]*)">/);
    const descMatch = html.match(/<meta property="og:description" content="([^"]*)">/);
    const imageMatch = html.match(/<meta property="og:image" content="([^"]*)">/);

    // Üye sayısını çek
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

// GET - Tüm aktif telegram kanallarını getir
export async function GET() {
  try {
    const channels = await prisma.telegramChannel.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(channels);
  } catch (error) {
    console.error("Telegram channels fetch error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Yeni telegram kanalı ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, sortOrder = 0 } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username gerekli" },
        { status: 400 }
      );
    }

    // @ işaretini kaldır
    const cleanUsername = username.replace(/^@/, '');

    // Telegram bilgilerini çek
    const telegramInfo = await fetchTelegramChannelInfo(cleanUsername);

    const channel = await prisma.telegramChannel.create({
      data: {
        username: cleanUsername,
        title: telegramInfo?.title || cleanUsername,
        description: telegramInfo?.description || null,
        photoUrl: telegramInfo?.photoUrl || null,
        memberCount: telegramInfo?.memberCount || null,
        sortOrder,
      },
    });

    return NextResponse.json(channel);
  } catch (error: unknown) {
    console.error("Telegram channel create error:", error);

    // Unique constraint hatası
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: "Bu kullanıcı adı zaten eklenmiş" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Kanal eklenirken hata oluştu" },
      { status: 500 }
    );
  }
}
