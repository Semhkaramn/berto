"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

interface Banner {
  id: string;
  imageUrl: string;
  linkUrl: string | null;
  position: string;
  isActive: boolean;
  clickCount: number;
}

const bannerPositions = [
  { id: "top-1", label: "Ust Banner 1", description: "Sayfanin ustunde, yatay" },
  { id: "top-2", label: "Ust Banner 2", description: "Sayfanin ustunde, yatay" },
  { id: "top-3", label: "Ust Banner 3", description: "Sayfanin ustunde, yatay" },
  { id: "left", label: "Sol Banner", description: "Sayfanin solunda, dikey" },
  { id: "right", label: "Sag Banner", description: "Sayfanin saginda, dikey" },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    imageUrl: "",
    linkUrl: "",
    position: "top-1",
    isActive: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners");
      if (res.ok) setBanners(await res.json());
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const openAddModal = (position: string) => {
    setEditingItem(null);
    setFormData({ imageUrl: "", linkUrl: "", position, isActive: true });
    setShowModal(true);
  };

  const openEditModal = (item: Banner) => {
    setEditingItem(item);
    setFormData({
      imageUrl: item.imageUrl,
      linkUrl: item.linkUrl || "",
      position: item.position,
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/banners/${editingItem.id}` : "/api/banners";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowModal(false);
        fetchBanners();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (res.ok) fetchBanners();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const getBannerByPosition = (position: string) => banners.find((b) => b.position === position);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Bannerlar</h1>
          <p className="text-[var(--text-muted)] text-sm">Site banner alanlarini yonetin</p>
        </div>

        {/* Ust Bannerlar */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Ust Bannerlar (Yatay)</h2>
          <div className="grid grid-cols-1 gap-4">
            {bannerPositions.filter(p => p.id.startsWith("top")).map((pos) => {
              const banner = getBannerByPosition(pos.id);
              return (
                <div key={pos.id} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{pos.label}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{pos.description}</p>
                    </div>
                    {banner && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--primary)]">{banner.clickCount || 0} tiklanma</span>
                        <button type="button" onClick={() => openEditModal(banner)} className="text-blue-400 hover:text-blue-300 text-sm">
                          Duzenle
                        </button>
                        <button type="button" onClick={() => handleDelete(banner.id)} className="text-red-400 hover:text-red-300 text-sm">
                          Sil
                        </button>
                      </div>
                    )}
                  </div>
                  {banner ? (
                    <div className="relative">
                      <img src={banner.imageUrl} alt="Banner" className="w-full h-20 md:h-24 object-cover rounded-lg" />
                      {banner.linkUrl && (
                        <p className="text-xs text-[var(--text-muted)] mt-2 truncate">{banner.linkUrl}</p>
                      )}
                    </div>
                  ) : (
                    <div className="h-20 md:h-24 bg-[var(--background)] rounded-lg flex items-center justify-center border-2 border-dashed border-[var(--border)]">
                      <button type="button" onClick={() => openAddModal(pos.id)} className="text-[var(--text-muted)] hover:text-white flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Banner Ekle
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Yan Bannerlar */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Yan Bannerlar (Dikey)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bannerPositions.filter(p => !p.id.startsWith("top")).map((pos) => {
              const banner = getBannerByPosition(pos.id);
              return (
                <div key={pos.id} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-white">{pos.label}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{pos.description}</p>
                    </div>
                    {banner && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--primary)]">{banner.clickCount || 0} tiklanma</span>
                        <button type="button" onClick={() => openEditModal(banner)} className="text-blue-400 hover:text-blue-300 text-sm">
                          Duzenle
                        </button>
                        <button type="button" onClick={() => handleDelete(banner.id)} className="text-red-400 hover:text-red-300 text-sm">
                          Sil
                        </button>
                      </div>
                    )}
                  </div>
                  {banner ? (
                    <div>
                      <img src={banner.imageUrl} alt="Banner" className="w-full h-48 object-cover rounded-lg" />
                      {banner.linkUrl && (
                        <p className="text-xs text-[var(--text-muted)] mt-2 truncate">{banner.linkUrl}</p>
                      )}
                    </div>
                  ) : (
                    <div className="h-48 bg-[var(--background)] rounded-lg flex items-center justify-center border-2 border-dashed border-[var(--border)]">
                      <button type="button" onClick={() => openAddModal(pos.id)} className="text-[var(--text-muted)] hover:text-white flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Banner Ekle
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{editingItem ? "Banner Duzenle" : "Yeni Banner"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Gorsel URL</label>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="input" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Link URL (opsiyonel)</label>
                <input type="text" value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} className="input" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Pozisyon</label>
                <select value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="input">
                  {bannerPositions.map((pos) => (
                    <option key={pos.id} value={pos.id}>{pos.label}</option>
                  ))}
                </select>
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
