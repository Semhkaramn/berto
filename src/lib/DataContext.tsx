"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
}

interface Sponsor {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
  type: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
  status: string;
}

interface LiveStream {
  id: string;
  title: string;
  description: string | null;
  embedUrl: string;
  thumbnailUrl: string | null;
  isLive: boolean;
}

interface Video {
  id: string;
  title: string;
  description: string | null;
  embedUrl: string;
  thumbnailUrl: string | null;
}

interface SocialMedia {
  id: string;
  platform: string;
  name: string;
  linkUrl: string;
}

interface SiteSettings {
  siteName: string;
  logoUrl: string | null;
}

interface Stats {
  totalVisitors: number;
  uniqueVisitors: number;
  todayVisitors: number;
}

interface TelegramChannel {
  id: string;
  username: string;
  title: string | null;
  description: string | null;
  photoUrl: string | null;
  memberCount: number | null;
  isActive: boolean;
  sortOrder: number;
}

interface DataContextType {
  banners: Banner[];
  sponsors: Sponsor[];
  events: Event[];
  liveStreams: LiveStream[];
  videos: Video[];
  socialMedia: SocialMedia[];
  siteSettings: SiteSettings | null;
  stats: Stats;
  telegramChannels: TelegramChannel[];
  isLoading: boolean;
  isLoaded: boolean;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

// Global Loading Screen Component - Slot Berto Theme
function GlobalLoadingScreen() {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-yellow-500/20 via-amber-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffd700\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      </div>

      {/* Floating Coins */}
      {[...Array(12)].map((_, i) => (
        <div
          key={`coin-${i}`}
          className="absolute text-4xl animate-float-coin"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          💰
        </div>
      ))}

      {/* Floating Crowns */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`crown-${i}`}
          className="absolute text-3xl animate-float-crown"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
          }}
        >
          👑
        </div>
      ))}

      {/* Floating Diamonds */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`diamond-${i}`}
          className="absolute text-2xl animate-float-diamond"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3.5 + Math.random() * 1.5}s`,
          }}
        >
          💎
        </div>
      ))}

      {/* Sparkle Effects */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.15}s`,
            boxShadow: '0 0 6px 2px rgba(255, 215, 0, 0.8)',
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Crown on Top */}
        <div className="text-6xl mb-4 animate-bounce-slow drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
          👑
        </div>

        {/* Slot Machine Frame */}
        <div className="relative">
          {/* Outer Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/30 via-amber-400/40 to-yellow-500/30 rounded-3xl blur-xl animate-pulse" />

          {/* Main Box */}
          <div className="relative bg-gradient-to-b from-[#2a2a3e] to-[#1a1a2e] border-4 border-yellow-500/50 rounded-2xl p-8 shadow-[0_0_60px_rgba(255,215,0,0.3),inset_0_0_30px_rgba(0,0,0,0.5)]">
            {/* Corner Decorations */}
            <div className="absolute -top-3 -left-3 text-2xl animate-spin-slow">⭐</div>
            <div className="absolute -top-3 -right-3 text-2xl animate-spin-slow" style={{ animationDirection: 'reverse' }}>⭐</div>
            <div className="absolute -bottom-3 -left-3 text-2xl animate-spin-slow" style={{ animationDelay: '0.5s' }}>⭐</div>
            <div className="absolute -bottom-3 -right-3 text-2xl animate-spin-slow" style={{ animationDirection: 'reverse', animationDelay: '0.5s' }}>⭐</div>

            {/* SLOT Text */}
            <div className="text-5xl md:text-6xl font-black tracking-wider mb-2 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] animate-text-shimmer bg-[length:200%_auto]">
              SLOT
            </div>

            {/* BERTO Text */}
            <div className="text-6xl md:text-7xl font-black tracking-widest bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,215,0,0.8)] animate-text-shimmer bg-[length:200%_auto]" style={{ animationDelay: '0.5s' }}>
              BERTO
            </div>

            {/* Slot Symbols Row */}
            <div className="flex justify-center gap-4 mt-6 mb-4">
              <div className="w-14 h-14 bg-gradient-to-b from-[#3a3a4e] to-[#2a2a3e] rounded-lg border-2 border-yellow-500/30 flex items-center justify-center text-3xl animate-slot-spin shadow-inner">
                🍒
              </div>
              <div className="w-14 h-14 bg-gradient-to-b from-[#3a3a4e] to-[#2a2a3e] rounded-lg border-2 border-yellow-500/30 flex items-center justify-center text-3xl animate-slot-spin shadow-inner" style={{ animationDelay: '0.2s' }}>
                7️⃣
              </div>
              <div className="w-14 h-14 bg-gradient-to-b from-[#3a3a4e] to-[#2a2a3e] rounded-lg border-2 border-yellow-500/30 flex items-center justify-center text-3xl animate-slot-spin shadow-inner" style={{ animationDelay: '0.4s' }}>
                💎
              </div>
            </div>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-3 bg-[#1a1a2e] rounded-full border border-yellow-500/30 overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 rounded-full animate-loading-bar shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
          </div>
          <p className="text-amber-400/80 text-sm mt-3 font-medium tracking-wide animate-pulse">
            Yukleniyor...
          </p>
        </div>

        {/* Bottom Coins */}
        <div className="flex justify-center gap-2 mt-6">
          {['💰', '🪙', '💰', '🪙', '💰'].map((coin, i) => (
            <span
              key={i}
              className="text-2xl animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {coin}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Light Rays */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-32 bg-gradient-to-t from-yellow-500/10 to-transparent" />

      <style jsx>{`
        @keyframes float-coin {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 1; }
        }
        @keyframes float-crown {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.8; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
        }
        @keyframes float-diamond {
          0%, 100% { transform: translateY(0) rotate(-10deg); opacity: 0.6; }
          50% { transform: translateY(-25px) rotate(10deg); opacity: 1; }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes text-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slot-spin {
          0% { transform: translateY(-5px); }
          25% { transform: translateY(5px); }
          50% { transform: translateY(-3px); }
          75% { transform: translateY(3px); }
          100% { transform: translateY(-5px); }
        }
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-float-coin { animation: float-coin 3s ease-in-out infinite; }
        .animate-float-crown { animation: float-crown 4s ease-in-out infinite; }
        .animate-float-diamond { animation: float-diamond 3.5s ease-in-out infinite; }
        .animate-sparkle { animation: sparkle 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-text-shimmer { animation: text-shimmer 3s linear infinite; }
        .animate-slot-spin { animation: slot-spin 0.5s ease-in-out infinite; }
        .animate-loading-bar { animation: loading-bar 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    todayVisitors: 0,
  });
  const [telegramChannels, setTelegramChannels] = useState<TelegramChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchAllData = async () => {
    if (isLoaded) return; // Zaten yüklendiyse tekrar çekme

    setIsLoading(true);
    try {
      const [
        bannersRes,
        sponsorsRes,
        eventsRes,
        streamsRes,
        videosRes,
        socialRes,
        settingsRes,
        statsRes,
        telegramRes
      ] = await Promise.all([
        fetch("/api/banners"),
        fetch("/api/sponsors"),
        fetch("/api/events"),
        fetch("/api/livestreams"),
        fetch("/api/videos"),
        fetch("/api/social-media"),
        fetch("/api/settings"),
        fetch("/api/stats"),
        fetch("/api/telegram-channels"),
      ]);

      if (bannersRes.ok) setBanners(await bannersRes.json());
      if (sponsorsRes.ok) setSponsors(await sponsorsRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (streamsRes.ok) setLiveStreams(await streamsRes.json());
      if (videosRes.ok) setVideos(await videosRes.json());
      if (socialRes.ok) setSocialMedia(await socialRes.json());
      if (settingsRes.ok) setSiteSettings(await settingsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (telegramRes.ok) setTelegramChannels(await telegramRes.json());

      setIsLoaded(true);
    } catch (error) {
      console.error("Data fetch error:", error);
      // Hata olsa bile loading'i kapat ki kullanıcı takılmasın
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    setIsLoaded(false);
    await fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // İlk yüklenme tamamlanana kadar loading ekranı göster
  if (!isLoaded) {
    return <GlobalLoadingScreen />;
  }

  return (
    <DataContext.Provider
      value={{
        banners,
        sponsors,
        events,
        liveStreams,
        videos,
        socialMedia,
        siteSettings,
        stats,
        telegramChannels,
        isLoading,
        isLoaded,
        refetch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
