"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Stats {
  totalVisitors: number;
  uniqueVisitors: number;
  todayVisitors: number;
  totalClicks: number;
}

const menuItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/sponsors", label: "Sponsorlar", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/admin/popup", label: "Popup Sponsor", icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { href: "/admin/events", label: "Etkinlikler", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href: "/admin/content", label: "Yayinlar", icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" },
  { href: "/admin/banners", label: "Bannerlar", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href: "/admin/social", label: "Sosyal Medya", icon: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
  { href: "/admin/settings", label: "Ayarlar", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [stats, setStats] = useState<Stats>({ totalVisitors: 0, uniqueVisitors: 0, todayVisitors: 0, totalClicks: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (error) {
        console.error("Stats fetch error:", error);
      }
    };
    fetchStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[var(--surface-hover)]"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-main flex items-center justify-center">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span className="font-semibold text-white">Admin</span>
          </div>
          <button type="button" onClick={handleLogout} className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-red-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[var(--surface)] border-r border-[var(--border)] transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-main flex items-center justify-center">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-[var(--text-muted)]">Yonetim Paneli</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-[var(--border)]">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-[var(--background)] rounded-lg text-center">
              <p className="text-xs text-[var(--text-muted)]">Ziyaret</p>
              <p className="text-base font-bold text-[var(--primary)]">{stats.totalVisitors}</p>
            </div>
            <div className="p-2 bg-[var(--background)] rounded-lg text-center">
              <p className="text-xs text-[var(--text-muted)]">Benzersiz</p>
              <p className="text-base font-bold text-green-500">{stats.uniqueVisitors}</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-260px)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-[var(--primary)] text-white font-semibold"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-white"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[var(--border)]">
          <Link href="/" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-white text-sm mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Siteyi Gor
          </Link>
          <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cikis Yap
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">{children}</main>
    </div>
  );
}
