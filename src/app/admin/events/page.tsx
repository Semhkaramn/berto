"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import ImageUpload from "@/components/ImageUpload";
import { normalizeUrl } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  clickCount: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", imageUrl: "", linkUrl: "", isActive: true });

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) setEvents(await res.json());
    } catch (error) { console.error("Fetch error:", error); }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: "", description: "", imageUrl: "", linkUrl: "", isActive: true });
    setShowModal(true);
  };

  const openEditModal = (item: Event) => {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description || "", imageUrl: item.imageUrl, linkUrl: item.linkUrl, isActive: item.isActive });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const method = editingItem ? "PUT" : "POST";
    const url = editingItem ? `/api/events/${editingItem.id}` : "/api/events";
    const normalizedData = {
      ...formData,
      linkUrl: normalizeUrl(formData.linkUrl),
    };
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(normalizedData) });
      if (res.ok) { setShowModal(false); fetchEvents(); }
    } catch (error) { console.error("Submit error:", error); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (res.ok) fetchEvents();
    } catch (error) { console.error("Delete error:", error); }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Etkinlikler</h1>
            <p className="text-[var(--text-muted)] text-sm">{events.length} etkinlik</p>
          </div>
          <button type="button" onClick={openAddModal} className="btn btn-primary">+ Yeni Etkinlik</button>
        </div>

        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead><tr><th>Gorsel</th><th>Baslik</th><th>Tiklanma</th><th>Durum</th><th>Islemler</th></tr></thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td><img src={event.imageUrl} alt={event.title} className="w-12 h-12 rounded-lg object-cover" /></td>
                    <td><p className="font-medium text-white">{event.title}</p></td>
                    <td><span className="text-[var(--primary)] font-semibold">{event.clickCount || 0}</span></td>
                    <td><span className={`badge ${event.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{event.isActive ? "Aktif" : "Pasif"}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => openEditModal(event)} className="btn btn-secondary text-xs py-1 px-3">Duzenle</button>
                        <button type="button" onClick={() => handleDelete(event.id)} className="btn btn-danger text-xs py-1 px-3">Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-[var(--text-muted)]">Henuz etkinlik yok</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">{editingItem ? "Etkinlik Duzenle" : "Yeni Etkinlik"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Baslik</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input" /></div>
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Aciklama</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input" rows={3} /></div>
              <ImageUpload label="Gorsel" value={formData.imageUrl} onChange={(url) => setFormData({ ...formData, imageUrl: url })} />
              <div><label className="block text-sm font-medium text-[var(--text-muted)] mb-2">Link URL</label><input type="text" value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} className="input" /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4" /><label htmlFor="isActive" className="text-sm text-[var(--text-muted)]">Aktif</label></div>
            </div>
            <div className="flex gap-3 mt-6"><button type="button" onClick={handleSubmit} className="btn btn-primary flex-1">Kaydet</button><button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Iptal</button></div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
