"use client";

import { useEffect, useState } from "react";
import { normalizeUrl } from "@/lib/utils";

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

    // Popup hemen açılsın (bekleme yok)
    fetchPopup();
  }, [enabled]);

  if (!enabled || !isOpen || !popup) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsOpen(false)}>
      <div
        className="modal-content p-0 max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* X Close Button - Sağ üst köşede */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Başlık - En üstte */}
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface)]">
          <span className="badge badge-main mb-2">SPONSOR</span>
          <h3 className="text-xl font-bold text-white">{popup.title}</h3>
        </div>

        {/* Resim - Ortada */}
        <div className="w-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center p-6">
          <img
            src={popup.imageUrl}
            alt={popup.title}
            className="max-w-full max-h-64 w-auto h-auto object-contain drop-shadow-2xl"
          />
        </div>

        {/* Açıklama - Resmin altında */}
        {popup.description && (
          <div className="px-4 py-3 bg-[var(--surface)] border-t border-[var(--border)]">
            <p className="text-sm text-gray-300 whitespace-pre-line">{popup.description}</p>
          </div>
        )}

        {/* Giriş Butonu */}
        <div className="p-4 bg-zinc-900">
          <a
            href={normalizeUrl(popup.linkUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            Giris Yap
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
