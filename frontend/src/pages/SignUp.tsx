import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signupInput } from "@amityadav2005/medium-blog";
import type { SignupInput } from "@amityadav2005/medium-blog";
const API_BASE_URL = import.meta.env.VITE_API_URL;
export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validation = signupInput.safeParse(formData);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      // ✅ Send credentials so cookies get set
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/signup`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // 🔥 allows cookies to be saved automatically
        }
      );

      console.log("✅ Signup response:", res.data);

      // ✅ If backend sets JWT as cookie, no need to manually store it
      // You can still check for success:
      if (res.status === 200) {
        navigate("/blogs");
      } else {
        throw new Error("Signup failed, please try again");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 bg-white">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-3xl font-bold mb-2">Create your account</h2>
          <p className="text-sm text-gray-600 mb-6">
            Already have an account?{" "}
            <Link to="/signin" className="text-black font-medium hover:underline">
              Login
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-md py-2 font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-1/2 bg-gray-50 justify-center items-center p-10">
        <div className="max-w-md text-center">
          <p className="text-xl font-medium mb-4 italic text-gray-700">
            “The customer service I received was exceptional. The support team went above and beyond to address my concerns.”
          </p>
          <p className="font-semibold text-gray-900">Jules Winnfield</p>
          <p className="text-gray-500 text-sm">CEO, Acme Inc</p>
        </div>
      </div>
    </div>
  );
}
