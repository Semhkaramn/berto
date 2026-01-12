"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ImageUpload from "@/components/ImageUpload";

interface Settings {
  siteName: string;
  logoUrl: string | null;
  telegramUrl: string | null;
  youtubeChannelId: string | null;
  youtubeApiKey: string | null;
}

interface YouTubeInfo {
  channelTitle?: string;
  channelThumbnail?: string;
  isLive?: boolean;
  liveTitle?: string;
  message?: string;
  error?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: "",
    logoUrl: null,
    telegramUrl: null,
    youtubeChannelId: null,
    youtubeApiKey: null
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [youtubeInfo, setYoutubeInfo] = useState<YouTubeInfo | null>(null);
  const [checkingYoutube, setCheckingYoutube] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) setSettings(await res.json());
    } catch (error) { console.error("Fetch error:", error); }
  };

  const checkYoutubeChannel = async () => {
    if (!settings.youtubeChannelId) return;
    setCheckingYoutube(true);
    try {
      const res = await fetch("/api/youtube/channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: settings.youtubeChannelId,
          apiKey: settings.youtubeApiKey
        }),
      });
      const data = await res.json();
      setYoutubeInfo(data);
    } catch (error) {
      console.error("YouTube check error:", error);
      setYoutubeInfo({ error: "Kontrol sirasinda hata olustu" });
    } finally {
      setCheckingYoutube(false);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage("Ayarlar kaydedildi!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage("Hata olustu!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Site Ayarlari</h1>
          <p className="text-[var(--text-muted)] text-sm">Genel site ayarlarini yonetin</p>
        </div>

        <div className="max-w-xl">
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Site Adi</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="input"
                  placeholder="Sponsor Portal"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">Sitenin ust kisminda gorunecek isim</p>
              </div>

              <ImageUpload
                label="Site Logosu"
                value={settings.logoUrl || ""}
                onChange={(url) => setSettings({ ...settings, logoUrl: url || null })}
                placeholder="https://... (bos birakilirsa varsayilan logo kullanilir)"
              />

              {/* YouTube Ayarları */}
              <div className="pt-4 border-t border-[var(--border)]">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube Entegrasyonu
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">YouTube Kanal ID veya Handle</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={settings.youtubeChannelId || ""}
                        onChange={(e) => setSettings({ ...settings, youtubeChannelId: e.target.value || null })}
                        className="input flex-1"
                        placeholder="@kanaladi veya UCxxxxx"
                      />
                      <button
                        type="button"
                        onClick={checkYoutubeChannel}
                        disabled={checkingYoutube || !settings.youtubeChannelId}
                        className="btn btn-secondary whitespace-nowrap"
                      >
                        {checkingYoutube ? "Kontrol..." : "Kontrol Et"}
                      </button>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Ornek: @kullanıcıadı veya UCxxxxxxxxxxxxxxxx
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">YouTube API Key (Opsiyonel)</label>
                    <input
                      type="password"
                      value={settings.youtubeApiKey || ""}
                      onChange={(e) => setSettings({ ...settings, youtubeApiKey: e.target.value || null })}
                      className="input"
                      placeholder="AIzaSy..."
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Canli yayin ve video otomatik algılama icin gerekli
                    </p>
                  </div>

                  {/* YouTube Kontrol Sonucu */}
                  {youtubeInfo && (
                    <div className={`p-4 rounded-lg border ${youtubeInfo.error ? 'border-red-500/30 bg-red-500/10' : 'border-green-500/30 bg-green-500/10'}`}>
                      {youtubeInfo.error ? (
                        <p className="text-red-400 text-sm">{youtubeInfo.error}</p>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            {youtubeInfo.channelThumbnail && (
                              <img src={youtubeInfo.channelThumbnail} alt="" className="w-10 h-10 rounded-full" />
                            )}
                            <div>
                              <p className="text-white font-medium">{youtubeInfo.channelTitle}</p>
                              <p className="text-xs text-[var(--text-muted)]">
                                {youtubeInfo.isLive ? (
                                  <span className="text-red-400 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    CANLI: {youtubeInfo.liveTitle}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">Canli yayin yok</span>
                                )}
                              </p>
                            </div>
                          </div>
                          {youtubeInfo.message && (
                            <p className="text-xs text-yellow-400">{youtubeInfo.message}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {message && (
                <div className={`p-3 rounded-lg text-sm ${message.includes("Hata") ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="btn btn-primary w-full"
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
