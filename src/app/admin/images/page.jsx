"use client";

import { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import DeleteConfirmationModal from "@/components/block/DeleteConfirmationModal"; // Confirm modal

export default function ImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [uploading, setUploading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/image");
      const data = await res.json();
      setImages(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImages((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch("/api/image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: selectedImageId }),
      });
      setImages((prev) => prev.filter((img) => img._id !== selectedImageId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const sortedImages = [...images].sort((a, b) =>
    sortOrder === "desc" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)
  );

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Image Manager</h1>
          <p className="text-sm text-gray-500">Upload and manage images</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm">
            {uploading ? "Uploading..." : "Upload"}
            <input type="file" accept="image/*" hidden onChange={handleUpload} />
          </label>

          {/* Sort */}
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border rounded-md px-2 py-1 text-sm focus:outline-none">
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-180px)]">
          <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
        </div>
      ) : sortedImages.length > 0 ? (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedImages.map((img) => (
            <div key={img._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition relative">
              <img src={img.url} alt={img.name} className="w-full h-48 object-fill" />
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate">{img.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(img.createdAt).toLocaleDateString()}{" "}
                  {new Date(img.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => {
                  setDeleteModalOpen(true);
                  setSelectedImageId(img._id);
                }}
                className="absolute cursor-pointer top-2 right-2 bg-white/80 hover:bg-red-500 hover:text-white text-gray-600 rounded-full p-1 text-xs"
              >
                <CircleX size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">No images found</div>
      )}
      <DeleteConfirmationModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} />
    </div>
  );
}
