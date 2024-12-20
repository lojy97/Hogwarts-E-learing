"use client";

import { user } from "@/app/_lib/page";
import { useEffect, useState } from "react";
import Link from "next/link";
import axiosInstance from "../../utils/axiosInstance";
import Layout from "@/app/components/layout";
import axios from "axios";
export default function People() {
  const [Users, setUsers] = useState<user[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [filterText, setFilterText] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
        try {
          const response = await axiosInstance.get<user[]>('/users');
          setUsers(response.data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("-------------------------------Axios error:", error.response?.data || error.message);
          } else {
            console.error("Unexpected error:", error);
          }
        }
      };
      fetchUsers();
  }, []);

  const filteredUsers = Users.filter((user) => {
    const matchesRole =
      filter === "All" ||
      (filter === "Instructors" && user.role === "instructor") ||
      (filter === "Students" && user.role === "student");

    const matchesSearch = user.name
      .toLowerCase()
      .includes(filterText.toLowerCase()) || user.email.toLowerCase().includes(filterText.toLowerCase());
      
    return matchesRole && matchesSearch;
  });

  return (
    <Layout>
      <main className="min-h-screen bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl bg-[#202020] p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">People</h1>

          {/* Filters */}
          <section className="mb-6 flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setFilter("All")}
                className={`py-2 px-4 rounded-md ${filter === "All" ? "bg-blue-600" : "bg-gray-600"} text-white`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("Instructors")}
                className={`py-2 px-4 rounded-md ${filter === "Instructors" ? "bg-blue-600" : "bg-gray-600"} text-white`}
              >
                Instructors
              </button>
              <button
                onClick={() => setFilter("Students")}
                className={`py-2 px-4 rounded-md ${filter === "Students" ? "bg-blue-600" : "bg-gray-600"} text-white`}
              >
                Students
              </button>
            </div>
            <input
              type="text"
              placeholder="Search by name or email"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="p-2 rounded-md bg-gray-800 text-white w-1/3"
            />
          </section>

          {/* User List */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user._id.toString()} className="bg-[#353535] p-4 rounded-lg text-gray-300">
                <h3 className="text-lg font-bold text-white">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-400 capitalize">Role: {user.role}</p>
                <Link href={`people/${user._id.toString()}`} className="mt-2 inline-block py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
  View Profile
</Link>

              </div>
            ))}
          </section>
        </div>
      </main>
    </Layout>
  );
}
