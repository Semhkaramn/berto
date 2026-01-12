"use client";

import { useEffect, useState } from "react";

interface Stats {
  totalVisitors: number;
  uniqueVisitors: number;
  todayVisitors: number;
}

interface FooterProps {
  telegramUrl?: string;
}

export default function Footer({ telegramUrl }: FooterProps) {
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    todayVisitors: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Stats fetch error:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-6 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--background)] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-[var(--primary)]">{stats.totalVisitors.toLocaleString()}</p>
            <p className="text-sm text-[var(--text-muted)]">Toplam Ziyaret</p>
          </div>
          <div className="bg-[var(--background)] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{stats.uniqueVisitors.toLocaleString()}</p>
            <p className="text-sm text-[var(--text-muted)]">Benzersiz Ziyaretci</p>
          </div>
          <div className="bg-[var(--background)] rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{stats.todayVisitors.toLocaleString()}</p>
            <p className="text-sm text-[var(--text-muted)]">Bugun</p>
          </div>
        </div>

        {/* Copyright & Developer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)]">
            Tum haklar saklidir.
          </p>
          <a
            href={telegramUrl || "https://t.me/username"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Developed by @developer
          </a>
        </div>
      </div>
    </footer>
  );
}
