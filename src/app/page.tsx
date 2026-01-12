"use client";

import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import SponsorPopup from "@/components/SponsorPopup";
import { useData } from "@/lib/DataContext";
import { normalizeUrl } from "@/lib/utils";

export default function HomePage() {
  const { banners, sponsors, events, liveStreams, isLoading } = useData();

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

  // Tıklama takibi fonksiyonu
  const trackClick = async (type: string, targetId: string) => {
    try {
      await fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, targetId }),
      });
    } catch (error) {
      console.error("Track click error:", error);
    }
  };

  const handleEventClick = (event: { id: string; linkUrl: string }) => {
    if (event.linkUrl) {
      trackClick("event", event.id);
      window.open(normalizeUrl(event.linkUrl), "_blank", "noopener,noreferrer");
    }
  };

  const handleBannerClick = (banner: { id: string; linkUrl: string | null }) => {
    if (banner.linkUrl) {
      trackClick("banner", banner.id);
      window.open(normalizeUrl(banner.linkUrl), "_blank", "noopener,noreferrer");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[var(--text-muted)]">Yukleniyor...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Main Layout with Side Banners */}
        <div className="flex gap-4">
          {/* Sol Dikey Banner - Sadece büyük ekranlarda */}
          {leftBanner && (
            <div className="hidden xl:block w-44 2xl:w-52 flex-shrink-0">
              <div
                onClick={() => handleBannerClick(leftBanner)}
                className="sticky top-4 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img
                  src={leftBanner.imageUrl}
                  alt="Banner"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Ana İçerik */}
          <div className="flex-1 min-w-0">
            {/* Üst Yatay Bannerlar - Tam genişlik */}
            {hasTopBanners && (
              <div className="space-y-3 mb-6">
                {topBanner1 && (
                  <div
                    onClick={() => handleBannerClick(topBanner1)}
                    className="block hover:opacity-90 transition-opacity cursor-pointer bg-[var(--surface)] rounded-lg overflow-hidden w-full"
                  >
                    <div className="w-full">
                      <img src={topBanner1.imageUrl} alt="Banner" className="w-full h-auto object-cover" />
                    </div>
                  </div>
                )}
                {topBanner2 && (
                  <div
                    onClick={() => handleBannerClick(topBanner2)}
                    className="block hover:opacity-90 transition-opacity cursor-pointer bg-[var(--surface)] rounded-lg overflow-hidden w-full"
                  >
                    <div className="w-full">
                      <img src={topBanner2.imageUrl} alt="Banner" className="w-full h-auto object-cover" />
                    </div>
                  </div>
                )}
                {topBanner3 && (
                  <div
                    onClick={() => handleBannerClick(topBanner3)}
                    className="block hover:opacity-90 transition-opacity cursor-pointer bg-[var(--surface)] rounded-lg overflow-hidden w-full"
                  >
                    <div className="w-full">
                      <img src={topBanner3.imageUrl} alt="Banner" className="w-full h-auto object-cover" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Access Cards - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
              {/* Sponsors Card */}
              <Link href="/sponsors" className="card group cursor-pointer overflow-hidden">
                <div className="h-32 sm:h-36 md:h-40 gradient-main flex items-center justify-center relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="relative z-10 w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 group-hover:text-[var(--primary)] transition-colors truncate">Sponsorlar</h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                        {sponsors.length} aktif sponsor
                      </p>
                    </div>
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center group-hover:bg-[var(--primary)]/20 transition-colors flex-shrink-0 ml-2">
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Events Card */}
              <Link href="/events" className="card group cursor-pointer overflow-hidden">
                <div className="h-32 sm:h-36 md:h-40 gradient-vip flex items-center justify-center relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="relative z-10 w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 group-hover:text-purple-400 transition-colors truncate">Etkinlikler</h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                        {events.length} yaklasan etkinlik
                      </p>
                    </div>
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors flex-shrink-0 ml-2">
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Live Stream Card */}
              <Link href="/live" className="card group cursor-pointer overflow-hidden sm:col-span-2 lg:col-span-1">
                <div className="h-32 sm:h-36 md:h-40 bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {activeLiveStream && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
                      <span className="badge badge-live flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white animate-pulse" />
                        CANLI
                      </span>
                    </div>
                  )}
                  <div className="relative z-10 w-16 sm:w-18 md:w-20 h-16 sm:h-18 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 group-hover:text-red-400 transition-colors truncate">Yayinlar</h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                        {activeLiveStream ? "Yayin devam ediyor!" : "Yayin yok"}
                      </p>
                    </div>
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors flex-shrink-0 ml-2">
                      <svg className="w-4 sm:w-5 h-4 sm:h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Latest Events - Responsive cards */}
            {events.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Son Etkinlikler</h2>
                  <Link href="/events" className="text-xs sm:text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] font-medium">
                    Tumunu Gor
                  </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {events.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className="card cursor-pointer group overflow-hidden"
                    >
                      {/* Mobilde dikey, tablet ve üstünde yatay layout */}
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-40 md:w-44 h-32 sm:h-28 bg-gradient-to-br from-[var(--surface-hover)] to-[var(--surface)] flex items-center justify-center p-3 flex-shrink-0">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-3 sm:p-4 flex-1 min-w-0">
                          <h3 className="font-semibold text-white mb-1 sm:mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">{event.title}</h3>
                          {event.description && (
                            <p className="text-xs sm:text-sm text-[var(--text-muted)] whitespace-pre-line line-clamp-3">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sağ Dikey Banner - Sadece büyük ekranlarda */}
          {rightBanner && (
            <div className="hidden xl:block w-44 2xl:w-52 flex-shrink-0">
              <div
                onClick={() => handleBannerClick(rightBanner)}
                className="sticky top-4 hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img
                  src={rightBanner.imageUrl}
                  alt="Banner"
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <SponsorPopup />
    </MainLayout>
  );
}
