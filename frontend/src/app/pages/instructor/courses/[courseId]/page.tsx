"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from "../../../../utils/axiosInstance";
import Layout from "@/app/components/layout";
import { course } from "@/app/_lib/page";

export default function CourseDetails() {
  const [course, setCourse] = useState<course | null>(null);
  const router = useRouter();
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get<course>(`/course/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course details", error);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      // Fetch the current user's data
      const userResponse = await axiosInstance.get('/users/currentUser');
      const user = userResponse.data;

      // Check if the user is already enrolled in the course
      if (user.courses.includes(courseId)) {
        alert('You are already enrolled in this course.');
        return;
      }

      // Update the courses array
      const updatedCourses = [...user.courses, courseId];

      // Send the updated data back to the server
      const response = await axiosInstance.put('/users/currentUser', { courses: updatedCourses });
      console.log("Enroll response data:", response.data);
      if (response.status === 200) {
        alert('Enrolled successfully!');
      }
    } catch (error) {
      console.error("Error enrolling in course", error);
      alert('Failed to enroll in course.');
    }
  };

  if (!course) {
    return (
      <Layout>
        <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
          <p className="text-gray-400">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
        <h1 className="text-3xl font-bold text-white mb-8">{course.title}</h1>
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white">
          <p className="text-xl mb-4">{course.description}</p>
          <p className="text-gray-400 mb-4">Category: {course.category}</p>
          <p className="text-gray-400 mb-4">Difficulty Level: {course.difficultyLevel}</p>
          <p className="text-gray-400 mb-4">Rating: {course.averageRating}</p>
          <p className="text-gray-400 mb-4">Created At: {new Date(course.createdAt).toLocaleDateString()}</p>
          <p className="text-gray-400 mb-4">Is Outdated: {course.isOutdated ? 'Yes' : 'No'}</p>
         
        </div>
      </div>
    </Layout>
  );
}