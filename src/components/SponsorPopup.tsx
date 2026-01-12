"use client";

import { useEffect, useState } from "react";

interface PopupSponsor {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
}

interface SponsorPopupProps {
  enabled?: boolean;
}

export default function SponsorPopup({ enabled = true }: SponsorPopupProps) {
  const [popup, setPopup] = useState<PopupSponsor | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const fetchPopup = async () => {
      try {
        const res = await fetch("/api/popup-sponsors/random");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setPopup(data);
            setIsOpen(true);
          }
        }
      } catch (error) {
        console.error("Popup fetch error:", error);
      }
    };

    // Show popup after 1 second
    const timer = setTimeout(fetchPopup, 1000);
    return () => clearTimeout(timer);
  }, [enabled]);

  if (!enabled || !isOpen || !popup) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div
        className="modal-content p-0 max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sponsor Image */}
        <a href={popup.linkUrl} target="_blank" rel="noopener noreferrer" className="block relative">
          <div className="w-full h-64 bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center p-6">
            <img
              src={popup.imageUrl}
              alt={popup.title}
              className="max-w-full max-h-full w-auto h-auto object-contain drop-shadow-2xl"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="badge badge-main mb-2">SPONSOR</span>
            <h3 className="text-xl font-bold text-white mb-1">{popup.title}</h3>
            {popup.description && (
              <p className="text-sm text-gray-300 line-clamp-2">{popup.description}</p>
            )}
          </div>
        </a>

        {/* Action Button */}
        <div className="p-4 flex gap-3 bg-zinc-900">
          <a
            href={popup.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex-1"
          >
            Ziyaret Et
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="btn btn-secondary"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
