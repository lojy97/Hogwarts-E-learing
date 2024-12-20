"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from "../../../../utils/axiosInstance";
import Layout from "../../components/layout";
import { course } from "@/app/_lib/page";

interface Forum {
  _id: string;
  title: string;
  description: string;
  course: string;
}

export default function CourseDetails() {
  const [course, setCourse] = useState<course | null>(null);
  const [forums, setForums] = useState<Forum[]>([]);
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

    const fetchForums = async () => {
      try {
        const response = await axiosInstance.get<Forum[]>('/forums');

        const filteredForums = response.data.filter(forum => forum.course === courseId);
        setForums(filteredForums);
      } catch (error) {
        console.error("Error fetching forums", error);
      }
    };

    fetchCourseDetails();
    fetchForums();
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
          <button
            onClick={handleEnroll}
            className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md"
          >
            Enroll
          </button>
        </div>
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white mt-8">
          <h2 className="text-2xl font-bold mb-4">Forums</h2>
          {forums.length > 0 ? (
            <section className="mt-8">
              <ul className="mt-4 grid grid-cols-1 gap-2">
                {forums.map(forum => (
                  <li
                    key={forum._id}
                    className="bg-[#353535] px-4 py-2 rounded-md text-gray-200 cursor-pointer"
                    onClick={() => router.push(`/pages/student/courses/${courseId}/${forum._id}`)}
                  >
                    <p className="text-xs uppercase tracking-wide text-gray-400">Title</p>
                    <p className="font-medium text-base">{forum.title}</p>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Description</p>
                    <p className="font-medium text-base">{forum.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <p className="text-gray-400">No forums available for this course.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}