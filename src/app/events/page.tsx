"use client";

import MainLayout from "@/components/MainLayout";
import { useData } from "@/lib/DataContext";
import { normalizeUrl } from "@/lib/utils";

export default function EventsPage() {
  const { events, isLoading } = useData();

  // Tıklama takibi fonksiyonu
  const trackClick = async (type: string, targetId: string) => {
    try {
      await fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, targetId }),
      });
    } catch (error) {
      console.error("Track click error:", error);
    }
  };

  const handleEventClick = (event: { id: string; linkUrl: string }) => {
    if (event.linkUrl) {
      trackClick("event", event.id);
      window.open(normalizeUrl(event.linkUrl), "_blank", "noopener,noreferrer");
    }
  };

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Etkinlikler</h1>

          {isLoading && (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--text-muted)]">Etkinlikler yukleniyor...</p>
            </div>
          )}

          {!isLoading && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="card group animate-fadeIn cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-[var(--surface-hover)] to-[var(--surface)]">
                    {/* Status Badge - Sağ Üst Köşe */}
                    <div className="absolute top-3 right-3 z-10">
                      {event.status === "completed" ? (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-500/80 text-white backdrop-blur-sm">
                          Bitti
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/80 text-white backdrop-blur-sm">
                          Aktif
                        </span>
                      )}
                    </div>
                    <div className="h-52 flex items-center justify-center p-4">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-[var(--text-muted)]">Etkinlik</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[var(--primary)] transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-[var(--text-muted)] whitespace-pre-line">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && events.length === 0 && (
            <div className="text-center py-20 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
              <svg className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">Henuz etkinlik yok</h3>
              <p className="text-[var(--text-muted)]">Yaklasimda etkinlikler burada gosterilecek</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
