"use client";

import { useMemo, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useData } from "@/lib/DataContext";
import { normalizeUrl } from "@/lib/utils";
import SponsorCard from "@/components/SponsorCard";

// Crown Icon for section headers with glow effect
const CrownIcon = () => (
  <div className="relative">
    <div className="absolute inset-0 blur-md bg-yellow-400/50" />
    <svg className="relative w-7 h-7 text-yellow-400 crown-icon drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
    </svg>
  </div>
);

// Star Icon for section headers with glow effect
const StarIcon = () => (
  <div className="relative">
    <div className="absolute inset-0 blur-sm bg-purple-400/50" />
    <svg className="relative w-6 h-6 text-purple-300 twinkle-star drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  </div>
);

// Diamond Icon for normal sponsors
const DiamondIcon = () => (
  <div className="relative">
    <div className="absolute inset-0 blur-sm bg-sky-400/40" />
    <svg className="relative w-5 h-5 text-sky-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L2 9l10 13 10-13L12 2zm0 3.84L18.26 9 12 18.18 5.74 9 12 5.84z"/>
    </svg>
  </div>
);

export default function SponsorsPage() {
  const { sponsors, isLoading } = useData();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter sponsors by name
  const filteredSponsors = useMemo(() => {
    if (!searchQuery.trim()) return sponsors;
    const query = searchQuery.toLowerCase().trim();
    return sponsors.filter((s) => s.name.toLowerCase().includes(query));
  }, [sponsors, searchQuery]);

  const mainSponsors = filteredSponsors.filter((s) => s.type === "main");
  const vipSponsors = filteredSponsors.filter((s) => s.type === "vip");
  const normalSponsors = filteredSponsors.filter((s) => s.type === "normal");

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

  const handleSponsorClick = (sponsor: { id: string; linkUrl: string }) => {
    if (sponsor.linkUrl) {
      trackClick("sponsor", sponsor.id);
      window.open(normalizeUrl(sponsor.linkUrl), "_blank", "noopener,noreferrer");
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Header - Premium */}
          <div className="text-center mb-8 relative">
            {/* Background Glow */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-sky-500/10 blur-3xl rounded-full" />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 whitespace-nowrap">
              <span
                className="bg-gradient-to-r from-sky-300 via-cyan-200 to-sky-400 bg-clip-text text-transparent"
                style={{
                  textShadow: '0 0 40px rgba(125, 211, 252, 0.3)',
                }}
              >
                Berto'nun Güvenle Oynadığı Siteler
              </span>
            </h1>
          </div>

          {/* Search Bar - Compact Design */}
          <div className="max-w-xs mx-auto mb-10">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500/20 via-cyan-500/20 to-sky-500/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/60 group-focus-within:text-sky-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Sponsor ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-sky-500/50 focus:bg-white/10 transition-all duration-300 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            {searchQuery && (
              <p className="text-center text-xs text-white/50 mt-2">
                <span className="font-semibold text-sky-400">{filteredSponsors.length}</span> sonuç bulundu
              </p>
            )}
          </div>

          {isLoading && (
            <div className="text-center py-24">
              <div className="relative w-16 h-16 mx-auto mb-6">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 blur-lg opacity-50 animate-pulse" />
                {/* Spinning border */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-400 border-r-cyan-400 animate-spin" />
                <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-sky-300 border-l-cyan-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                {/* Center dot */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 animate-pulse" />
              </div>
              <p className="text-white/60 text-lg">Sponsorlar yükleniyor...</p>
            </div>
          )}

          {/* ==================== MAIN SPONSORS ==================== */}
          {!isLoading && mainSponsors.length > 0 && (
            <section className="mb-20 relative">
              {/* Section Glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-2xl h-20 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
                  <CrownIcon />
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
                    Ana Sponsorlar
                  </h2>
                  <CrownIcon />
                </div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mainSponsors.map((sponsor, index) => (
                  <SponsorCard
                    key={sponsor.id}
                    sponsor={sponsor}
                    onClick={() => handleSponsorClick(sponsor)}
                    index={index}
                    type="main"
                  />
                ))}
              </div>
            </section>
          )}

          {/* ==================== VIP SPONSORS ==================== */}
          {!isLoading && vipSponsors.length > 0 && (
            <section className="mb-20 relative">
              {/* Section Glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-2xl h-20 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
                <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/15 to-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
                  <StarIcon />
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-200 to-purple-400 bg-clip-text text-transparent">
                    VIP Sponsorlar
                  </h2>
                  <StarIcon />
                </div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vipSponsors.map((sponsor, index) => (
                  <SponsorCard
                    key={sponsor.id}
                    sponsor={sponsor}
                    onClick={() => handleSponsorClick(sponsor)}
                    index={index}
                    type="vip"
                  />
                ))}
              </div>
            </section>
          )}

          {/* ==================== NORMAL SPONSORS ==================== */}
          {!isLoading && normalSponsors.length > 0 && (
            <section className="relative">
              {/* Section Glow */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-xl h-16 bg-gradient-to-r from-transparent via-sky-500/10 to-transparent blur-3xl pointer-events-none" />

              <div className="flex items-center justify-center gap-4 mb-10">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-sky-500/5 border border-sky-500/15 backdrop-blur-sm">
                  <DiamondIcon />
                  <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-300 via-cyan-200 to-sky-400 bg-clip-text text-transparent">
                    Sponsorlar
                  </h2>
                  <DiamondIcon />
                </div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {normalSponsors.map((sponsor, index) => (
                  <SponsorCard
                    key={sponsor.id}
                    sponsor={sponsor}
                    onClick={() => handleSponsorClick(sponsor)}
                    index={index}
                    type="normal"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty State - Premium */}
          {!isLoading && filteredSponsors.length === 0 && (
            <div className="text-center py-24">
              <div className="relative w-28 h-28 mx-auto mb-8">
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-full border border-white/10 animate-ping" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 rounded-full border border-white/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                {/* Main circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm flex items-center justify-center border border-white/10">
                  <svg className="w-14 h-14 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Henüz sponsor yok</h3>
              <p className="text-white/50 text-lg">Sponsorlar eklendiğinde burada görünecek</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
