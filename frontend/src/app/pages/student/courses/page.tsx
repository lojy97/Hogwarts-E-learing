"use client";
import { course } from "@/app/_lib/page";
import { student } from "@/app/_lib/page"
import { user } from "@/app/_lib/page"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import axiosInstance from "../../../utils/axiosInstance";
import Layout from "@/app/components/layout";

export default function Courses() {
  const [user, setUser] = useState<user | null>(null);
  const [Courses, setCourses] = useState<course[]>([]);
  const router = useRouter();
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get<course[]>(`/course`);
        setCourses(response.data);
      } catch (error) {
        console.error("error fetching courses", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get<user>('/users/currentUser');
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("error fetching user", error);
      }
    };
    fetchCourses();
    fetchUser();

  }, []);
  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Courses</h1>
        <div className="w-full max-w-4xl">
          {Courses.length > 0 ? (
            <ul className="space-y-4">
              {Courses.map((course: course, index) => (
                <li
                  key={index}
                  className="p-4 bg-[#202020] rounded-lg text-white shadow-md"
                >
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-gray-400">{course.description}</p>
                  <p className="text-gray-400 font-semibold">Rating:{course.averageRating}</p>
                  <Link
                    href={`courses/${course._id}`}
                    className="text-blue-400 hover:underline mt-2 inline-block"
                  >
                    View Details
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No courses available.</p>
          )}
        </div>
      </div>
    </Layout>
  );

}