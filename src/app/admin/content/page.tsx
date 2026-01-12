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

interface Video {
  id: string;
  title: string;
  description: string | null;
  embedUrl: string;
  thumbnailUrl: string | null;
  viewCount: number;
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<"livestreams" | "videos">("livestreams");
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"livestream" | "video">("livestream");
  const [editingItem, setEditingItem] = useState<LiveStream | Video | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", embedUrl: "", thumbnailUrl: "", isLive: false });
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStreams();
    fetchVideos();
  }, []);

  const fetchStreams = async () => {
    try {
      const res = await fetch("/api/livestreams");
      if (res.ok) setStreams(await res.json());
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos");
      if (res.ok) setVideos(await res.json());
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const openAddModal = (type: "livestream" | "video") => {
    setModalType(type);
    setEditingItem(null);
    setFormData({ title: "", description: "", embedUrl: "", thumbnailUrl: "", isLive: false });
    setYoutubeUrl("");
    setError("");
    setShowModal(true);
  };

  const openEditModal = (item: LiveStream) => {
    setModalType("livestream");
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      embedUrl: item.embedUrl,
      thumbnailUrl: item.thumbnailUrl || "",
      isLive: item.isLive,
    });
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
          ...formData,
          title: data.title,
          description: `${data.author} tarafindan`,
          embedUrl: data.embedUrl,
          thumbnailUrl: data.thumbnailUrl,
        });
      } else {
        setError(data.error || "Bilgiler alinamadi");
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

    if (modalType === "livestream") {
      const method = editingItem ? "PUT" : "POST";
      const url = editingItem ? `/api/livestreams/${editingItem.id}` : "/api/livestreams";
      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setShowModal(false);
          fetchStreams();
        }
      } catch (error) {
        console.error("Submit error:", error);
      }
    } else {
      try {
        const res = await fetch("/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setShowModal(false);
          fetchVideos();
        }
      } catch (error) {
        console.error("Submit error:", error);
      }
    }
  };

  const handleDeleteStream = async (id: string) => {
    if (!confirm("Silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/livestreams/${id}`, { method: "DELETE" });
      if (res.ok) fetchStreams();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Silmek istediginize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      if (res.ok) fetchVideos();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Yayınlar</h1>
            <p className="text-[var(--text-muted)] text-sm">
              {streams.length} canlı yayın, {videos.length} video
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => openAddModal("livestream")}
              className="btn btn-primary"
            >
              + Canlı Yayın
            </button>
            <button
              type="button"
              onClick={() => openAddModal("video")}
              className="btn btn-secondary"
            >
              + Video
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("livestreams")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "livestreams"
                ? "bg-red-500 text-white"
                : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-white"
            }`}
          >
            Canlı Yayınlar ({streams.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "videos"
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-white"
            }`}
          >
            Videolar ({videos.length})
          </button>
        </div>

        {/* Livestreams Tab */}
        {activeTab === "livestreams" && (
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Baslik</th>
                    <th>Izlenme</th>
                    <th>Durum</th>
                    <th>Islemler</th>
                  </tr>
                </thead>
                <tbody>
                  {streams.map((stream) => (
                    <tr key={stream.id}>
                      <td>
                        {stream.thumbnailUrl ? (
                          <img
                            src={stream.thumbnailUrl}
                            alt={stream.title}
                            className="w-20 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-zinc-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td>
                        <p className="font-medium text-white">{stream.title}</p>
                      </td>
                      <td>
                        <span className="text-[var(--primary)] font-semibold">
                          {stream.viewCount || 0}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            stream.isLive ? "badge-live" : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {stream.isLive ? "CANLI" : "Kapali"}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(stream)}
                            className="btn btn-secondary text-xs py-1 px-3"
                          >
                            Düzenle
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStream(stream.id)}
                            className="btn btn-danger text-xs py-1 px-3"
                          >
                            Sil
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {streams.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-[var(--text-muted)]">
                        Henuz canlı yayın yok
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden"
              >
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-[var(--background)] flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-[var(--text-muted)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                    </svg>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">{video.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] mb-2">
                    {video.viewCount || 0} izlenme
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(video.id)}
                    className="btn btn-danger text-xs py-1 px-3 w-full"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
            {videos.length === 0 && (
              <div className="col-span-full text-center py-12 text-[var(--text-muted)]">
                Henuz video yok
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingItem
                  ? "Yayin Duzenle"
                  : modalType === "livestream"
                    ? "Yeni Canli Yayin"
                    : "Yeni Video"}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[var(--text-muted)] hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* YouTube URL Input */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-muted)] mb-2">
                  YouTube URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="input flex-1"
                    placeholder="https://www.youtube.com/watch?v=... veya /live/..."
                  />
                  <button
                    type="button"
                    onClick={fetchYoutubeInfo}
                    disabled={loading}
                    className="btn btn-primary whitespace-nowrap"
                  >
                    {loading ? (
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : (
                      "Bilgileri Cek"
                    )}
                  </button>
                </div>
                {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
              </div>

              {/* Preview */}
              {formData.embedUrl && (
                <div className="bg-[var(--background)] rounded-lg p-4 border border-[var(--border)]">
                  <div className="flex gap-4">
                    {formData.thumbnailUrl && (
                      <img
                        src={formData.thumbnailUrl}
                        alt="Thumbnail"
                        className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{formData.title}</h4>
                      <p className="text-sm text-[var(--text-muted)]">{formData.description}</p>
                      <p className="text-xs text-green-400 mt-2">Bilgiler alindi</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Canlı durumu - sadece livestream için */}
              {modalType === "livestream" && (
                <div className="flex items-center gap-2 p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                  <input
                    type="checkbox"
                    id="isLive"
                    checked={formData.isLive}
                    onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                    className="w-5 h-5 accent-red-500"
                  />
                  <label
                    htmlFor="isLive"
                    className="text-sm text-white font-medium flex items-center gap-2"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${formData.isLive ? "bg-red-500 animate-pulse" : "bg-gray-500"}`}
                    />
                    Canlı Yayın Aktif
                  </label>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!formData.embedUrl && !editingItem}
                className="btn btn-primary flex-1 disabled:opacity-50"
              >
                Kaydet
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
