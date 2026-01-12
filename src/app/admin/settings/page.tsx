"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

interface AdminUser {
  id: string;
  username: string;
}

export default function SettingsPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const res = await fetch("/api/admin/profile");
      if (res.ok) {
        const data = await res.json();
        setAdmin(data);
        setUsername(data.username);
      }
    } catch (error) {
      console.error("Fetch admin error:", error);
    }
  };

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUsernameChange = async () => {
    if (!username.trim()) {
      showMessage("Kullanici adi bos olamaz!", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (res.ok) {
        showMessage("Kullanici adi guncellendi!", "success");
        fetchAdmin();
      } else {
        const data = await res.json();
        showMessage(data.error || "Hata olustu!", "error");
      }
    } catch (error) {
      console.error("Update username error:", error);
      showMessage("Hata olustu!", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword) {
      showMessage("Mevcut sifreyi girin!", "error");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      showMessage("Yeni sifre en az 6 karakter olmali!", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("Sifreler eslesmiyor!", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (res.ok) {
        showMessage("Sifre guncellendi!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        showMessage(data.error || "Hata olustu!", "error");
      }
    } catch (error) {
      console.error("Update password error:", error);
      showMessage("Hata olustu!", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Hesap Ayarlari</h1>
          <p className="text-[var(--text-muted)] text-sm">Kullanici adi ve sifrenizi degistirin</p>
        </div>

        <div className="max-w-xl space-y-6">
          {/* Mesaj */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${messageType === "error" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
              {message}
            </div>
          )}

          {/* Kullanıcı Adı Değiştirme */}
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Kullanici Adi
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Mevcut Kullanici Adi</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  placeholder="Kullanici adi"
                />
              </div>
              <button
                type="button"
                onClick={handleUsernameChange}
                disabled={saving || !username.trim() || username === admin?.username}
                className="btn btn-primary"
              >
                {saving ? "Kaydediliyor..." : "Kullanici Adini Guncelle"}
              </button>
            </div>
          </div>

          {/* Şifre Değiştirme */}
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Sifre Degistir
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Mevcut Sifre</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input"
                  placeholder="Mevcut sifrenizi girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Yeni Sifre</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input"
                  placeholder="Yeni sifrenizi girin"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">En az 6 karakter olmali</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Yeni Sifre Tekrar</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="Yeni sifrenizi tekrar girin"
                />
              </div>
              <button
                type="button"
                onClick={handlePasswordChange}
                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                className="btn btn-primary"
              >
                {saving ? "Kaydediliyor..." : "Sifreyi Guncelle"}
              </button>
            </div>
          </div>

          {/* Güvenlik Notu */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm text-yellow-500 font-medium">Guvenlik Notu</p>
                <p className="text-xs text-yellow-500/80 mt-1">
                  Sifreler guvenli bir sekilde hash'lenerek saklanir. Guclu bir sifre kullanmanizi oneririz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
