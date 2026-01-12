"use client";

import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  siteName: string;
  logoUrl?: string;
}

export default function Header({ siteName, logoUrl }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo & Site Name */}
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-lg gradient-main flex items-center justify-center">
              <span className="text-xl font-bold text-white">S</span>
            </div>
          )}
          <span className="text-xl font-bold text-white hidden sm:block">{siteName}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-[var(--text-muted)] hover:text-white transition-colors">
            Ana Sayfa
          </Link>
          <Link href="/sponsors" className="text-[var(--text-muted)] hover:text-white transition-colors">
            Sponsorlar
          </Link>
          <Link href="/events" className="text-[var(--text-muted)] hover:text-white transition-colors">
            Etkinlikler
          </Link>
          <Link href="/live" className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Canli Yayin
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-[var(--text-muted)] hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-[var(--border)] bg-[var(--surface)]">
          <Link href="/" className="block px-6 py-3 text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)]">
            Ana Sayfa
          </Link>
          <Link href="/sponsors" className="block px-6 py-3 text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)]">
            Sponsorlar
          </Link>
          <Link href="/events" className="block px-6 py-3 text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)]">
            Etkinlikler
          </Link>
          <Link href="/live" className="block px-6 py-3 text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Canli Yayin
          </Link>
        </nav>
      )}
    </header>
  );
}
