"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";

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

// Global Loading Screen Component
function GlobalLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [videoError, setVideoError] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    // Video bittiğinde animasyonu başlat
    setIsClosing(true);
    // Animasyon bitince onComplete çağır
    setTimeout(() => {
      onComplete();
    }, 800); // Animasyon süresi
  };

  const handleVideoError = () => {
    setVideoError(true);
    // Hata durumunda 2 saniye bekle ve kapat
    setTimeout(() => {
      setIsClosing(true);
      setTimeout(() => {
        onComplete();
      }, 800);
    }, 2000);
  };

  // Video varsa göster
  if (!videoError) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black">
        {/* Sol perde */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-black z-10 transition-transform duration-700 ease-in-out ${
            isClosing ? '-translate-x-full' : 'translate-x-0'
          }`}
        />
        {/* Sağ perde */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full bg-black z-10 transition-transform duration-700 ease-in-out ${
            isClosing ? 'translate-x-full' : 'translate-x-0'
          }`}
        />

        {/* Video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain"
            onEnded={handleVideoEnd}
            onError={handleVideoError}
          >
            <source src="/load.webm" type="video/webm" />
          </video>
        </div>
      </div>
    );
  }

  // Video yoksa veya hata varsa basit loading ekranı
  return (
    <div className="fixed inset-0 z-[9999] bg-[var(--background)]">
      {/* Sol perde */}
      <div
        className={`absolute top-0 left-0 w-1/2 h-full bg-[var(--background)] z-10 transition-transform duration-700 ease-in-out ${
          isClosing ? '-translate-x-full' : 'translate-x-0'
        }`}
      />
      {/* Sağ perde */}
      <div
        className={`absolute top-0 right-0 w-1/2 h-full bg-[var(--background)] z-10 transition-transform duration-700 ease-in-out ${
          isClosing ? 'translate-x-full' : 'translate-x-0'
        }`}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Logo/Spinner Container */}
          <div className="relative mb-8">
            {/* Outer Ring */}
            <div className="w-24 h-24 rounded-full border-4 border-[var(--surface)] absolute inset-0" />
            {/* Spinning Ring */}
            <div className="w-24 h-24 rounded-full border-4 border-transparent border-t-[var(--primary)] animate-spin" />
            {/* Inner Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl gradient-main flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Text */}
          <h2 className="text-2xl font-bold text-white mb-2">Yukleniyor</h2>
          <p className="text-[var(--text-muted)]">Lutfen bekleyin...</p>

          {/* Loading Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
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
  const [showLoading, setShowLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  const fetchAllData = async () => {
    if (dataReady) return; // Zaten yüklendiyse tekrar çekme

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

      setDataReady(true);
      setIsLoaded(true);
    } catch (error) {
      console.error("Data fetch error:", error);
      // Hata olsa bile loading'i kapat ki kullanıcı takılmasın
      setDataReady(true);
      setIsLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    setDataReady(false);
    setIsLoaded(false);
    await fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  // Video bitene kadar loading ekranı göster
  if (showLoading) {
    return (
      <>
        {/* Ana içerik arka planda hazır olsun */}
        {dataReady && (
          <div style={{ visibility: 'hidden', position: 'absolute' }}>
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
          </div>
        )}
        <GlobalLoadingScreen onComplete={handleLoadingComplete} />
      </>
    );
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
