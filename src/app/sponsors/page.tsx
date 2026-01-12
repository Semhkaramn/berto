"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";

interface Sponsor {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
  type: string;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await fetch("/api/sponsors");
        if (res.ok) {
          setSponsors(await res.json());
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchSponsors();
  }, []);

  const mainSponsors = sponsors.filter((s) => s.type === "main");
  const vipSponsors = sponsors.filter((s) => s.type === "vip");
  const normalSponsors = sponsors.filter((s) => s.type === "normal");

  const handleSponsorClick = (linkUrl: string) => {
    if (linkUrl) {
      window.open(linkUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Sponsorlarimiz</h1>
          <p className="text-[var(--text-muted)] mb-8">
            Bizi destekleyen degerli sponsorlarimiz
          </p>

          {/* Main Sponsors */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 gradient-main rounded-full" />
              <h2 className="text-2xl font-bold text-white">Ana Sponsorlar</h2>
              <span className="badge badge-main">MAIN</span>
            </div>
            {mainSponsors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mainSponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    onClick={() => handleSponsorClick(sponsor.linkUrl)}
                    className="group relative overflow-hidden rounded-2xl cursor-pointer animate-fadeIn sponsor-card-main"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 gradient-main opacity-90" />

                    {/* Logo Container */}
                    <div className="relative p-6 flex flex-col h-80">
                      {/* Logo */}
                      <div className="flex-1 flex items-center justify-center p-4">
                        <img
                          src={sponsor.imageUrl}
                          alt={sponsor.name}
                          className="max-w-full max-h-40 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Info */}
                      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 mt-auto">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{sponsor.name}</h3>
                            <span className="text-sm text-white/70">Ana Sponsor</span>
                          </div>
                        </div>
                        {sponsor.description && (
                          <p className="text-white/80 text-sm line-clamp-2">{sponsor.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                <p className="text-[var(--text-muted)]">Henuz ana sponsor yok</p>
              </div>
            )}
          </section>

          {/* VIP Sponsors */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 gradient-vip rounded-full" />
              <h2 className="text-2xl font-bold text-white">VIP Sponsorlar</h2>
              <span className="badge badge-vip">VIP</span>
            </div>
            {vipSponsors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {vipSponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    onClick={() => handleSponsorClick(sponsor.linkUrl)}
                    className="group relative overflow-hidden rounded-xl cursor-pointer animate-fadeIn sponsor-card-vip"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Background Gradient */}
                    <div className="absolute inset-0 gradient-vip opacity-80" />

                    {/* Content */}
                    <div className="relative p-5 flex flex-col h-64">
                      {/* Logo */}
                      <div className="flex-1 flex items-center justify-center p-3">
                        <img
                          src={sponsor.imageUrl}
                          alt={sponsor.name}
                          className="max-w-full max-h-28 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Info */}
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                          <span className="text-white font-semibold">{sponsor.name}</span>
                        </div>
                        {sponsor.description && (
                          <p className="text-white/70 text-sm line-clamp-2">{sponsor.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Hover Border */}
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-xl transition-colors duration-300" />

                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                <p className="text-[var(--text-muted)]">Henuz VIP sponsor yok</p>
              </div>
            )}
          </section>

          {/* Normal Sponsors */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 gradient-normal rounded-full" />
              <h2 className="text-2xl font-bold text-white">Sponsorlar</h2>
              <span className="badge badge-normal">NORMAL</span>
            </div>
            {normalSponsors.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {normalSponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    onClick={() => handleSponsorClick(sponsor.linkUrl)}
                    className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden cursor-pointer animate-fadeIn hover:border-[var(--primary)]/50 hover:shadow-lg hover:shadow-[var(--primary)]/10 transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Logo */}
                    <div className="h-32 bg-gradient-to-br from-[var(--surface-hover)] to-[var(--surface)] flex items-center justify-center p-4">
                      <img
                        src={sponsor.imageUrl}
                        alt={sponsor.name}
                        className="max-w-full max-h-24 object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3 border-t border-[var(--border)]">
                      <h3 className="font-medium text-white text-sm truncate">{sponsor.name}</h3>
                      {sponsor.description && (
                        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">{sponsor.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                <p className="text-[var(--text-muted)]">Henuz sponsor yok</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
