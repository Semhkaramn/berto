import { NextResponse } from "next/server";

// YouTube kanalından videoları çek
export async function POST(request: Request) {
  try {
    const { channelId, apiKey, maxResults = 12 } = await request.json();

    if (!channelId || !apiKey) {
      return NextResponse.json({ error: "Channel ID ve API key gerekli" }, { status: 400 });
    }

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

    // Kanalın videolarını al
    const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&type=video&order=date&maxResults=${maxResults}&key=${apiKey}`;
    const videosRes = await fetch(videosUrl);

    if (!videosRes.ok) {
      const errorData = await videosRes.json();
      return NextResponse.json({ error: errorData.error?.message || "Videolar alinamadi" }, { status: 400 });
    }

    const videosData = await videosRes.json();

    const videos = videosData.items?.map((item: {
      id: { videoId: string };
      snippet: {
        title: string;
        description: string;
        thumbnails: { high?: { url: string }; medium?: { url: string } };
        publishedAt: string;
      };
    }) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url,
      embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      publishedAt: item.snippet.publishedAt
    })) || [];

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("YouTube videos API error:", error);
    return NextResponse.json({ error: "Videolar alinamadi" }, { status: 500 });
  }
}
