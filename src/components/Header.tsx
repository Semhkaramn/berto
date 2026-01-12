"use client";

import Link from "next/link";

interface HeaderProps {
  siteName: string;
  logoUrl?: string;
}

export default function Header({ siteName, logoUrl }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
      <div className="flex items-center justify-center px-4 md:px-6 h-16">
        {/* Logo & Site Name - Ortada */}
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
              <img src={logoUrl} alt={siteName} className="max-w-full max-h-full w-auto h-auto object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg gradient-main flex items-center justify-center">
              <span className="text-xl font-bold text-white">S</span>
            </div>
          )}
          <span className="text-xl font-bold text-white">{siteName}</span>
        </Link>
      </div>
    </header>
  );
}
