"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

interface SocialMedia {
  id: string;
  platform: string;
  name: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
}

const platforms = [
  { id: "telegram", name: "Telegram", urlPrefix: "https://t.me/", placeholder: "@kullaniciadi veya kanal" },
  { id: "instagram", name: "Instagram", urlPrefix: "https://instagram.com/", placeholder: "@kullaniciadi" },
  { id: "twitter", name: "Twitter/X", urlPrefix: "https://twitter.com/", placeholder: "@kullaniciadi" },
  { id: "youtube", name: "YouTube", urlPrefix: "https://youtube.com/", placeholder: "@kanal veya channel/ID" },
  { id: "discord", name: "Discord", urlPrefix: "https://discord.gg/", placeholder: "davet-kodu" },
  { id: "tiktok", name: "TikTok", urlPrefix: "https://tiktok.com/@", placeholder: "@kullaniciadi" },
  { id: "facebook", name: "Facebook", urlPrefix: "https://facebook.com/", placeholder: "sayfa-adi" },
  { id: "twitch", name: "Twitch", urlPrefix: "https://twitch.tv/", placeholder: "kullaniciadi" },
];

// Platform'a göre kullanıcı adından URL oluştur
const generateUrl = (platform: string, username: string): string => {
  const platformInfo = platforms.find(p => p.id === platform);
  if (!platformInfo) return username;

  // Eğer zaten tam URL ise olduğu gibi döndür
  if (username.startsWith("http://") || username.startsWith("https://")) {
    return username;
  }

  // @ işaretini kaldır
  let cleanUsername = username.replace(/^@/, "");

  // YouTube için özel işlem
  if (platform === "youtube") {
    if (cleanUsername.startsWith("channel/") || cleanUsername.startsWith("c/") || cleanUsername.startsWith("@")) {
      return platformInfo.urlPrefix + cleanUsername;
    }
    return platformInfo.urlPrefix + "@" + cleanUsername;
  }

  // TikTok için @ zaten URL prefix'inde var
  if (platform === "tiktok") {
    return platformInfo.urlPrefix + cleanUsername;
  }

  return platformInfo.urlPrefix + cleanUsername;
};

// URL'den kullanıcı adını çıkar
const extractUsername = (platform: string, url: string): string => {
  const platformInfo = platforms.find(p => p.id === platform);
  if (!platformInfo) return url;

  // Eğer URL prefix ile başlıyorsa, prefix'i kaldır
  if (url.startsWith(platformInfo.urlPrefix)) {
    return url.replace(platformInfo.urlPrefix, "");
  }

  // Genel URL temizleme
  const patterns = [
    /^https?:\/\/(www\.)?t\.me\//,
    /^https?:\/\/(www\.)?instagram\.com\//,
    /^https?:\/\/(www\.)?twitter\.com\//,
    /^https?:\/\/(www\.)?x\.com\//,
    /^https?:\/\/(www\.)?youtube\.com\//,
    /^https?:\/\/(www\.)?discord\.gg\//,
    /^https?:\/\/(www\.)?tiktok\.com\/@?/,
    /^https?:\/\/(www\.)?facebook\.com\//,
    /^https?:\/\/(www\.)?twitch\.tv\//,
  ];

  let cleaned = url;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, "");
  }

  return cleaned || url;
};

export default function SocialPage() {
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialMedia | null>(null);
  const [formData, setFormData] = useState({
    platform: "telegram",
    displayName: "",
    username: "",
    isActive: true,
    sortOrder: 0
  });
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => { fetchSocials(); }, []);

  // Form değiştiğinde URL önizlemesini güncelle
  useEffect(() => {
    if (formData.username) {
      const generatedUrl = generateUrl(formData.platform, formData.username);
      setPreviewUrl(generatedUrl);
    } else {
      setPreviewUrl("");
    }
  }, [formData.platform, formData.username]);

  const fetchSocials = async () => {
    try {
      const res = await fetch("/api/social-media");
      if (res.ok) setSocials(await res.json());
    } catch (error) { console.error("Fetch error:", error); }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ platform: "telegram", displayName: "", username: "", isActive: true, sortOrder: 0 });
    setPreviewUrl("");
    setShowModal(true);
  };

  const openEditModal = (item: SocialMedia) => {
    setEditingItem(item);
    const extractedUsername = extractUsername(item.platform, item.linkUrl);
    setFormData({
      platform: item.platform,
      displayName: item.name,
      username: extractedUsername,
      isActive: item.isActive,
      sortOrder: item.sortOrder
    });
    setPreviewUrl(item.linkUrl);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    // Otomatik URL oluştur
    const finalUrl = generateUrl(formData.platform, formData.username);
    const submitData = {
      platform: formData.platform,
      name: formData.displayName,
      linkUrl: finalUrl,
      isActive: formData.isActive,
      sortOrder: formData.sortOrder
    };

    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/social-media/${editingItem.id}` : "/api/social-media";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(submitData) });
      if (res.ok) { setShowModal(false); fetchSocials(); }
    } catch (error) { console.error("Submit error:", error); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/social-media/${id}`, { method: "DELETE" });
      if (res.ok) fetchSocials();
    } catch (error) { console.error("Delete error:", error); }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "telegram":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        );
      case "instagram":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case "youtube":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case "twitter":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case "discord":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  const currentPlatform = platforms.find(p => p.id === formData.platform);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Sosyal Medya</h1>
            <p className="text-[var(--text-muted)] text-sm">{socials.length} hesap</p>
          </div>
          <button type="button" onClick={openAddModal} className="btn btn-primary">+ Yeni Hesap</button>
        </div>

        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead><tr><th>Platform</th><th>Isim</th><th>Link</th><th>Sira</th><th>Durum</th><th>Islemler</th></tr></thead>
              <tbody>
                {socials.map((social) => (
                  <tr key={social.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--primary)]">{getPlatformIcon(social.platform)}</span>
                        <span className="font-medium text-white capitalize">{social.platform}</span>
                      </div>
                    </td>
                    <td><span className="text-white">{social.name}</span></td>
                    <td>
                      <a href={social.linkUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline text-sm truncate max-w-xs block">
                        {social.linkUrl}
                      </a>
                    </td>
                    <td><span className="text-white">{social.sortOrder}</span></td>
                    <td><span className={`badge ${social.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{social.isActive ? "Aktif" : "Pasif"}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEditModal(social)} className="btn btn-secondary text-xs py-1 px-3">Duzenle</button>
                        <button type="button" onClick={() => handleDelete(social.id)} className="btn btn-danger text-xs py-1 px-3">Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {socials.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-[var(--text-muted)]">Henuz sosyal medya hesabi yok</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{editingItem ? "Hesap Duzenle" : "Yeni Hesap"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="input"
                >
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                  Goruntulenecek Isim
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="input"
                  placeholder="Ornek: Resmi Telegram Kanalimiz"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Sidebar'da gorunecek isim
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                  Kullanici Adi
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="input"
                  placeholder={currentPlatform?.placeholder || "@kullaniciadi"}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Sadece kullanici adini girin, URL otomatik olusturulacak
                </p>
              </div>

              {previewUrl && (
                <div className="p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <p className="text-xs text-[var(--text-muted)] mb-1">Olusturulacak Link:</p>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] text-sm hover:underline break-all"
                  >
                    {previewUrl}
                  </a>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Siralama</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="input"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm text-[var(--text-muted)]">Aktif</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={handleSubmit} className="btn btn-primary flex-1">Kaydet</button>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Iptal</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
