"use client";
import { useState } from "react";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { useRouter } from 'next/navigation';


export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.status === 200) {
        const user = response.data;
        console.log("Login response data:", user);
        alert(`Login successful! Welcome ${user.role}`);
        router.push('/pages/profile'); // Redirect to profile page

      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        alert("Email is not verified");
      } else {
        console.error("Login failed", error);
        alert("Login failed");
      }
    }
  };

  return (
      <main className="min-h-screen bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl bg-[#202020] p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">Login</h1>
          <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto">
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded-lg focus:outline-none"
                required
              />
            </div>
            <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </div>
          </form>
        </div>
      </main>
  );
}