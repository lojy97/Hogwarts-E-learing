'use client';

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { course, user } from "@/app/_lib/page";
import LayoutHome from './components/LayoutHome';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function InstructorHome() {
  const [myCourses, setMyCourses] = useState<course[]>([]);
  const [filterText, setFilterText] = useState<string>("");
  const router = useRouter();
    const [courses, setCourses] = useState<course[]>([]);
  

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await axiosInstance.get<user>("/users/currentUser");
        const instructorCourses = await Promise.all(
          response.data.courses.map(async (courseId: string) => {
            const courseResponse = await axiosInstance.get<course>(`/course/${courseId}`);
            return courseResponse.data;
          })
        );
        setMyCourses(instructorCourses);
      } catch (error) {
        console.error("Error fetching instructor courses:", error);
      }
    };
    fetchMyCourses();
  }, []);

  const filteredCourses = myCourses.filter((course) =>
    course.title?.toLowerCase().includes(filterText.toLowerCase()) ||
    course.keywords?.some((keyword) => keyword.toLowerCase().includes(filterText.toLowerCase()))
  );

  const handleViewCourse = (courseId: string) => {
    router.push(`/instructor/courses/${courseId}`);
  };

  const handleMarkAsOutdated = async (courseId: string) => {
    try {
      await axiosInstance.put(`/course/${courseId}`, { isOutdated: true });
      setCourses(courses.map(course => {
        if (course._id.toString() === courseId) {
          return { ...course, isOutdated: true };
        }
        return course;
      }));
    } catch (error) {
      console.error("Error marking course as outdated", error);
    }
  };

  const handleMarkAsNotOutdated = async (courseId: string) => {
    try {
      await axiosInstance.put(`/course/${courseId}`, { isOutdated: false });
      setCourses(courses.map(course => {
        if (course._id.toString() === courseId) {
          return { ...course, isOutdated: false };
        }
        return course;
      }));
    } catch (error) {
      console.error("Error marking course as not outdated", error);
    }
  };

  return (
    <LayoutHome>
      <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
        <h1 className="text-3xl font-bold text-white mb-8">My Courses</h1>
        <div className="w-full max-w-4xl mb-6">
          <input
            type="text"
            placeholder="Search by course name, or keywords..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#202020] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full max-w-4xl">
          {filteredCourses.length > 0 ? (
            <ul className="space-y-4">
              {filteredCourses.map((course, index) =>
                course.isAvailable ? (
                  <li key={index} className="p-4 bg-gray-800 rounded-lg text-white shadow-md">
                    <h2 className="text-xl font-semibold">{course.title}</h2>
                    <p className="text-gray-400">{course.description}</p>
                    <p className="text-gray-400 font-semibold">Rating: {course.averageRating}</p>
                    <p className="text-gray-400 font-semibold">Keywords: {course.keywords.join(", ")}</p>
                    {/* Add a button to view detailed course info */}
                    <Link
                    href={`courses/${course._id}`}
                    className="text-blue-400 hover:underline mt-2 inline-block"
                  >
                    View Details
                  </Link>
                  {course.isOutdated ? (
                      <button
                        onClick={() => handleMarkAsNotOutdated(course._id.toString())}
                        className="py-1 px-3 bg-green-600 hover:bg-green-700 text-white rounded-md"
                      >
                        Mark as Not Outdated
                      </button>
                    ) : (
                      <button
                        onClick={() => handleMarkAsOutdated(course._id.toString())}
                        className="py-1 px-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md"
                      >
                        Mark as Outdated
                      </button>
                    )}
                  </li>
                ) : null
              )}
            </ul>
          ) : (
            <p className="text-gray-400">No courses available.</p>
          )}
        </div>
      </div>
    </LayoutHome>
  );
}
