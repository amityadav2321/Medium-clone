import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { FormEvent } from "react";
import axios from "axios";
import type { SigninInput } from "@amityadav2005/medium-blog";
const API_BASE_URL = import.meta.env.VITE_API_URL;
export default function Signin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SigninInput>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
         `${API_BASE_URL}/api/v1/user/signin`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // ✅ allow cookie to be sent and stored
        }
      );

      console.log("✅ Signin response:", data);

       localStorage.setItem("isLoggedIn", "true");

      // ✅ No need to manually store token, cookie will be automatically managed by browser
      navigate("/blogs", { replace: true });
    } catch (err: any) {
      console.error("Signin error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 bg-white">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-600 mb-6">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-black font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-black text-white rounded-md py-2 font-medium hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-1/2 bg-gray-50 justify-center items-center p-10">
        <div className="max-w-md text-center">
          <p className="text-xl font-medium mb-4">
            “The platform is clean, simple, and fast — I love how easy it is to
            share my blogs.”
          </p>
          <p className="font-semibold">Vincent Vega</p>
          <p className="text-gray-500 text-sm">Writer @ Medium Clone</p>
        </div>
      </div>
    </div>
  );
}
