import { NextRequest, NextResponse } from "next/server";

// YouTube URL'den video ID çıkar
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL gerekli" }, { status: 400 });
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json({ error: "Gecersiz YouTube URL" }, { status: 400 });
    }

    // oEmbed API kullanarak video bilgilerini çek (API key gerektirmez)
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

    const response = await fetch(oEmbedUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "Video bulunamadi" }, { status: 404 });
    }

    const data = await response.json();

    // Thumbnail URL'leri - en yüksek kaliteden başla
    const thumbnails = {
      maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      default: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    };

    // En iyi thumbnail'i kontrol et
    let thumbnailUrl = thumbnails.hq; // Default olarak hq kullan

    try {
      const maxresCheck = await fetch(thumbnails.maxres, { method: 'HEAD' });
      if (maxresCheck.ok && maxresCheck.headers.get('content-length') !== '0') {
        thumbnailUrl = thumbnails.maxres;
      }
    } catch {
      // maxres yoksa hq kullan
    }

    return NextResponse.json({
      videoId,
      title: data.title,
      author: data.author_name,
      thumbnailUrl,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
    });
  } catch (error) {
    console.error("YouTube info error:", error);
    return NextResponse.json({ error: "Video bilgileri alinamadi" }, { status: 500 });
  }
}
