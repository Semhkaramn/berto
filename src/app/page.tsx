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

  const handleEventClick = (linkUrl: string) => {
    if (linkUrl) {
      window.open(normalizeUrl(linkUrl), "_blank", "noopener,noreferrer");
    }
  };

  const handleBannerClick = (linkUrl: string | null) => {
    if (linkUrl) {
      window.open(normalizeUrl(linkUrl), "_blank", "noopener,noreferrer");
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
      <div className="p-4 md:p-6 lg:p-8">
        {/* Main Layout with Side Banners */}
        <div className="flex gap-4">
          {/* Sol Dikey Banner - Sadece varsa göster */}
          {leftBanner && (
            <div className="hidden lg:block w-44 xl:w-52 flex-shrink-0">
              <div
                onClick={() => handleBannerClick(leftBanner.linkUrl)}
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
              <Link href="/sponsors" className="card group cursor-pointer overflow-hidden">
                <div className="h-40 gradient-main flex items-center justify-center relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-[var(--primary)] transition-colors">Sponsorlar</h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {sponsors.length} aktif sponsor
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center group-hover:bg-[var(--primary)]/20 transition-colors">
                      <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Events Card */}
              <Link href="/events" className="card group cursor-pointer overflow-hidden">
                <div className="h-40 gradient-vip flex items-center justify-center relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-purple-400 transition-colors">Etkinlikler</h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {events.length} yaklasan etkinlik
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Live Stream Card */}
              <Link href="/live" className="card group cursor-pointer overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center relative overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {activeLiveStream && (
                    <div className="absolute top-3 right-3 z-20">
                      <span className="badge badge-live flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        CANLI
                      </span>
                    </div>
                  )}
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-b from-[var(--surface)] to-[var(--background)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-red-400 transition-colors">Canli Yayin</h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {activeLiveStream ? "Yayin devam ediyor!" : "Yayin yok"}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
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
                          <p className="text-sm text-[var(--text-muted)] whitespace-pre-line">
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
            <div className="hidden lg:block w-44 xl:w-52 flex-shrink-0">
              <div
                onClick={() => handleBannerClick(rightBanner.linkUrl)}
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
