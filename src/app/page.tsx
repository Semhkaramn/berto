"use client";

import Link from "next/link";
import MainLayout from "@/components/MainLayout";
import SponsorPopup from "@/components/SponsorPopup";
import { useData } from "@/lib/DataContext";
import { normalizeUrl } from "@/lib/utils";

export default function HomePage() {
  const { banners, sponsors, events, liveStreams, telegramChannels, isLoading } = useData();

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

            {/* Telegram Kanalları Kartları */}
            {telegramChannels.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {telegramChannels.slice(0, 2).map((channel) => (
                  <a
                    key={channel.id}
                    href={`https://t.me/${channel.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-gradient-to-br from-[#0088cc]/20 to-[#0088cc]/5 border border-[#0088cc]/30 rounded-xl p-4 hover:border-[#0088cc]/60 hover:from-[#0088cc]/30 hover:to-[#0088cc]/10 transition-all duration-300 "
                  >
                    <div className="flex items-center gap-4">
                      {/* Kanal Fotoğrafı */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0088cc]/30 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {channel.photoUrl ? (
                          <img
                            src={channel.photoUrl}
                            alt={channel.title || channel.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        )}
                      </div>

                      {/* Kanal Bilgileri */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white group-hover:text-[#0088cc] transition-colors break-words">
                            {channel.title || channel.username}
                          </h3>
                          <svg className="w-4 h-4 text-[#0088cc] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                        </div>
                        <p className="text-sm text-[#0088cc]">@{channel.username}</p>
                        {channel.memberCount && (
                          <p className="text-xs text-[var(--text-muted)] mt-1">
                            {channel.memberCount.toLocaleString()} uye
                          </p>
                        )}
                      </div>

                      {/* Ok İkonu */}
                      <div className="w-8 h-8 rounded-full bg-[#0088cc]/20 flex items-center justify-center group-hover:bg-[#0088cc]/40 transition-colors flex-shrink-0">
                        <svg className="w-4 h-4 text-[#0088cc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Açıklama */}
                    {channel.description && (
                      <p className="text-xs text-[var(--text-muted)] mt-3 line-clamp-2 pl-18 sm:pl-20">
                        {channel.description}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            )}

            {/* Quick Access Cards - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
              {/* Sponsors Card */}
              <Link href="/sponsors" className="card group cursor-pointer overflow-hidden flex flex-col ">
                <div className="relative overflow-hidden aspect-[16/10] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-hover)] to-[var(--surface)]">
                  {/* Background Image - tam sığacak şekilde */}
                  <img
                    src="/sponsorlar.jpg"
                    alt="Sponsorlar"
                    className="absolute inset-0 w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-b from-[var(--surface)] to-[var(--background)] flex-1">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 group-hover:text-[var(--primary)] transition-colors">SPONSORLAR</h3>
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
              <Link href="/events" className="card group cursor-pointer overflow-hidden flex flex-col ">
                <div className="relative overflow-hidden aspect-[16/10] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-hover)] to-[var(--surface)]">
                  {/* Background Image - tam sığacak şekilde */}
                  <img
                    src="/etkinlikler.jpg"
                    alt="Etkinlikler"
                    className="absolute inset-0 w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-b from-[var(--surface)] to-[var(--background)] flex-1">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 group-hover:text-purple-400 transition-colors">ETKİNLİKLER</h3>
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
              <Link href="/live" className="card group cursor-pointer overflow-hidden flex flex-col sm:col-span-2 lg:col-span-1 ">
                <div className="relative overflow-hidden aspect-[16/10] bg-gradient-to-br from-[var(--surface)] via-[var(--surface-hover)] to-[var(--surface)]">
                  {/* Background Image - tam sığacak şekilde */}
                  <img
                    src="/yayinlar.jpg"
                    alt="Yayinlar"
                    className="absolute inset-0 w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  {activeLiveStream && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-20">
                      <span className="badge badge-live flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white animate-pulse" />
                        CANLI
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-b from-[var(--surface)] to-[var(--background)] flex-1">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-0.5 group-hover:text-red-400 transition-colors">CANLI YAYIN</h3>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                        {activeLiveStream ? "Yayın devam ediyor!" : "Yayin yok"}
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
                    Tümünü Gör
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      className="card cursor-pointer group overflow-hidden "
                    >
                      {/* Dikey layout - tam sığacak şekilde */}
                      <div className="flex flex-col">
                        <div className="relative aspect-[16/10] bg-gradient-to-br from-[var(--surface-hover)] to-[var(--surface)] overflow-hidden">
                          {/* Status Badge */}
                          <div className="absolute top-3 right-3 z-10">
                            {event.status === "completed" ? (
                              <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-red-600 text-white shadow-lg ">
                                Bitti
                              </span>
                            ) : (
                              <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-500 text-white shadow-lg ">
                                Aktif
                              </span>
                            )}
                          </div>
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="font-semibold text-white mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">{event.title}</h3>
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
