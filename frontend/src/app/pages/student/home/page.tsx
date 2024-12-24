"use client";
import { useEffect, useState } from "react";
import HomeLayout from './components/homelayout';

import axiosInstance from "@/app/utils/axiosInstance";
import Link from "next/link";
import { course } from "@/app/_lib/page";
import axios from "axios";

export default function HomePage() {
  const [courses, setCourses] = useState<course[]>([]);
  const [recommendations, setRecommendations] = useState<course[]>([]);
  const [user, setUser] = useState<any>(null); // Store user data
  const [selectedCourse, setSelectedCourse] = useState<course | null>(null); // State for selected course

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        // Fetch the current user
        const response = await axiosInstance.get<any>("/users/currentUser");
        setUser(response.data);

        // Fetch courses based on the user's enrolled courses
        const courseDetails = await Promise.all(
          response.data.courses.map(async (courseId: string) => {
            const courseResponse = await axiosInstance.get<course>(`/course/${courseId}`);
            return courseResponse.data;
          })
        );
        setCourses(courseDetails);
      } catch (error) {
        console.error("Cannot view courses of user", error);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await axiosInstance.post<course[]>("/recommendations", {
          num_recommendations: 5,
        });

        if (response.data && Array.isArray(response.data)) {
          setRecommendations(response.data);
        } else {
          console.warn("Unexpected recommendations response:", response.data);
          setRecommendations([]);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching recommendations:", error.response?.data || error.message);
        } else {
          console.error("Error fetching recommendations:", error);
        }
        setRecommendations([]); // Fallback to an empty state
      }
    };

    fetchMyCourses();
    fetchRecommendations();
  }, []);

  const handleViewDetails = (course: course) => {
    setSelectedCourse(course); // Set the selected course when "View Details" is clicked
  };

  return (
    <HomeLayout>
      <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Home</h1>

        {/* Enrolled Courses Section */}
        <div className="w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Your Courses</h2>
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) =>
                course._id ? (
                  <div
                    key={course._id.toString()}
                    className="bg-[#202020] p-6 rounded-lg shadow-lg text-white cursor-pointer"
                  >
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-400 mb-2">{course.description}</p>
                    <p className="text-sm text-gray-500">Category: {course.category}</p>
                    <Link
                href={`/pages/student/courses/${course._id}`}
                className="text-blue-400 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-gray-400">You are not enrolled in any courses.</p>
          )}
        </div>

        {/* Recommendations Section */}
        <div className="w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Recommended for You</h2>
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.map((recommendation) =>
                recommendation._id ? (
                  <div
                    key={recommendation._id.toString()}
                    className="bg-[#202020] p-6 rounded-lg shadow-lg text-white cursor-pointer"
                  >
                    <h3 className="text-xl font-bold mb-2">{recommendation.title}</h3>
                    <p className="text-gray-400 mb-2">{recommendation.description}</p>
                    <p className="text-sm text-gray-500">Category: {recommendation.category}</p>
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-gray-400">No recommendations available at the moment.</p>
          )}
        </div>

        {/* Display course details if a course is selected */}
        {selectedCourse && (
          <div className="w-full max-w-4xl mt-8 bg-gray-800 p-6 rounded-lg text-white shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Course Details</h2>
            <p className="text-gray-400">{selectedCourse.description}</p>
            <p className="text-gray-400 font-semibold">Category: {selectedCourse.category}</p>
            <p className="text-gray-400 font-semibold">Rating: {selectedCourse.averageRating}</p>
            <p className="text-gray-400 font-semibold">Keywords: {selectedCourse.keywords.join(', ')}</p>
            <p className="text-gray-400 mt-4">{selectedCourse.description}</p>
          </div>
        )}
      </div>
    </HomeLayout>
  );
}
