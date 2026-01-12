import { NextResponse } from "next/server";

// YouTube kanal ID'sinden kanal bilgilerini ve canlı yayın durumunu çek
export async function POST(request: Request) {
  try {
    const { channelId, apiKey } = await request.json();

    if (!channelId) {
      return NextResponse.json({ error: "Channel ID gerekli" }, { status: 400 });
    }

    // API key yoksa sadece basic bilgileri döndür
    if (!apiKey) {
      // Oembed API ile basic bilgi al
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/channel/${channelId}&format=json`;
      try {
        const oembedRes = await fetch(oembedUrl);
        if (oembedRes.ok) {
          const oembedData = await oembedRes.json();
          return NextResponse.json({
            channelTitle: oembedData.author_name || "Bilinmeyen Kanal",
            channelThumbnail: null,
            isLive: false,
            liveVideoId: null,
            liveTitle: null,
            message: "API key olmadan canlı yayın kontrolü yapılamaz"
          });
        }
      } catch {
        // Oembed başarısız olursa handle @ ile dene
      }

      // Handle ile dene (@ prefix)
      if (channelId.startsWith("@")) {
        return NextResponse.json({
          channelTitle: channelId.substring(1),
          channelThumbnail: null,
          isLive: false,
          liveVideoId: null,
          liveTitle: null,
          message: "API key olmadan detaylı bilgi alınamaz"
        });
      }

      return NextResponse.json({
        channelTitle: "Kanal",
        channelThumbnail: null,
        isLive: false,
        liveVideoId: null,
        liveTitle: null,
        message: "API key olmadan bilgi alınamadı"
      });
    }

    // YouTube Data API v3 ile bilgi al
    let actualChannelId = channelId;

    // Eğer handle (@username) verilmişse, önce channel ID'yi bul
    if (channelId.startsWith("@")) {
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(channelId)}&key=${apiKey}`;
      const searchRes = await fetch(searchUrl);
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.items && searchData.items.length > 0) {
          actualChannelId = searchData.items[0].snippet.channelId;
        }
      }
    }

    // Kanal bilgilerini al
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&id=${actualChannelId}&key=${apiKey}`;
    const channelRes = await fetch(channelUrl);

    let channelTitle = "Bilinmeyen Kanal";
    let channelThumbnail = null;

    if (channelRes.ok) {
      const channelData = await channelRes.json();
      if (channelData.items && channelData.items.length > 0) {
        channelTitle = channelData.items[0].snippet.title;
        channelThumbnail = channelData.items[0].snippet.thumbnails?.default?.url;
      }
    }

    // Canlı yayın kontrolü
    const liveUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&type=video&eventType=live&key=${apiKey}`;
    const liveRes = await fetch(liveUrl);

    let isLive = false;
    let liveVideoId = null;
    let liveTitle = null;
    let liveThumbnail = null;

    if (liveRes.ok) {
      const liveData = await liveRes.json();
      if (liveData.items && liveData.items.length > 0) {
        isLive = true;
        liveVideoId = liveData.items[0].id.videoId;
        liveTitle = liveData.items[0].snippet.title;
        liveThumbnail = liveData.items[0].snippet.thumbnails?.high?.url;
      }
    }

    return NextResponse.json({
      channelId: actualChannelId,
      channelTitle,
      channelThumbnail,
      isLive,
      liveVideoId,
      liveTitle,
      liveThumbnail,
      embedUrl: isLive ? `https://www.youtube.com/embed/${liveVideoId}?autoplay=1` : null
    });
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json({ error: "YouTube bilgileri alınamadı" }, { status: 500 });
  }
}
