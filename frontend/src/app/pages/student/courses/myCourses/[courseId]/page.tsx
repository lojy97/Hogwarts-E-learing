"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";
import Layout from "@/app/components/layout";
import { course } from "@/app/_lib/page";
import { ObjectId } from "mongoose";

export default function CourseDetails() {
  const [course, setCourse] = useState<course | null>(null);
  const router = useRouter();
  const { courseId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [courseName, setname] = useState<string>("");
  const [courseDescription, setDescription] = useState<string>("");
  const [courseDl, setDl] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [courseKeywords, setKeywords] = useState<string>("");
  const [isOutdated, setOutdated] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get<course>(`/course/${courseId}`);
        setCourse(response.data);
        setname(response.data.title);
        setDescription(response.data.description);
        setDl(response.data.difficultyLevel);
        setCategory(response.data.category);
        setKeywords(response.data.keywords.join(", "));
        setOutdated(response.data.isOutdated);
      } catch (error) {
        console.error("Error fetching course details", error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleLeaveCourse = async () => {
    try {
      // Fetch the current user's data
      const userResponse = await axiosInstance.get('/users/currentUser');
      const user = userResponse.data;

     
      const updatedCourses =user.courses.filter((id:object) => id !== courseId);
      
      // Send the updated data back to the server
      const response = await axiosInstance.put('/users/currentUser', { courses: updatedCourses });
     
      if (response.status === 200) {
        alert('left successfully!');
      }
    } catch (error) {
      console.error("Error leaving  course", error);
      alert('Failed to leave the course.');
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
          <div className="flex justify-between items-center mt-4">
           
            <button
              onClick={() => handleLeaveCourse()}
              className="text-red-500 hover:text-red-700"
            >
              leave
            </button>
          </div>
        </div>

       
      </div>
    </Layout>
  );
}
