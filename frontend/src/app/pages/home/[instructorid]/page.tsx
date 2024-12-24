"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { useRouter } from "next/router";
import Link from "next/link";  // Importing NextLink for navigation
import { instructor } from "@/app/_lib/page";

const InstructorProfile: React.FC = () => {
  const router = useRouter();
  const { instructorId } = router.query; // Get the dynamic instructorId from the URL
  const [instructorData, setInstructorData] = useState<instructor | null>(null);

  useEffect(() => {
    if (!instructorId) return;

    const fetchInstructorProfile = async () => {
      try {
        const response = await axiosInstance.get<instructor>(`/users/${instructorId}`);
        setInstructorData(response.data);
      } catch (error) {
        console.error("Error fetching instructor profile:", error);
      }
    };

    fetchInstructorProfile();
  }, [instructorId]);

  if (!instructorData) {
    return <p className="text-gray-400">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl bg-[#202020] p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-white">{instructorData.name}</h1>
        <section className="mt-6 text-gray-300">
          <p className="text-sm">Email: {instructorData.email}</p>
          <p className="text-sm">Avg Rating: {instructorData.avgRating ?? "No ratings yet"}</p>
          <p className="text-sm">Courses Taught: {instructorData.courses.length}</p>
          <section className="mt-6">
            <h3 className="text-xl text-white">Courses by {instructorData.name}</h3>
            <ul className="mt-4">
              {/* List instructor courses here */}
            </ul>
          </section>
        </section>
        <Link href="/home" className="mt-4 inline-block py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
          Back to Instructors
        </Link>
      </div>
    </div>
  );
};

export default InstructorProfile;
