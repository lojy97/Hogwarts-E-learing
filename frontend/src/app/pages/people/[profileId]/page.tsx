"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Image from "next/image"; // Optimized image component from Next.js
import Layout from "@/app/components/layout";
import { user } from "@/app/_lib/page";
import { course } from "@/app/_lib/page";

export default function Profile() {
  const [user, setUser] = useState<user | null>(null);
  const [courses, setCourses] = useState<course[]>([]);
  const router = useRouter();
  const { profileId } = useParams();

  useEffect(() => {
    if (!profileId) return;

    const fetchUser = async () => {
      try {
        // Fetch user by profileId
        const response = await axiosInstance.get<user>(`/users/${profileId}`);
        setUser(response.data);

        // Fetch course details for each course ID
        const courseDetails = await Promise.all(
          response.data.courses.map(async (courseId) => {
            const courseResponse = await axiosInstance.get<course>(`/course/${courseId}`);
            return courseResponse.data;
          })
        );

        setCourses(courseDetails);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
          alert("User not found.");
          router.push("/"); // Redirect to the homepage if user is not found
        } else {
          console.error("Error fetching user data", error);
        }
      }
    };

    fetchUser();
  }, [profileId, router]);

  if (!user) {
    return <p className="text-gray-400">Loading...</p>;
  }

  return (
    <Layout>
      <main className="min-h-screen bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl bg-[#202020] p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">Profile</h1>

          <section className="flex items-center gap-4">
            {user.profilePictureUrl && (
              <Image
                src={user.profilePictureUrl}
                alt={`${user.name}'s Profile Picture`}
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-400 text-lg">{user.email}</p>
            </div>
          </section>

          <section className="mt-8 grid grid-cols-2 gap-4 text-gray-300">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-400">Role</p>
              <p className="font-medium text-lg">{user.role}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-400">Email Verified</p>
              <p className="font-medium text-lg">{user.emailVerified ? "Yes" : "No"}</p>
            </div>
            {user.role === "instructor" && (
              <>
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400">Rating Score</p>
                  <p className="font-medium text-lg">{user.ratingsc ?? "Unrated"}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-400">Average Rating</p>
                  <p className="font-medium text-lg">{user.avgRating ?? "Unrated"}</p>
                </div>
              </>
            )}
          </section>

          {courses.length > 0 && (
            <section className="mt-8">
              <h3 className="text-xl font-semibold text-white">Courses</h3>
              <ul className="mt-4 grid grid-cols-1 gap-4">
                {courses.map(
                  (course) =>
                    course.isAvailable && (
                      <li
                        key={course._id.toString()}
                        className="bg-[#353535] px-4 py-4 rounded-md text-gray-200"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-400">Course Title</p>
                            <p className="font-medium text-lg">{course.title}</p>
                          </div>
                        </div>
                        <p className="text-xs uppercase tracking-wide text-gray-400 mt-2">Course ID</p>
                        <p className="font-medium text-base">{course._id.toString()}</p>
                      </li>
                    )
                )}
              </ul>
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
}
