"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import SponsorPopup from "@/components/SponsorPopup";

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
}

interface Sponsor {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
  type: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
}

interface LiveStream {
  id: string;
  title: string;
  isLive: boolean;
  thumbnailUrl: string | null;
}

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, sponsorsRes, eventsRes, streamsRes] = await Promise.all([
          fetch("/api/banners"),
          fetch("/api/sponsors"),
          fetch("/api/events"),
          fetch("/api/livestreams"),
        ]);

        if (bannersRes.ok) setBanners(await bannersRes.json());
        if (sponsorsRes.ok) setSponsors(await sponsorsRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
        if (streamsRes.ok) setLiveStreams(await streamsRes.json());
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const getBannerByPosition = (position: string) =>
    banners.find((b) => b.position === position);

  // Üst yatay bannerlar
  const topBanner1 = getBannerByPosition("top-1");
  const topBanner2 = getBannerByPosition("top-2");
  const topBanner3 = getBannerByPosition("top-3");

  // Yan dikey bannerlar
  const leftBanner = getBannerByPosition("left");
  const rightBanner = getBannerByPosition("right");

  // Herhangi bir üst banner var mı?
  const hasTopBanners = topBanner1 || topBanner2 || topBanner3;

  const activeLiveStream = liveStreams.find((s) => s.isLive);

  const handleEventClick = (linkUrl: string) => {
    if (linkUrl) {
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleBannerClick = (linkUrl: string | null) => {
    if (linkUrl) {
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Main Layout with Side Banners */}
        <div className="flex gap-4">
          {/* Sol Dikey Banner - Sadece varsa göster */}
          {leftBanner && (
            <div className="hidden lg:block w-36 xl:w-44 flex-shrink-0">
              <div className="side-banner">
                <div
                  onClick={() => handleBannerClick(leftBanner.linkUrl)}
                  className="side-banner-item block hover:opacity-90 transition-opacity cursor-pointer bg-[var(--surface)]"
                >
                  <div className="p-2 flex items-center justify-center min-h-[200px]">
                    <img
                      src={leftBanner.imageUrl}
                      alt="Banner"
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ana İçerik */}
          <div className="flex-1 min-w-0">
            {/* Üst Yatay Bannerlar - Sadece varsa göster */}
            {hasTopBanners && (
              <div className="top-banner-container">
                {topBanner1 && (
                  <div
                    onClick={() => handleBannerClick(topBanner1.linkUrl)}
                    className="top-banner block hover:opacity-90 transition-opacity cursor-pointer bg-[var(--surface)]"
                  >
                    <div className="h-20 md:h-24 flex items-center justify-center p-2">
                      <img src={topBanner1.imageUrl} alt="Banner" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                )}
                {topBanner2 && (
                  <div
                    onClick={() => handleBannerClick(topBanner2.linkUrl)}
                    className="top-banner block hover:opacity-90 transition-opacity cursor-pointer bg-[var(--surface)]"
                  >
                    <div className="h-20 md:h-24 flex items-center justify-center p-2">
                      <img src={topBanner2.imageUrl} alt="Banner" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                )}
                {topBanner3 && (
                  <div
                    onClick={() => handleBannerClick(topBanner3.linkUrl)}
                    className="top-banner block hover:opacity-90 transition-opacity cursor-pointer bg-[var(--surface)]"
                  >
                    <div className="h-20 md:h-24 flex items-center justify-center p-2">
                      <img src={topBanner3.imageUrl} alt="Banner" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Sponsors Card */}
              <Link href="/sponsors" className="card group cursor-pointer">
                <div className="h-44 gradient-main flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <svg className="w-16 h-16 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-white mb-1">Sponsorlar</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {sponsors.length} aktif sponsor
                  </p>
                </div>
              </Link>

              {/* Events Card */}
              <Link href="/events" className="card group cursor-pointer">
                <div className="h-44 gradient-vip flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <svg className="w-16 h-16 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-white mb-1">Etkinlikler</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {events.length} yaklasan etkinlik
                  </p>
                </div>
              </Link>

              {/* Live Stream Card */}
              <Link href="/live" className="card group cursor-pointer">
                <div className="h-44 bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  {activeLiveStream && (
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-live flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        CANLI
                      </span>
                    </div>
                  )}
                  <svg className="w-16 h-16 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-white mb-1">Canli Yayin</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    {activeLiveStream ? "Yayin devam ediyor!" : "Yayin yok"}
                  </p>
                </div>
              </Link>
            </div>

            {/* Latest Events */}
            {events.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Son Etkinlikler</h2>
                  <Link href="/events" className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium">
                    Tumunu Gor
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {events.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event.linkUrl)}
                      className="card flex flex-col sm:flex-row cursor-pointer group"
                    >
                      <div className="w-full sm:w-44 h-28 bg-gradient-to-br from-[var(--surface-hover)] to-[var(--surface)] flex items-center justify-center p-2 flex-shrink-0">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <h3 className="font-semibold text-white mb-2 group-hover:text-[var(--primary)] transition-colors">{event.title}</h3>
                        {event.description && (
                          <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sağ Dikey Banner - Sadece varsa göster */}
          {rightBanner && (
            <div className="hidden lg:block w-36 xl:w-44 flex-shrink-0">
              <div className="side-banner">
                <div
                  onClick={() => handleBannerClick(rightBanner.linkUrl)}
                  className="side-banner-item block hover:opacity-90 transition-opacity cursor-pointer bg-[var(--surface)]"
                >
                  <div className="p-2 flex items-center justify-center min-h-[200px]">
                    <img
                      src={rightBanner.imageUrl}
                      alt="Banner"
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <SponsorPopup />
    </MainLayout>
  );
}
