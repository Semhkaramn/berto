"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";

interface Event {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          setEvents(await res.json());
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <MainLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Etkinlikler</h1>
          <p className="text-[var(--text-muted)] mb-8">
            Yaklasan ve devam eden etkinlikler
          </p>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <a
                  key={event.id}
                  href={event.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
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
                      <span className="text-xs text-[var(--text-muted)]">
                        {new Date(event.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[var(--primary)] transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-[var(--text-muted)] line-clamp-3">
                        {event.description}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          ) : (
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
