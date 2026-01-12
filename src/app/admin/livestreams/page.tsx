"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

interface LiveStream {
  id: string;
  title: string;
  description: string | null;
  embedUrl: string;
  thumbnailUrl: string | null;
  isLive: boolean;
  viewCount: number;
}

export default function LivestreamsPage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LiveStream | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", embedUrl: "", thumbnailUrl: "", isLive: false });

  useEffect(() => { fetchStreams(); }, []);

  const fetchStreams = async () => {
    try {
      const res = await fetch("/api/livestreams");
      if (res.ok) setStreams(await res.json());
    } catch (error) { console.error("Fetch error:", error); }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: "", description: "", embedUrl: "", thumbnailUrl: "", isLive: false });
    setShowModal(true);
  };

  const openEditModal = (item: LiveStream) => {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description || "", embedUrl: item.embedUrl, thumbnailUrl: item.thumbnailUrl || "", isLive: item.isLive });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/livestreams/${editingItem.id}` : "/api/livestreams";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { setShowModal(false); fetchStreams(); }
    } catch (error) { console.error("Submit error:", error); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/livestreams/${id}`, { method: "DELETE" });
      if (res.ok) fetchStreams();
    } catch (error) { console.error("Delete error:", error); }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Canli Yayinlar</h1>
            <p className="text-[var(--text-muted)] text-sm">{streams.length} yayin</p>
          </div>
          <button type="button" onClick={openAddModal} className="btn btn-primary">+ Yeni Yayin</button>
        </div>

        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead><tr><th>Baslik</th><th>Embed URL</th><th>Izlenme</th><th>Durum</th><th>Islemler</th></tr></thead>
              <tbody>
                {streams.map((stream) => (
                  <tr key={stream.id}>
                    <td><p className="font-medium text-white">{stream.title}</p></td>
                    <td><p className="text-[var(--text-muted)] text-sm truncate max-w-xs">{stream.embedUrl}</p></td>
                    <td><span className="text-[var(--primary)] font-semibold">{stream.viewCount || 0}</span></td>
                    <td><span className={`badge ${stream.isLive ? "badge-live" : "bg-gray-500/20 text-gray-400"}`}>{stream.isLive ? "CANLI" : "Kapali"}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEditModal(stream)} className="btn btn-secondary text-xs py-1 px-3">Duzenle</button>
                        <button type="button" onClick={() => handleDelete(stream.id)} className="btn btn-danger text-xs py-1 px-3">Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {streams.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-[var(--text-muted)]">Henuz yayin yok</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{editingItem ? "Yayin Duzenle" : "Yeni Yayin"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Baslik</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Aciklama</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input" rows={3} /></div>
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Embed URL</label><input type="text" value={formData.embedUrl} onChange={(e) => setFormData({ ...formData, embedUrl: e.target.value })} className="input" placeholder="https://www.youtube.com/embed/..." /></div>
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Thumbnail URL</label><input type="text" value={formData.thumbnailUrl} onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })} className="input" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="isLive" checked={formData.isLive} onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })} className="w-4 h-4" /><label htmlFor="isLive" className="text-sm text-[var(--text-muted)]">Canli</label></div>
            </div>
            <div className="flex gap-3 mt-6"><button type="button" onClick={handleSubmit} className="btn btn-primary flex-1">Kaydet</button><button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Iptal</button></div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
