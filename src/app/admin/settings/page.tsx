"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

interface Settings {
  siteName: string;
  logoUrl: string | null;
  telegramUrl: string | null;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({ siteName: "", logoUrl: null, telegramUrl: null });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) setSettings(await res.json());
    } catch (error) { console.error("Fetch error:", error); }
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

              <div>
                <label className="block text-sm font-medium text-white mb-2">Logo URL</label>
                <input
                  type="text"
                  value={settings.logoUrl || ""}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value || null })}
                  className="input"
                  placeholder="https://..."
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">Logo resmi icin URL (bos birakilirsa varsayilan logo kullanilir)</p>
                {settings.logoUrl && (
                  <div className="mt-2 p-2 bg-[var(--background)] rounded-lg">
                    <img src={settings.logoUrl} alt="Logo" className="h-10 object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Telegram URL</label>
                <input
                  type="text"
                  value={settings.telegramUrl || ""}
                  onChange={(e) => setSettings({ ...settings, telegramUrl: e.target.value || null })}
                  className="input"
                  placeholder="https://t.me/username"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">Telegram kanal veya grup linki</p>
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

          {/* Danger Zone */}
          <div className="mt-6 bg-[var(--surface)] rounded-xl border border-red-500/30 p-6">
            <h3 className="text-lg font-semibold text-red-400 mb-4">Tehlikeli Bolge</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Bu alandaki islemler geri alinamaz. Dikkatli olun.
            </p>
            <button
              type="button"
              onClick={() => alert("Bu ozellik henuz aktif degil")}
              className="btn btn-danger"
            >
              Tum Verileri Sil
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
