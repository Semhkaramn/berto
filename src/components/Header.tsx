"use client";

import Link from "next/link";

interface HeaderProps {
  siteName: string;
  logoUrl?: string;
  onMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
  snowEnabled?: boolean;
  onSnowToggle?: () => void;
}

export default function Header({ siteName, logoUrl, onMenuToggle, isMobileMenuOpen, snowEnabled, onSnowToggle }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)]" style={{ backgroundColor: '#0c1623' }}>
      <div className="flex items-center justify-center px-4 md:px-6 h-16 relative">
        {/* Mobile Menu Button - Sol tarafta mutlak konumlandırma */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)] transition-colors absolute left-4"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

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

        {/* Snow Toggle Button - Sag tarafta */}
        <button
          type="button"
          onClick={onSnowToggle}
          className={`absolute right-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            snowEnabled
              ? 'bg-[#7dd3fc]/20 text-[#7dd3fc] border border-[#7dd3fc]/30'
              : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-hover)]'
          }`}
          aria-label="Kar Efekti"
          title={snowEnabled ? "Kar Efektini Kapat" : "Kar Efektini Ac"}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L9.5 6.5L4 7L8 11L7 17L12 14L17 17L16 11L20 7L14.5 6.5L12 2Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
