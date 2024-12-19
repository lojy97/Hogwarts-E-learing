"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from "../../../../utils/axiosInstance";
import Layout from "../../components/layout";
import { course } from "@/app/_lib/page";

export default function CourseDetails() {
  const [course, setCourse] = useState<course | null>(null);
  const router = useRouter();
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get<course>(`/course/${courseId}`);
        console.log(response.data);
        setCourse(response.data);
        
      } catch (error) {
        
        console.error("Error fetching course details", error);
      }
    };
    fetchCourseDetails();
  }, [courseId]);

  
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