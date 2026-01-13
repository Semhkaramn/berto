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

// Crown Icon for Main Sponsors
const CrownIcon = () => (
  <svg className="w-6 h-6 text-yellow-400 crown-icon" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
  </svg>
);

// Star Icon for VIP Sponsors
const StarIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-5 h-5 text-purple-300 twinkle-star ${className}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

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

  if (type === "main") {
    return (
      <div
        onClick={onClick}
        className="group relative rounded-2xl cursor-pointer animate-fadeIn overflow-hidden transition-all duration-500 hover:scale-[1.02]"
        style={{
          animationDelay: `${index * 150}ms`,
          background: `linear-gradient(145deg, ${bgColor}, ${bgColor}dd)`,
          border: `2px solid ${borderColor}`,
          boxShadow: isLoaded ? `0 0 30px ${bgColor}40, 0 0 60px ${bgColor}20` : undefined,
        }}
      >
        {/* Ribbon */}
        <div className="ribbon" />

        {/* Shine Effect */}
        <div className="shine-effect" />

        <div className="relative p-8 flex flex-col z-10">
          {/* Logo Container */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative">
              <img
                src={sponsor.imageUrl}
                alt={sponsor.name}
                className="max-w-full max-h-48 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
              />
              {/* Glow behind logo */}
              <div
                className="absolute inset-0 blur-3xl -z-10 scale-150 transition-opacity duration-500 opacity-50 group-hover:opacity-80"
                style={{ backgroundColor: bgColor }}
              />
            </div>
          </div>

          {/* Info Card */}
          <div
            className="backdrop-blur-xl rounded-2xl p-5 border"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderColor: borderColor
            }}
          >
            <div className="flex items-center gap-4 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${bgColor}, ${bgColor}cc)`,
                  boxShadow: `0 4px 15px ${bgColor}50`
                }}
              >
                <CrownIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{sponsor.name}</h3>
                <span className="text-sm font-medium" style={{ color: borderColor }}>Ana Sponsor</span>
              </div>
              {/* Visit Button */}
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
            {sponsor.description && (
              <p className="text-white/80 text-sm whitespace-pre-line">{sponsor.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === "vip") {
    return (
      <div
        onClick={onClick}
        className="group relative rounded-xl cursor-pointer animate-fadeIn overflow-hidden transition-all duration-500 hover:scale-[1.03]"
        style={{
          animationDelay: `${index * 100}ms`,
          background: `linear-gradient(145deg, ${bgColor}, ${bgColor}dd)`,
          border: `2px solid ${borderColor}`,
          boxShadow: isLoaded ? `0 0 20px ${bgColor}30, 0 0 40px ${bgColor}15` : undefined,
        }}
      >
        {/* VIP Ribbon */}
        <div className="ribbon ribbon-vip" />

        {/* Shine Effect */}
        <div className="shine-effect" />

        <div className="relative p-6 flex flex-col z-10">
          {/* Logo */}
          <div className="flex-1 flex items-center justify-center p-4">
            <img
              src={sponsor.imageUrl}
              alt={sponsor.name}
              className="max-w-full max-h-32 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          {/* Info */}
          <div
            className="backdrop-blur-lg rounded-xl p-4 border"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              borderColor: borderColor
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${bgColor}, ${bgColor}cc)`,
                }}
              >
                <StarIcon className="w-4 h-4" />
              </div>
              <span className="text-white font-semibold text-lg">{sponsor.name}</span>
            </div>
            {sponsor.description && (
              <p className="text-white/70 text-sm whitespace-pre-line">{sponsor.description}</p>
            )}
          </div>
        </div>

        {/* Hover Border Glow */}
        <div
          className="absolute inset-0 border-2 rounded-xl transition-colors duration-300 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{ borderColor: borderColor }}
        />
      </div>
    );
  }

  // Normal sponsor card
  return (
    <div
      onClick={onClick}
      className="group rounded-xl overflow-hidden cursor-pointer animate-fadeIn transition-all duration-400 hover:scale-[1.05]"
      style={{
        animationDelay: `${index * 50}ms`,
        background: `linear-gradient(145deg, ${bgColor}, ${bgColor}ee)`,
        border: `1px solid ${borderColor}`,
        boxShadow: isLoaded ? `0 4px 20px ${bgColor}20` : undefined,
      }}
    >
      {/* Logo Container */}
      <div
        className="h-28 flex items-center justify-center p-4 relative overflow-hidden"
        style={{ backgroundColor: `${bgColor}80` }}
      >
        <img
          src={sponsor.imageUrl}
          alt={sponsor.name}
          className="max-w-full max-h-20 object-contain group-hover:scale-110 transition-transform duration-300"
        />
        {/* Subtle shine on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-700" />
      </div>

      {/* Info */}
      <div
        className="p-3"
        style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          borderTop: `1px solid ${borderColor}`
        }}
      >
        <h3 className="font-medium text-white text-sm truncate group-hover:text-[#7dd3fc] transition-colors">{sponsor.name}</h3>
        {sponsor.description && (
          <p className="text-xs text-white/60 mt-1 whitespace-pre-line line-clamp-2">{sponsor.description}</p>
        )}
      </div>
    </div>
  );
}
