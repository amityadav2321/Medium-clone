import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AppBar from "../pages/AppBar";

interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author?: { name?: string };
}
const API_BASE_URL = import.meta.env.VITE_API_URL;
export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Random date & time generator for demo
  const getRandomDateTime = () => {
    const now = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);

    const randomDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - randomDaysAgo,
      randomHours,
      randomMinutes
    );

    const dateString = randomDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const timeString = randomDate.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { dateString, timeString };
  };

  const [randomDateTime] = useState(getRandomDateTime());

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/blog/${id}`, {
          withCredentials: true,
        });
        console.log("Fetched blog:", res.data);
        setBlog(res.data.blog);
      } catch (err: any) {
        console.error("Failed to fetch blog:", err);
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch blog"
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 text-lg">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppBar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Blog not found.</p>
        </div>
      </div>
    );
  }

  // Avatar helper
  const Avatar = ({ name }: { name?: string }) => {
    const initial = name?.trim()?.[0]?.toUpperCase() || "?";
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500"];
    const randomColor = colors[name?.length ? name.length % colors.length : 0];
    return (
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full text-white font-semibold shadow-sm ${randomColor}`}
      >
        {initial}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-black mb-6 flex items-center gap-1"
        >
          ← Back
        </button>

        {/* Blog container */}
        <div className="bg-white rounded-2xl shadow-md p-8 transition hover:shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={blog.author?.name} />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {blog.author?.name || "Unknown"}
              </h3>
              <p className="text-sm text-gray-500">
                {randomDateTime.dateString}
              </p>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            {blog.content}
          </div>

          {/* Footer (Published time) */}
          <div className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
            <span>Published at {randomDateTime.timeString}</span>
            <span className="text-gray-400 italic">✨ Premium Blog Layout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
