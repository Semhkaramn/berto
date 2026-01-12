"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

interface Stats {
  totalVisitors: number;
  uniqueVisitors: number;
  todayVisitors: number;
  totalClicks: number;
  sponsorClicks: number;
  bannerClicks: number;
  eventClicks: number;
  popupClicks: number;
}

interface TopItem {
  id: string;
  name: string;
  clicks: number;
  type?: string;
}

interface RecentClick {
  id: string;
  type: string;
  targetName: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    todayVisitors: 0,
    totalClicks: 0,
    sponsorClicks: 0,
    bannerClicks: 0,
    eventClicks: 0,
    popupClicks: 0,
  });
  const [topSponsors, setTopSponsors] = useState<TopItem[]>([]);
  const [topBanners, setTopBanners] = useState<TopItem[]>([]);
  const [recentClicks, setRecentClicks] = useState<RecentClick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, sponsorsRes, bannersRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/sponsors"),
          fetch("/api/banners"),
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }

        if (sponsorsRes.ok) {
          const sponsors = await sponsorsRes.json();
          const sorted = sponsors
            .sort((a: TopItem, b: TopItem) => (b.clicks || 0) - (a.clicks || 0))
            .slice(0, 5)
            .map((s: { id: string; name: string; clickCount?: number; type?: string }) => ({
              id: s.id,
              name: s.name,
              clicks: s.clickCount || 0,
              type: s.type,
            }));
          setTopSponsors(sorted);
        }

        if (bannersRes.ok) {
          const banners = await bannersRes.json();
          const sorted = banners
            .sort((a: TopItem, b: TopItem) => (b.clicks || 0) - (a.clicks || 0))
            .slice(0, 5)
            .map((b: { id: string; position: string; clickCount?: number }) => ({
              id: b.id,
              name: b.position,
              clicks: b.clickCount || 0,
            }));
          setTopBanners(sorted);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: "Toplam Ziyaret", value: stats.totalVisitors, color: "text-[var(--primary)]", bg: "from-orange-500/20 to-orange-600/10" },
    { label: "Benzersiz Ziyaretci", value: stats.uniqueVisitors, color: "text-green-500", bg: "from-green-500/20 to-green-600/10" },
    { label: "Bugünün Ziyaretcileri", value: stats.todayVisitors, color: "text-blue-500", bg: "from-blue-500/20 to-blue-600/10" },
    { label: "Toplam Tıklanma", value: stats.totalClicks || 0, color: "text-purple-500", bg: "from-purple-500/20 to-purple-600/10" },
  ];

  const clickStats = [
    { label: "Sponsor Tıklamaları", value: stats.sponsorClicks || 0, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "Banner Tıklamaları", value: stats.bannerClicks || 0, icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Etkinlik Tıklamaları", value: stats.eventClicks || 0, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { label: "Popup Tıklamaları", value: stats.popupClicks || 0, icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat) => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.bg} border border-[var(--border)] rounded-xl p-4`}>
              <p className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</p>
              <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Click Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {clickStats.map((stat) => (
            <div key={stat.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--background)] flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Sponsors */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-4">En Çok Tıklanan Sponsorlar</h2>
            {topSponsors.length > 0 ? (
              <div className="space-y-3">
                {topSponsors.map((sponsor, index) => (
                  <div key={sponsor.id} className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-white font-medium text-sm">{sponsor.name}</p>
                        {sponsor.type && (
                          <span className={`text-xs badge badge-${sponsor.type}`}>{sponsor.type.toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[var(--primary)] font-bold">{sponsor.clicks}</p>
                      <p className="text-xs text-[var(--text-muted)]">Tıklanma</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-muted)] text-center py-8">Henüz veri yok</p>
            )}
          </div>

          {/* Top Banners */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="text-lg font-semibold text-white mb-4">En Cok Tıklanan Bannerlar</h2>
            {topBanners.length > 0 ? (
              <div className="space-y-3">
                {topBanners.map((banner, index) => (
                  <div key={banner.id} className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <p className="text-white font-medium text-sm capitalize">{banner.name.replace("-", " ")} Banner</p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-500 font-bold">{banner.clicks}</p>
                      <p className="text-xs text-[var(--text-muted)]">Tıklanma</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--text-muted)] text-center py-8">Henuz veri yok</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
          <h2 className="text-lg font-semibold text-white mb-4">Hızlı işlemler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="/admin/sponsors" className="p-4 bg-[var(--background)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg gradient-main flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-sm text-white font-medium">Sponsor Ekle</p>
            </a>
            <a href="/admin/banners" className="p-4 bg-[var(--background)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg gradient-vip flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-white font-medium">Banner Ekle</p>
            </a>
            <a href="/admin/events" className="p-4 bg-[var(--background)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-white font-medium">Etkinlik Ekle</p>
            </a>
            <a href="/admin/livestreams" className="p-4 bg-[var(--background)] rounded-lg hover:bg-[var(--surface-hover)] transition-colors text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-white font-medium">Yayın Ekle</p>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
