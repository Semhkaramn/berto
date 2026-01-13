"use client";

import { useEffect, useState, useRef } from "react";
import { extractDominantColor, getLighterColor } from "@/lib/colorExtractor";

interface Sponsor {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
  type: string;
}

interface SponsorCardProps {
  sponsor: Sponsor;
  onClick: () => void;
  index: number;
  type: "main" | "vip" | "normal";
}

export default function SponsorCard({ sponsor, onClick, index, type }: SponsorCardProps) {
  const [bgColor, setBgColor] = useState<string>("#1a1a2e");
  const [borderColor, setBorderColor] = useState<string>("rgba(125,211,252,1)");
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadColor = async () => {
      try {
        const color = await extractDominantColor(sponsor.imageUrl);
        setBgColor(color);
        // Buz mavisi tonları kullan
        setBorderColor("#7dd3fc");
        setIsLoaded(true);
      } catch (error) {
        console.error("Color extraction failed:", error);
        setIsLoaded(true);
      }
    };
    loadColor();
  }, [sponsor.imageUrl]);

  // Mouse tracking for spotlight effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Ana Sponsor Kartı - Ultra Premium Tasarım
  if (type === "main") {
    return (
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        className="group relative rounded-2xl cursor-pointer animate-fadeIn overflow-visible transition-all duration-500 hover:scale-[1.02] snow-top-heavy"
        style={{
          animationDelay: `${index * 150}ms`,
        }}
      >
        {/* Animated Neon Border - Çerçevede Dolaşan Işık Efekti */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {/* Border background */}
          <div className="absolute inset-0 rounded-2xl border-2 border-[#7dd3fc]/30" />

          {/* Traveling light effect - Top */}
          <div
            className="absolute h-[2px] w-20 bg-gradient-to-r from-transparent via-[#7dd3fc] to-transparent animate-border-travel-top"
            style={{ top: 0, left: 0 }}
          />
          {/* Traveling light effect - Right */}
          <div
            className="absolute w-[2px] h-20 bg-gradient-to-b from-transparent via-[#7dd3fc] to-transparent animate-border-travel-right"
            style={{ top: 0, right: 0 }}
          />
          {/* Traveling light effect - Bottom */}
          <div
            className="absolute h-[2px] w-20 bg-gradient-to-r from-transparent via-[#7dd3fc] to-transparent animate-border-travel-bottom"
            style={{ bottom: 0, right: 0 }}
          />
          {/* Traveling light effect - Left */}
          <div
            className="absolute w-[2px] h-20 bg-gradient-to-b from-transparent via-[#7dd3fc] to-transparent animate-border-travel-left"
            style={{ bottom: 0, left: 0 }}
          />
        </div>

        {/* Inner Card Container */}
        <div
          className="relative rounded-2xl h-full overflow-hidden m-[2px]"
          style={{
            background: `linear-gradient(160deg, rgba(10,10,15,0.98) 0%, ${bgColor}40 50%, rgba(10,10,15,0.98) 100%)`,
          }}
        >
          {/* Spotlight Effect on Hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(125,211,252,0.15), transparent 60%)`,
            }}
          />

          {/* Premium Corner Glow */}
          <div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"
            style={{ background: '#7dd3fc' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
            style={{ background: '#7dd3fc' }}
          />

          {/* Ana Sponsor Etiketi - Premium Badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-md opacity-60" />
              <span className="relative px-4 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white shadow-xl flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                </svg>
                ANA SPONSOR
              </span>
            </div>
          </div>

          {/* Logo Alanı */}
          <div className="pt-16 pb-8 px-8 flex items-center justify-center relative z-10">
            <div className="relative">
              {/* Logo Glow */}
              <div
                className="absolute inset-0 blur-2xl opacity-40 scale-110"
                style={{
                  background: `radial-gradient(circle, #7dd3fc 0%, transparent 70%)`,
                }}
              />
              <img
                src={sponsor.imageUrl}
                alt={sponsor.name}
                className="relative max-w-full max-h-44 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Alt Bilgi Alanı - Glassmorphism */}
          <div
            className="px-6 py-5 relative z-10"
            style={{
              background: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4))`,
              borderTop: `1px solid rgba(125,211,252,0.2)`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <h3
              className="text-xl font-bold mb-1 text-white"
            >
              {sponsor.name}
            </h3>
            {sponsor.description && (
              <p className="text-sm text-white/70 line-clamp-2">{sponsor.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // VIP Sponsor Kartı - Premium Mor/Pembe Tema
  if (type === "vip") {
    return (
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        className="group relative rounded-xl cursor-pointer animate-fadeIn overflow-visible transition-all duration-500 hover:scale-[1.03] snow-top"
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        {/* Animated Neon Border - Çerçevede Dolaşan Işık Efekti */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          {/* Border background */}
          <div className="absolute inset-0 rounded-xl border-2 border-[#7dd3fc]/30" />

          {/* Traveling light effect - Top */}
          <div
            className="absolute h-[2px] w-16 bg-gradient-to-r from-transparent via-[#7dd3fc] to-transparent animate-border-travel-top"
            style={{ top: 0, left: 0 }}
          />
          {/* Traveling light effect - Right */}
          <div
            className="absolute w-[2px] h-16 bg-gradient-to-b from-transparent via-[#7dd3fc] to-transparent animate-border-travel-right"
            style={{ top: 0, right: 0 }}
          />
          {/* Traveling light effect - Bottom */}
          <div
            className="absolute h-[2px] w-16 bg-gradient-to-r from-transparent via-[#7dd3fc] to-transparent animate-border-travel-bottom"
            style={{ bottom: 0, right: 0 }}
          />
          {/* Traveling light effect - Left */}
          <div
            className="absolute w-[2px] h-16 bg-gradient-to-b from-transparent via-[#7dd3fc] to-transparent animate-border-travel-left"
            style={{ bottom: 0, left: 0 }}
          />
        </div>

        {/* Inner Card Container */}
        <div
          className="relative rounded-xl h-full overflow-hidden m-[2px]"
          style={{
            background: `linear-gradient(160deg, rgba(10,10,15,0.98) 0%, ${bgColor}35 50%, rgba(10,10,15,0.98) 100%)`,
          }}
        >
          {/* Spotlight Effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(125,211,252,0.15), transparent 60%)`,
            }}
          />

          {/* Corner Glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl opacity-25 group-hover:opacity-45 transition-opacity bg-[#7dd3fc]" />

          {/* VIP Etiketi */}
          <div className="absolute top-3 right-3 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#7dd3fc] to-[#38bdf8] rounded-full blur-md opacity-60" />
              <span className="relative px-3 py-1 text-[10px] font-bold rounded-full bg-gradient-to-r from-[#7dd3fc] to-[#38bdf8] text-black flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                VIP
              </span>
            </div>
          </div>

          {/* Logo Alanı */}
          <div className="pt-12 pb-5 px-5 flex items-center justify-center relative z-10">
            <div className="relative">
              <div
                className="absolute inset-0 blur-xl opacity-30 scale-110"
                style={{
                  background: `radial-gradient(circle, #7dd3fc 0%, transparent 70%)`,
                }}
              />
              <img
                src={sponsor.imageUrl}
                alt={sponsor.name}
                className="relative max-w-full max-h-32 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Alt Bilgi Alanı */}
          <div
            className="px-5 py-4 relative z-10"
            style={{
              background: 'rgba(0,0,0,0.6)',
              borderTop: '1px solid rgba(125,211,252,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <h3 className="text-base font-bold text-white mb-1">{sponsor.name}</h3>
            {sponsor.description && (
              <p className="text-xs text-white/60 line-clamp-2">{sponsor.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Normal Sponsor Kartı - Elegant Minimal
  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="group rounded-xl overflow-hidden cursor-pointer animate-fadeIn transition-all duration-500 hover:scale-[1.05] relative"
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Animated Neon Border - Çerçevede Dolaşan Işık Efekti */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        {/* Border background */}
        <div className="absolute inset-0 rounded-xl border border-[#7dd3fc]/20" />

        {/* Traveling light effect - hover'da görünür */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Traveling light effect - Top */}
          <div
            className="absolute h-[1px] w-12 bg-gradient-to-r from-transparent via-[#7dd3fc] to-transparent animate-border-travel-top"
            style={{ top: 0, left: 0 }}
          />
          {/* Traveling light effect - Right */}
          <div
            className="absolute w-[1px] h-12 bg-gradient-to-b from-transparent via-[#7dd3fc] to-transparent animate-border-travel-right"
            style={{ top: 0, right: 0 }}
          />
          {/* Traveling light effect - Bottom */}
          <div
            className="absolute h-[1px] w-12 bg-gradient-to-r from-transparent via-[#7dd3fc] to-transparent animate-border-travel-bottom"
            style={{ bottom: 0, right: 0 }}
          />
          {/* Traveling light effect - Left */}
          <div
            className="absolute w-[1px] h-12 bg-gradient-to-b from-transparent via-[#7dd3fc] to-transparent animate-border-travel-left"
            style={{ bottom: 0, left: 0 }}
          />
        </div>
      </div>

      {/* Inner Card */}
      <div
        className="relative rounded-xl h-full overflow-hidden m-[1px]"
        style={{
          background: `linear-gradient(160deg, rgba(10,10,15,0.95) 0%, ${bgColor}25 50%, rgba(10,10,15,0.95) 100%)`,
        }}
      >
        {/* Spotlight Effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(125,211,252,0.15), transparent 60%)`,
          }}
        />

        {/* Corner Glow */}
        <div
          className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity"
          style={{ background: '#7dd3fc' }}
        />

        {/* Logo Alanı */}
        <div className="h-28 flex items-center justify-center p-4 relative z-10">
          <div className="relative">
            <div
              className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-30 scale-110 transition-opacity"
              style={{
                background: `radial-gradient(circle, #7dd3fc 0%, transparent 70%)`,
              }}
            />
            <img
              src={sponsor.imageUrl}
              alt={sponsor.name}
              className="relative max-w-full max-h-20 object-contain group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Alt Bilgi */}
        <div
          className="px-3 py-3 relative z-10"
          style={{
            background: 'rgba(0,0,0,0.5)',
            borderTop: `1px solid rgba(125,211,252,0.15)`,
          }}
        >
          <h3 className="font-semibold text-white text-sm truncate">{sponsor.name}</h3>
          {sponsor.description && (
            <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{sponsor.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
