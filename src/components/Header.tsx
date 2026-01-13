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

        {/* Logo - Ortada */}
        <Link href="/" className="flex items-center justify-center">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-12 w-auto object-contain" />
          ) : (
            <div className="w-12 h-12 rounded-lg gradient-main flex items-center justify-center">
              <span className="text-2xl font-bold text-white">S</span>
            </div>
          )}
        </Link>

        {/* Snow Toggle Button - Sag tarafta */}
        <button
          type="button"
          onClick={onSnowToggle}
          className={`absolute right-4 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
            snowEnabled
              ? 'bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-[#7dd3fc] border border-[#7dd3fc]/40 shadow-[0_0_15px_rgba(125,211,252,0.3)]'
              : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:text-white hover:border-[var(--text-muted)]'
          }`}
          aria-label="Kar Efekti"
          title={snowEnabled ? "Kar Efektini Kapat" : "Kar Efektini Aç"}
        >
          {/* Snowflake Icon */}
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${snowEnabled ? 'animate-spin-slow' : ''}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11 1h2v5.17l2.88-2.88 1.41 1.41L13 8.17V11h2.83l3.47-3.47 1.41 1.41L17.83 12l2.88 2.88-1.41 1.41L16.42 13H13v2.83l4.29 4.3-1.41 1.41L13 18.83V23h-2v-4.17l-2.88 2.88-1.41-1.41L10.17 17V13.17H7.42l-3.46 3.47-1.41-1.41L5.42 12 2.54 9.12l1.41-1.41 3.47 3.46h2.75V8.17L6.71 3.7l1.41-1.41L11 5.17V1z"/>
          </svg>

          {/* Toggle Indicator */}
          <div className={`w-8 h-4 rounded-full relative transition-all duration-300 ${
            snowEnabled
              ? 'bg-[#7dd3fc]'
              : 'bg-gray-600'
          }`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-md transition-all duration-300 ${
              snowEnabled
                ? 'left-[18px]'
                : 'left-0.5'
            }`} />
          </div>
        </button>
      </div>
    </header>
  );
}
