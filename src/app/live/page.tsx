"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";

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

export default function LivePage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [streamsRes, videosRes] = await Promise.all([
          fetch("/api/livestreams"),
          fetch("/api/videos"),
        ]);

        if (streamsRes.ok) setStreams(await streamsRes.json());
        if (videosRes.ok) setVideos(await videosRes.json());
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, []);

  const activeLiveStream = streams.find((s) => s.isLive);
  const pastStreams = streams.filter((s) => !s.isLive);

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Canli Yayin</h1>
          <p className="text-[var(--text-muted)] mb-8">
            Canli yayinlar ve gecmis videolar
          </p>

          {/* Active Live Stream */}
          {activeLiveStream && (
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge badge-live flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  CANLI
                </span>
                <h2 className="text-xl font-bold text-white">{activeLiveStream.title}</h2>
              </div>
              <div className="relative bg-black rounded-xl overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src={activeLiveStream.embedUrl}
                    title={activeLiveStream.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
              {activeLiveStream.description && (
                <p className="mt-4 text-[var(--text-muted)]">{activeLiveStream.description}</p>
              )}
            </section>
          )}

          {/* No Live Stream */}
          {!activeLiveStream && (
            <section className="mb-10">
              <div className="text-center py-16 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Simdilik canli yayin yok</h3>
                <p className="text-[var(--text-muted)]">Yayin baslayinca burada gosterilecek</p>
              </div>
            </section>
          )}

          {/* Past Streams */}
          {pastStreams.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">Son Yayinlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="card cursor-pointer"
                    onClick={() => setSelectedVideo({ ...stream, thumbnailUrl: stream.thumbnailUrl })}
                  >
                    <div className="relative">
                      {stream.thumbnailUrl ? (
                        <img
                          src={stream.thumbnailUrl}
                          alt={stream.title}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-[var(--background)] flex items-center justify-center">
                          <svg className="w-12 h-12 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white truncate">{stream.title}</h3>
                      {stream.description && (
                        <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">{stream.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-4">Videolar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="card cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-[var(--background)] flex items-center justify-center">
                          <svg className="w-12 h-12 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                          <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white truncate">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">{video.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Video Modal */}
          {selectedVideo && (
            <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
              <div
                className="bg-[var(--surface)] rounded-xl overflow-hidden w-full max-w-4xl mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                  <h3 className="font-semibold text-white truncate">{selectedVideo.title}</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedVideo(null)}
                    className="w-8 h-8 rounded-full hover:bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-white"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="aspect-video">
                  <iframe
                    src={selectedVideo.embedUrl}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
