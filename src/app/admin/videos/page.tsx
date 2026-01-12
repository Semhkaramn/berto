"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

interface Video {
  id: string;
  title: string;
  description: string | null;
  embedUrl: string;
  thumbnailUrl: string | null;
  viewCount: number;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Video | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", embedUrl: "", thumbnailUrl: "" });
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      if (res.ok) setVideos(await res.json());
    } catch (error) { console.error("Fetch error:", error); }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ title: "", description: "", embedUrl: "", thumbnailUrl: "" });
    setYoutubeUrl("");
    setError("");
    setShowModal(true);
  };

  const fetchYoutubeInfo = async () => {
    if (!youtubeUrl.trim()) {
      setError("YouTube URL girin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/youtube/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      const data = await res.json();

      if (res.ok) {
        setFormData({
          title: data.title,
          description: `${data.author} tarafindan`,
          embedUrl: data.embedUrl,
          thumbnailUrl: data.thumbnailUrl,
        });
      } else {
        setError(data.error || "Video bilgileri alinamadi");
      }
    } catch (err) {
      setError("Bir hata olustu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.embedUrl) {
      setError("Lutfen once YouTube URL girin ve bilgileri cekin");
      return;
    }

    try {
      const res = await fetch("/api/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (res.ok) { setShowModal(false); fetchVideos(); }
    } catch (error) { console.error("Submit error:", error); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (res.ok) fetchVideos();
    } catch (error) { console.error("Delete error:", error); }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Videolar</h1>
            <p className="text-[var(--text-muted)] text-sm">{videos.length} video</p>
          </div>
          <button type="button" onClick={openAddModal} className="btn btn-primary">+ Yeni Video</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
              {video.thumbnailUrl ? (
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-[var(--background)] flex items-center justify-center">
                  <svg className="w-12 h-12 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">{video.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mb-2">{video.viewCount || 0} izlenme</p>
                <button type="button" onClick={() => handleDelete(video.id)} className="btn btn-danger text-xs py-1 px-3 w-full">Sil</button>
              </div>
            </div>
          ))}
          {videos.length === 0 && (
            <div className="col-span-full text-center py-12 text-[var(--text-muted)]">Henuz video yok</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Yeni Video</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* YouTube URL Input */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">YouTube Video URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="input flex-1"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <button
                    type="button"
                    onClick={fetchYoutubeInfo}
                    disabled={loading}
                    className="btn btn-primary whitespace-nowrap"
                  >
                    {loading ? (
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : "Bilgileri Cek"}
                  </button>
                </div>
                {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
              </div>

              {/* Preview - Bilgiler çekildiğinde göster */}
              {formData.embedUrl && (
                <div className="bg-[var(--background)] rounded-lg p-4 border border-[var(--border)]">
                  <div className="flex gap-4">
                    {formData.thumbnailUrl && (
                      <img src={formData.thumbnailUrl} alt="Thumbnail" className="w-32 h-20 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{formData.title}</h4>
                      <p className="text-sm text-[var(--text-muted)]">{formData.description}</p>
                      <p className="text-xs text-green-400 mt-2">Video bilgileri alindi</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={handleSubmit} disabled={!formData.embedUrl} className="btn btn-primary flex-1 disabled:opacity-50">Kaydet</button>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Iptal</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
