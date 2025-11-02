import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppBar from "./AppBar";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function CreateBlog() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!title.trim() || !content.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
     const res = await axios.post(
        `${API_BASE_URL}/api/v1/blog`,
        { title, content },
        { withCredentials: true }
      );
      console.log("Blog created:", res.data);

      setSuccess(true);
      setTitle("");
      setContent("");

      // Redirect after 1.5s to blogs list
      setTimeout(() => navigate("/blogs"), 1500);
    } catch (err: any) {
      console.error("Failed to create blog:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong while creating blog."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppBar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white shadow-md rounded-2xl w-full max-w-2xl p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            ✍️ Create a New Blog
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog title..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Content textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blog Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Write your blog content here..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Success message */}
            {success && (
              <p className="text-green-600 text-sm text-center">
                ✅ Blog created successfully!
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-white rounded-lg text-lg font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Publishing..." : "Publish Blog"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
