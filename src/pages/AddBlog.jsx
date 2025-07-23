import React, { useState } from "react";
import JoditEditor from "jodit-react";
import Swal from "sweetalert2";

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (err) {
      Swal.fire("❌ Upload Error", err.message, "error");
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !thumbnail || !content) {
      return Swal.fire("⚠️ Required", "All fields are required", "warning");
    }

    setUploading(true);
    const imageUrl = await handleImageUpload(thumbnail);
    if (!imageUrl) {
      setUploading(false);
      return;
    }

    const newBlog = {
      title,
      thumbnail: imageUrl,
      content,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog),
      });

      if (res.ok) {
        Swal.fire("✅ Success", "Blog saved as draft", "success");
        setTitle("");
        setThumbnail(null);
        setContent("");
      } else {
        Swal.fire("❌ Error", "Failed to save blog", "error");
      }
    } catch (err) {
      Swal.fire("❌ Error", err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-2xl font-bold mb-6">➕ Add New Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Enter blog title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0 file:text-sm file:font-semibold
                     file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
        />

        <JoditEditor value={content} onChange={(newContent) => setContent(newContent)} />

        <button
          type="submit"
          disabled={uploading}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded"
        >
          {uploading ? "Uploading..." : "Save as Draft"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
