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
                  <a
                    key={sponsor.id}
                    href={sponsor.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 gradient-main opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <img
                      src={sponsor.imageUrl}
                      alt={sponsor.name}
                      className="w-full h-72 object-cover mix-blend-overlay"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </a>
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
                  <a
                    key={sponsor.id}
                    href={sponsor.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-xl animate-fadeIn"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 gradient-vip opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <img
                      src={sponsor.imageUrl}
                      alt={sponsor.name}
                      className="w-full h-56 object-cover mix-blend-overlay"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                        <span className="text-white font-semibold">{sponsor.name}</span>
                      </div>
                      {sponsor.description && (
                        <p className="text-white/70 text-sm line-clamp-2">{sponsor.description}</p>
                      )}
                    </div>
                    <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-xl transition-colors" />
                  </a>
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
                  <a
                    key={sponsor.id}
                    href={sponsor.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <img
                      src={sponsor.imageUrl}
                      alt={sponsor.name}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-medium text-white text-sm truncate">{sponsor.name}</h3>
                      {sponsor.description && (
                        <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">{sponsor.description}</p>
                      )}
                    </div>
                  </a>
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
