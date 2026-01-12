"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { createPortal } from "react-dom";

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

// Global Loading Screen Component - Portal ile body'ye eklenir
function GlobalLoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [videoError, setVideoError] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Client-side mount kontrolü
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ekran yönünü kontrol et
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  const handleVideoEnd = () => {
    // Video bittiğinde fade out animasyonunu başlat
    setIsClosing(true);
  };

  const handleVideoError = () => {
    setVideoError(true);
    // Hata durumunda 2 saniye bekle ve kapat
    setTimeout(() => {
      setIsClosing(true);
    }, 2000);
  };

  // Animasyon tamamlandığında onComplete çağır
  useEffect(() => {
    if (isClosing && !animationComplete) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
        onComplete();
      }, 1000); // Fade out süresi
      return () => clearTimeout(timer);
    }
  }, [isClosing, animationComplete, onComplete]);

  // Animasyon tamamlandıysa veya mount olmadıysa hiçbir şey render etme
  if (animationComplete || !mounted) {
    return null;
  }

  const loadingContent = !videoError ? (
    // Video varsa göster
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647, // Maksimum z-index
        backgroundColor: '#000',
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 1000ms ease-out',
        pointerEvents: isClosing ? 'none' : 'auto',
      }}
    >
      {/* Video - tam ekran */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: isPortrait ? 'contain' : 'cover',
        }}
        onEnded={handleVideoEnd}
        onError={handleVideoError}
      >
        <source src="/load.webm" type="video/webm" />
      </video>
    </div>
  ) : (
    // Video yoksa veya hata varsa basit loading ekranı
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
        backgroundColor: '#0a0a0a',
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 1000ms ease-out',
        pointerEvents: isClosing ? 'none' : 'auto',
      }}
    >
      {/* Loading content */}
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

  // Portal ile body'nin en sonuna ekle
  return createPortal(loadingContent, document.body);
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
    if (dataReady) return;

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

  // Ana içerik her zaman renderlanacak, loading screen üstüne binecek
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
        isLoaded: dataReady,
        refetch,
      }}
    >
      {/* Ana içerik - her zaman renderlanır */}
      {dataReady ? children : (
        <div className="min-h-screen bg-[var(--background)]" />
      )}

      {/* Loading screen - üstte overlay olarak */}
      {showLoading && <GlobalLoadingScreen onComplete={handleLoadingComplete} />}
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
