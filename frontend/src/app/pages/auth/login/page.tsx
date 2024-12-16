"use client";
import { useState } from "react";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";

export default function Login() {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Login</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm">
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
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}