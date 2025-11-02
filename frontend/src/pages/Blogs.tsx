import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppBar from "../pages/AppBar";

interface Blog {
  id: string;
  title: string;
  content: string;
  author?: { name?: string };
  createdAt?: string;
}
const API_BASE_URL = import.meta.env.VITE_API_URL;
export default function Blogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate random publish date for demo
  const getRandomDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 10);
    const randomDate = new Date(now);
    randomDate.setDate(now.getDate() - daysAgo);
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    randomDate.setHours(randomHour, randomMinute);
    return randomDate;
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/blog/bulk`, {
          withCredentials: true,
        });

        const blogsWithDates = res.data.blogs.map((b: Blog) => ({
          ...b,
          createdAt: b.createdAt || getRandomDate().toISOString(),
        }));

       setBlogs((blogsWithDates || []).reverse());

      } catch (err: any) {
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            "Failed to fetch blogs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // 🦴 Skeleton Loader while loading
 if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppBar />
      <div className="max-w-4xl mx-auto mt-10 px-6 space-y-6 w-full">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-white rounded-2xl p-6 border border-gray-200 shadow-sm w-full"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-100 rounded w-1/4"></div>
              </div>
            </div>

            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-5/6 mb-4"></div>

            {/* Content */}
            <div className="space-y-2 mb-5">
              <div className="h-4 bg-gray-100 rounded w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-11/12"></div>
              <div className="h-4 bg-gray-100 rounded w-10/12"></div>
              <div className="h-4 bg-gray-100 rounded w-9/12"></div>
            </div>

            {/* Footer */}
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <div className="max-w-4xl mx-auto mt-10 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Latest Blogs ✨
        </h1>

        {blogs.length === 0 ? (
          <p className="text-center text-gray-500">No blogs available yet.</p>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                onClick={() => navigate(`/blog/${blog.id}`)}
                className="cursor-pointer bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 transition duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={blog.author?.name} />
                  <div>
                    <p className="text-sm text-gray-800 font-medium">
                      {blog.author?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(blog.createdAt!).toLocaleDateString([], {
                        dateStyle: "medium",
                      })}
                    </p>
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition">
                  {blog.title}
                </h2>

                <p className="text-gray-700 text-base line-clamp-3 mb-4">
                  {blog.content.slice(0, 200)}...
                </p>

                <div className="text-sm text-gray-500 flex justify-between items-center border-t pt-3">
                  <span>
                    ⏰ Published at{" "}
                    {new Date(blog.createdAt!).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="hover:text-blue-600 font-medium">
                    Read more →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Avatar({ name }: { name?: string }) {
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";
  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-amber-500",
  ];
  const randomColor = colors[name?.length ? name.length % colors.length : 0];
  return (
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold ${randomColor}`}
    >
      {initial}
    </div>
  );
}
