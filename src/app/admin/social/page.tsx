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

const platforms = ["telegram", "instagram", "twitter", "youtube", "discord", "tiktok", "facebook", "twitch"];

export default function SocialPage() {
  const [socials, setSocials] = useState<SocialMedia[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialMedia | null>(null);
  const [formData, setFormData] = useState({ platform: "telegram", name: "", linkUrl: "", isActive: true, sortOrder: 0 });

  useEffect(() => { fetchSocials(); }, []);

  const fetchSocials = async () => {
    try {
      const res = await fetch("/api/social-media");
      if (res.ok) setSocials(await res.json());
    } catch (error) { console.error("Fetch error:", error); }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ platform: "telegram", name: "", linkUrl: "", isActive: true, sortOrder: 0 });
    setShowModal(true);
  };

  const openEditModal = (item: SocialMedia) => {
    setEditingItem(item);
    setFormData({ platform: item.platform, name: item.name, linkUrl: item.linkUrl, isActive: item.isActive, sortOrder: item.sortOrder });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/social-media/${editingItem.id}` : "/api/social-media";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
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
                    <td><span className="font-medium text-white capitalize">{social.platform}</span></td>
                    <td><span className="text-white">{social.name}</span></td>
                    <td><span className="text-[var(--text-muted)] text-sm truncate max-w-xs block">{social.linkUrl}</span></td>
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
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Platform</label>
                <select value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} className="input">
                  {platforms.map((p) => <option key={p} value={p} className="capitalize">{p}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Isim / Kullanici Adi</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" placeholder="@username" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Link URL</label><input type="text" value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} className="input" placeholder="https://..." /></div>
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Siralama</label><input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} className="input" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" /><label htmlFor="isActive" className="text-sm text-[var(--text-muted)]">Aktif</label></div>
            </div>
            <div className="flex gap-3 mt-6"><button type="button" onClick={handleSubmit} className="btn btn-primary flex-1">Kaydet</button><button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Iptal</button></div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
