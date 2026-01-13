"use client";

import { useEffect, useState } from "react";
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
  const [borderColor, setBorderColor] = useState<string>("rgba(255,255,255,0.1)");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadColor = async () => {
      try {
        const color = await extractDominantColor(sponsor.imageUrl);
        setBgColor(color);
        setBorderColor(getLighterColor(color, 2));
        setIsLoaded(true);
      } catch (error) {
        console.error("Color extraction failed:", error);
        setIsLoaded(true);
      }
    };
    loadColor();
  }, [sponsor.imageUrl]);

  // Ana Sponsor Kartı - Premium Tasarım
  if (type === "main") {
    return (
      <div
        onClick={onClick}
        className="group relative rounded-2xl cursor-pointer animate-fadeIn overflow-hidden transition-all duration-300 hover:scale-[1.02]"
        style={{
          animationDelay: `${index * 150}ms`,
          background: `linear-gradient(160deg, ${bgColor}dd 0%, ${bgColor}99 100%)`,
          border: `2px solid ${borderColor}`,
          boxShadow: isLoaded ? `0 8px 32px ${bgColor}50` : undefined,
        }}
      >
        {/* Ana Sponsor Etiketi */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
            ANA SPONSOR
          </span>
        </div>

        {/* Logo Alanı */}
        <div className="pt-14 pb-6 px-6 flex items-center justify-center">
          <img
            src={sponsor.imageUrl}
            alt={sponsor.name}
            className="max-w-full max-h-40 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Alt Bilgi Alanı */}
        <div
          className="px-6 py-5 border-t"
          style={{
            borderColor: `${borderColor}50`,
            background: `linear-gradient(to top, rgba(0,0,0,0.4), transparent)`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">{sponsor.name}</h3>
              {sponsor.description && (
                <p className="text-sm text-white/70 line-clamp-2">{sponsor.description}</p>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center ml-4 group-hover:bg-white/20 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIP Sponsor Kartı
  if (type === "vip") {
    return (
      <div
        onClick={onClick}
        className="group relative rounded-xl cursor-pointer animate-fadeIn overflow-hidden transition-all duration-300 hover:scale-[1.03]"
        style={{
          animationDelay: `${index * 100}ms`,
          background: `linear-gradient(160deg, ${bgColor}cc 0%, ${bgColor}88 100%)`,
          border: `2px solid ${borderColor}`,
          boxShadow: isLoaded ? `0 6px 24px ${bgColor}40` : undefined,
        }}
      >
        {/* VIP Etiketi */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            VIP
          </span>
        </div>

        {/* Logo Alanı */}
        <div className="pt-10 pb-4 px-5 flex items-center justify-center">
          <img
            src={sponsor.imageUrl}
            alt={sponsor.name}
            className="max-w-full max-h-28 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Alt Bilgi Alanı */}
        <div
          className="px-5 py-4 border-t"
          style={{
            borderColor: `${borderColor}40`,
            background: `rgba(0,0,0,0.3)`
          }}
        >
          <h3 className="text-base font-semibold text-white mb-1">{sponsor.name}</h3>
          {sponsor.description && (
            <p className="text-xs text-white/60 line-clamp-2">{sponsor.description}</p>
          )}
        </div>
      </div>
    );
  }

  // Normal Sponsor Kartı
  return (
    <div
      onClick={onClick}
      className="group rounded-xl overflow-hidden cursor-pointer animate-fadeIn transition-all duration-300 hover:scale-[1.04]"
      style={{
        animationDelay: `${index * 50}ms`,
        background: `linear-gradient(160deg, ${bgColor}bb 0%, ${bgColor}77 100%)`,
        border: `1px solid ${borderColor}`,
        boxShadow: isLoaded ? `0 4px 16px ${bgColor}30` : undefined,
      }}
    >
      {/* Logo Alanı */}
      <div className="h-24 flex items-center justify-center p-4">
        <img
          src={sponsor.imageUrl}
          alt={sponsor.name}
          className="max-w-full max-h-16 object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Alt Bilgi */}
      <div
        className="px-3 py-3 border-t"
        style={{
          borderColor: `${borderColor}30`,
          background: 'rgba(0,0,0,0.25)'
        }}
      >
        <h3 className="font-medium text-white text-sm truncate">{sponsor.name}</h3>
        {sponsor.description && (
          <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{sponsor.description}</p>
        )}
      </div>
    </div>
  );
}
