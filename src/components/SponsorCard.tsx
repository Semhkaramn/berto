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
          background: `linear-gradient(160deg, #0a0a0f 0%, ${bgColor}30 50%, #0a0a0f 100%)`,
        }}
      >
        {/* Neon Border Glow Animation */}
        <div
          className="absolute inset-0 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`,
            backgroundSize: '200% 100%',
            animation: 'borderGlow 3s linear infinite',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `inset 0 0 30px ${bgColor}20, 0 0 40px ${bgColor}30`,
          }}
        />

        {/* Ana Sponsor Etiketi */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
            ANA SPONSOR
          </span>
        </div>

        {/* Logo Alanı */}
        <div className="pt-14 pb-6 px-6 flex items-center justify-center relative z-10">
          <img
            src={sponsor.imageUrl}
            alt={sponsor.name}
            className="max-w-full max-h-40 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Alt Bilgi Alanı */}
        <div
          className="px-6 py-5 border-t relative z-10"
          style={{
            borderColor: `${borderColor}30`,
            background: `linear-gradient(to top, rgba(0,0,0,0.6), transparent)`
          }}
        >
          <h3 className="text-xl font-bold text-white mb-1">{sponsor.name}</h3>
          {sponsor.description && (
            <p className="text-sm text-white/70 line-clamp-2">{sponsor.description}</p>
          )}
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
          background: `linear-gradient(160deg, #0a0a0f 0%, ${bgColor}25 50%, #0a0a0f 100%)`,
        }}
      >
        {/* Neon Border Glow Animation */}
        <div
          className="absolute inset-0 rounded-xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`,
            backgroundSize: '200% 100%',
            animation: 'borderGlow 3s linear infinite',
            animationDelay: `${index * 0.5}s`,
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px ${bgColor}15, 0 0 30px ${bgColor}25`,
          }}
        />

        {/* VIP Etiketi */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            VIP
          </span>
        </div>

        {/* Logo Alanı */}
        <div className="pt-10 pb-4 px-5 flex items-center justify-center relative z-10">
          <img
            src={sponsor.imageUrl}
            alt={sponsor.name}
            className="max-w-full max-h-28 object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Alt Bilgi Alanı */}
        <div
          className="px-5 py-4 border-t relative z-10"
          style={{
            borderColor: `${borderColor}25`,
            background: `rgba(0,0,0,0.4)`
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
      className="group rounded-xl overflow-hidden cursor-pointer animate-fadeIn transition-all duration-300 hover:scale-[1.04] relative"
      style={{
        animationDelay: `${index * 50}ms`,
        background: `linear-gradient(160deg, #0a0a0f 0%, ${bgColor}20 50%, #0a0a0f 100%)`,
      }}
    >
      {/* Neon Border Glow Animation */}
      <div
        className="absolute inset-0 rounded-xl opacity-50 group-hover:opacity-90 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`,
          backgroundSize: '200% 100%',
          animation: 'borderGlow 3s linear infinite',
          animationDelay: `${index * 0.3}s`,
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 15px ${bgColor}10, 0 0 20px ${bgColor}20`,
        }}
      />

      {/* Logo Alanı */}
      <div className="h-24 flex items-center justify-center p-4 relative z-10">
        <img
          src={sponsor.imageUrl}
          alt={sponsor.name}
          className="max-w-full max-h-16 object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Alt Bilgi */}
      <div
        className="px-3 py-3 border-t relative z-10"
        style={{
          borderColor: `${borderColor}20`,
          background: 'rgba(0,0,0,0.35)'
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
