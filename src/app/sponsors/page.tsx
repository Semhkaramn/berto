"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ImageUpload from "@/components/ImageUpload";
import { normalizeUrl } from "@/lib/utils";

interface Sponsor {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
  type: string;
  isActive: boolean;
  clickCount: number;
  sortOrder: number;
}

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Sponsor | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    linkUrl: "",
    type: "normal",
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const res = await fetch("/api/sponsors");
      if (res.ok) setSponsors(await res.json());
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: "", description: "", imageUrl: "", linkUrl: "", type: "normal", isActive: true, sortOrder: 0 });
    setShowModal(true);
  };

  const openEditModal = (item: Sponsor) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl,
      type: item.type,
      isActive: item.isActive,
      sortOrder: item.sortOrder || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/sponsors/${editingItem.id}` : "/api/sponsors";
    const normalizedData = {
      ...formData,
      linkUrl: normalizeUrl(formData.linkUrl),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedData),
      });
      if (res.ok) {
        setShowModal(false);
        fetchSponsors();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/sponsors/${id}`, { method: "DELETE" });
      if (res.ok) fetchSponsors();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Sponsorlar - Berto’nun Güvenle Oynadığı Siteler</h1>
            <p className="text-[var(--text-muted)] text-sm">{sponsors.length} sponsor</p>
          </div>
          <button type="button" onClick={openAddModal} className="btn btn-primary">
            + Yeni Sponsor
          </button>
        </div>

        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Gorsel</th>
                  <th>Isim</th>
                  <th>Tip</th>
                  <th>Sira</th>
                  <th>Tiklanma</th>
                  <th>Durum</th>
                  <th>Islemler</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((sponsor) => (
                  <tr key={sponsor.id}>
                    <td>
                      <div className="w-16 h-12 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={sponsor.imageUrl}
                          alt={sponsor.name}
                          className="max-w-full max-h-full w-auto h-auto object-contain"
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-white">{sponsor.name}</p>
                        {sponsor.description && (
                          <p className="text-xs text-[var(--text-muted)] truncate max-w-xs">{sponsor.description}</p>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${sponsor.type}`}>{sponsor.type.toUpperCase()}</span>
                    </td>
                    <td>
                      <span className="text-white font-medium">{sponsor.sortOrder || 0}</span>
                    </td>
                    <td>
                      <span className="text-[var(--primary)] font-semibold">{sponsor.clickCount || 0}</span>
                    </td>
                    <td>
                      <span className={`badge ${sponsor.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {sponsor.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEditModal(sponsor)} className="btn btn-secondary text-xs py-1 px-3">
                          Duzenle
                        </button>
                        <button type="button" onClick={() => handleDelete(sponsor.id)} className="btn btn-danger text-xs py-1 px-3">
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sponsors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-[var(--text-muted)]">
                      Henuz sponsor yok
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{editingItem ? "Sponsor Duzenle" : "Yeni Sponsor"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Isim</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Aciklama</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input" rows={3} />
              </div>
              <ImageUpload
                label="Gorsel"
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Link URL</label>
                <input type="text" value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Tip</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input">
                    <option value="main">Main</option>
                    <option value="vip">VIP</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Gosterim Sirasi</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="input"
                    min={0}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" />
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
