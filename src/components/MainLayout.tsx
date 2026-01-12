"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

// Sabit site bilgileri - GitHub'dan logo
const SITE_NAME = "Berto";
const SITE_LOGO = "/logo.png";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Track visit
    const trackVisit = async () => {
      try {
        // Generate a simple visitor hash based on user agent and screen
        const visitorHash = btoa(
          `${navigator.userAgent}-${screen.width}-${screen.height}-${new Date().toDateString()}`
        ).slice(0, 32);

        await fetch("/api/track-visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorHash }),
        });
      } catch (error) {
        console.error("Track visit error:", error);
      }
    };
    trackVisit();
  }, []);

  // Mobil menü açıkken body scroll'u kapat
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header
        siteName={SITE_NAME}
        logoUrl={SITE_LOGO}
        onMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />

      {/* Main content area - sidebar'ın yanında (sadece desktop) */}
      <div className="md:ml-64 pt-16 min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
