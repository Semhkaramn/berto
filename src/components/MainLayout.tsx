"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface Settings {
  siteName: string;
  logoUrl: string | null;
  telegramUrl: string | null;
}

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [settings, setSettings] = useState<Settings>({
    siteName: "Sponsor Portal",
    logoUrl: null,
    telegramUrl: "https://t.me/username",
  });

  useEffect(() => {
    // Fetch settings
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Settings fetch error:", error);
      }
    };
    fetchSettings();

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header siteName={settings.siteName} logoUrl={settings.logoUrl || undefined} />
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
      <Footer telegramUrl={settings.telegramUrl || undefined} />
    </div>
  );
}
