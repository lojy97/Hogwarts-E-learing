"use client";
import { useState } from "react";
import axios from "axios";
import axiosInstance from "../../../utils/axiosInstance";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Layout from "@/app/components/layout";
import { messaging, getToken } from '../../../../../public/firebase';


const checkNotificationPermission = async (id: string) => {
  const permission = Notification.permission;
  const hasPrompted = localStorage.getItem('notificationsPrompted');

  // If permission is 'default' and user hasn't been prompted before
  if (permission === 'default' && !hasPrompted) {
    const result = await Notification.requestPermission();

    // Mark as prompted to avoid asking again
    localStorage.setItem('notificationsPrompted', 'true');

    if (result === 'granted') {
      try {
        const token = await getToken(messaging, {
          vapidKey: 'BCQS3iIADV5PWNxpwaN8hx3mNT9pz716ZRkV0Qxxtni1s5QxlPjP6IVp0gIZ2pdSM6axou9cSe1PG7Vz4hGWa8o'  // Use your generated VAPID key
        });

        console.log('Notification Token:', token);
        console.log(id);
        // Send token to backend to save
        await axiosInstance.post(`/users/${id}`, { userToken: token });
      } catch (error) {
        console.error('Failed to get token:', error);
      }
    }
  }
};

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
        const userRole = user.data.payload.role;

        console.log("Login response data:", user);
        console.log("User role:", userRole); // Log the user's role

        alert(`Login successful! Welcome ${userRole}`);

        // Fetch current user data
        const currentUserResponse = await axiosInstance.get('/users/currentUser');
        if (currentUserResponse.status === 200) {
          const currentUser = currentUserResponse.data;
          Cookies.set('userId', currentUser._id);
          Cookies.set('userName', currentUser.name);
          Cookies.set('userRole', currentUser.role);
        }

        checkNotificationPermission(currentUserResponse.data._id);

        // Redirect based on user role
        if (userRole === 'student') {
          router.push('/pages/student/home');
        } else if (userRole === 'instructor') {
          router.push('/pages/instructor/home');
        } else if (userRole === 'admin') {
          router.push('/pages/Admin/home');
        }
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
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
        <h1 className="text-4xl font-bold text-white mb-8">Login</h1>
        <form onSubmit={handleLogin} className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}