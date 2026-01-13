"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import SnowEffect from "./SnowEffect";

// Sabit site bilgileri - GitHub'dan logo
const SITE_NAME = "Slot Berto";
const SITE_LOGO = "/logo.png";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [snowEnabled, setSnowEnabled] = useState(true);
  const pathname = usePathname();

  // Sayfa değiştiğinde mobil menüyü kapat
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // LocalStorage'dan kar efekti durumunu yükle
  useEffect(() => {
    const saved = localStorage.getItem("snowEnabled");
    if (saved !== null) {
      setSnowEnabled(saved === "true");
    }
  }, []);

  // Kar efekti toggle
  const toggleSnow = () => {
    const newState = !snowEnabled;
    setSnowEnabled(newState);
    localStorage.setItem("snowEnabled", String(newState));
  };

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
      <SnowEffect enabled={snowEnabled} />
      <Header
        siteName={SITE_NAME}
        logoUrl={SITE_LOGO}
        onMenuToggle={toggleMobileMenu}
        isMobileMenuOpen={isMobileMenuOpen}
        snowEnabled={snowEnabled}
        onSnowToggle={toggleSnow}
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
