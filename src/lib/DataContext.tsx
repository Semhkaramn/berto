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

interface DataContextType {
  banners: Banner[];
  sponsors: Sponsor[];
  events: Event[];
  liveStreams: LiveStream[];
  videos: Video[];
  socialMedia: SocialMedia[];
  isLoading: boolean;
  isLoaded: boolean;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
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
        socialRes
      ] = await Promise.all([
        fetch("/api/banners"),
        fetch("/api/sponsors"),
        fetch("/api/events"),
        fetch("/api/livestreams"),
        fetch("/api/videos"),
        fetch("/api/social-media"),
      ]);

      if (bannersRes.ok) setBanners(await bannersRes.json());
      if (sponsorsRes.ok) setSponsors(await sponsorsRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (streamsRes.ok) setLiveStreams(await streamsRes.json());
      if (videosRes.ok) setVideos(await videosRes.json());
      if (socialRes.ok) setSocialMedia(await socialRes.json());

      setIsLoaded(true);
    } catch (error) {
      console.error("Data fetch error:", error);
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

  return (
    <DataContext.Provider
      value={{
        banners,
        sponsors,
        events,
        liveStreams,
        videos,
        socialMedia,
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
