"use client";

import { useMemo, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { useData } from "@/lib/DataContext";
import { normalizeUrl } from "@/lib/utils";

// Particle component for background effects
const Particles = ({ count = 6, color = "primary" }: { count?: number; color?: string }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      size: `${2 + Math.random() * 4}px`,
    }));
  }, [count]);

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className={`particle ${color === 'vip' ? 'bg-purple-400' : 'bg-orange-400'}`}
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </>
  );
};

// Crown Icon for Main Sponsors
const CrownIcon = () => (
  <svg className="w-6 h-6 text-yellow-400 crown-icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
  </svg>
);

// Star Icon for VIP Sponsors
const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 text-purple-300 twinkle-star ${className}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
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
          {/* Hero Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Sponsorlar - Berto’nun Güvenle Oynadığı Siteler</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]"
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
                className="w-full pl-12 pr-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-center text-sm text-[var(--text-muted)] mt-2">
                {filteredSponsors.length} sonuc bulundu
              </p>
            )}
          </div>

          {isLoading && (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--text-muted)]">Sponsorlar yukleniyor...</p>
            </div>
          )}

          {/* ==================== MAIN SPONSORS ==================== */}
          {!isLoading && mainSponsors.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
                <div className="flex items-center gap-3">
                  <CrownIcon />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Ana Sponsorlar</h2>
                  <CrownIcon />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {mainSponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    onClick={() => handleSponsorClick(sponsor)}
                    className="group relative sponsor-card-main rounded-2xl cursor-pointer glow-main animate-fadeIn"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Ribbon */}
                    <div className="ribbon" />

                    {/* Particles */}
                    <Particles count={8} color="main" />

                    {/* Shine Effect */}
                    <div className="shine-effect" />

                    <div className="relative p-8 flex flex-col z-10">
                      {/* Logo Container */}
                      <div className="flex-1 flex items-center justify-center p-6">
                        <div className="relative animate-float">
                          <img
                            src={sponsor.imageUrl}
                            alt={sponsor.name}
                            className="max-w-full max-h-48 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Glow behind logo */}
                          <div className="absolute inset-0 blur-3xl bg-orange-500/30 -z-10 scale-150 group-hover:bg-orange-500/50 transition-colors duration-500" />
                        </div>
                      </div>

                      {/* Info Card */}
                      <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <CrownIcon />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white">{sponsor.name}</h3>
                            <span className="text-sm text-orange-300 font-medium">Ana Sponsor</span>
                          </div>
                          {/* Visit Button */}
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </div>
                        {sponsor.description && (
                          <p className="text-white/80 text-sm whitespace-pre-line">{sponsor.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================== VIP SPONSORS ==================== */}
          {!isLoading && vipSponsors.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                <div className="flex items-center gap-3">
                  <StarIcon />
                  <h2 className="text-2xl md:text-3xl font-bold text-white">VIP Sponsorlar</h2>
                  <StarIcon />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vipSponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    onClick={() => handleSponsorClick(sponsor)}
                    className="group relative sponsor-card-vip rounded-xl cursor-pointer glow-vip animate-fadeIn spring-hover"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* VIP Ribbon */}
                    <div className="ribbon ribbon-vip" />

                    {/* Particles */}
                    <Particles count={5} color="vip" />

                    {/* Shine Effect */}
                    <div className="shine-effect" />

                    <div className="relative p-6 flex flex-col z-10">
                      {/* Logo */}
                      <div className="flex-1 flex items-center justify-center p-4">
                        <img
                          src={sponsor.imageUrl}
                          alt={sponsor.name}
                          className="max-w-full max-h-32 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Info */}
                      <div className="bg-black/40 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <StarIcon className="w-4 h-4" />
                          </div>
                          <span className="text-white font-semibold text-lg">{sponsor.name}</span>
                        </div>
                        {sponsor.description && (
                          <p className="text-white/70 text-sm whitespace-pre-line">{sponsor.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Hover Border Glow */}
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-purple-400/50 rounded-xl transition-colors duration-300 pointer-events-none" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ==================== NORMAL SPONSORS ==================== */}
          {!isLoading && normalSponsors.length > 0 && (
            <section>
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <h2 className="text-xl md:text-2xl font-bold text-white">Sponsorlar</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {normalSponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    onClick={() => handleSponsorClick(sponsor)}
                    className="group sponsor-card-normal rounded-xl overflow-hidden cursor-pointer animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Logo Container */}
                    <div className="h-28 bg-gradient-to-br from-[var(--surface-hover)] to-[var(--surface)] flex items-center justify-center p-4 relative overflow-hidden">
                      <img
                        src={sponsor.imageUrl}
                        alt={sponsor.name}
                        className="max-w-full max-h-20 object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Subtle shine on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700" />
                    </div>

                    {/* Info */}
                    <div className="p-3 border-t border-[var(--border)]">
                      <h3 className="font-medium text-white text-sm truncate group-hover:text-blue-400 transition-colors">{sponsor.name}</h3>
                      {sponsor.description && (
                        <p className="text-xs text-[var(--text-muted)] mt-1 whitespace-pre-line">{sponsor.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {!isLoading && filteredSponsors.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto rounded-full bg-[var(--surface)] flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Henuz sponsor yok</h3>
              <p className="text-[var(--text-muted)]">Sponsorlar eklendiginde burada gorunecek</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
