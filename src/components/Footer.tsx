"use client";

import { useData } from "@/lib/DataContext";
import { normalizeUrl } from "@/lib/utils";

export default function Footer() {
  const { stats } = useData();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-4 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[var(--primary)]">{stats.totalVisitors.toLocaleString()}</span>
            <span className="text-xs text-[var(--text-muted)]">Ziyaret</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-green-500">{stats.uniqueVisitors.toLocaleString()}</span>
            <span className="text-xs text-[var(--text-muted)]">Benzersiz</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-500">{stats.todayVisitors.toLocaleString()}</span>
            <span className="text-xs text-[var(--text-muted)]">Bugün</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)]">
            2024 Slot Berto Tüm hakları saklıdır.
          </p>
          <a
            href={normalizeUrl("https://t.me/thisisarche")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
             This App Provided By Arche
          </a>
        </div>
      </div>
    </footer>
  );
}
