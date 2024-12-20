"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from "@/app/utils/axiosInstance";
import Layout from "../../../components/layout";
import { course } from "@/app/_lib/page";
import { ObjectId } from "mongoose";
import { module } from "@/app/_lib/page";


export default function CourseDetails() {
  const [course, setCourse] = useState<course | null>(null);
  const router = useRouter();
  const { courseId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [courseName, setName] = useState<string>("");
  const [courseDescription, setDescription] = useState<string>("");
  const [courseDl, setDl] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [courseKeywords, setKeywords] = useState<string>("");
  const [isOutdated, setOutdated] = useState(false);
  const [modules, setModules] = useState<module[]>([]);
  
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axiosInstance.get<course>(`/course/${courseId}`);
        setCourse(response.data);
        setName(response.data.title);
        setDescription(response.data.description);
        setDl(response.data.difficultyLevel);
        setCategory(response.data.category);
        setKeywords(response.data.keywords.join(", "));
        setOutdated(response.data.isOutdated);
      } catch (error) {
        console.error("Error fetching course details", error);
      }
      const fetchModules = async () => {
        try {
          const moduleIds = course?.modules || []; // Assuming `course` contains a list of module IDs
          const modulesData = await Promise.all(
            moduleIds.map(async (moduleId) => {
              const response = await axiosInstance.get<module>(`/module/${moduleId}`);
              return response.data;
            })
          );
          setModules(modulesData);
        } catch (error) {
          console.error("Error fetching modules", error);
        }
      };
      
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleDeleteCourse = async (courseId: ObjectId) => {
    try {
      await axiosInstance.delete(`/course/${courseId}`);
      alert("Course deleted successfully.");
      router.push("/pages/instructor/courses");
    } catch (error) {
      console.error("Error deleting course", error);
      alert("Failed to delete course. Please try again later.");
    }
  };

  const handleUpdateCourse = async () => {
    try {
      const updatedCourse = {
        title: courseName,
        description: courseDescription,
        category: category,
        difficultyLevel: courseDl,
        createdAt: course?.createdAt,
        isOutdated: isOutdated,
        keywords: courseKeywords
          .split(",")
          .map((keyword) => keyword.trim())
          .filter((keyword) => keyword.length > 0),
      };

      await axiosInstance.put(`/course/${course?._id}`, updatedCourse);
      alert("Course updated successfully.");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating course", error);
      alert("Failed to update course. Please try again later.");
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
              onClick={() => setShowModal(true)}
              className="text-blue-500 hover:text-blue-700"
            >
              Update course info
            </button>
            <button
              onClick={() => handleDeleteCourse(course._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-4">Update Course</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateCourse();
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="courseName" className="block text-gray-400">
                    Course Name
                  </label>
                  <input
                    type="text"
                    id="courseName"
                    value={courseName}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="courseDescription" className="block text-gray-400">
                    Description
                  </label>
                  <textarea
                    id="courseDescription"
                    value={courseDescription}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="courseDl" className="block text-gray-400">
                    Difficulty Level
                  </label>
                  <select
                    id="courseDl"
                    value={courseDl}
                    onChange={(e) => setDl(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white"
                    required
                  >
                    <option value="">Select Difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className="block text-gray-400">
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="keywords" className="block text-gray-400">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="keywords"
                    value={courseKeywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="isOutdated" className="block text-gray-400">
                    Mark as Outdated
                  </label>
                  <input
                    type="checkbox"
                    id="isOutdated"
                    checked={isOutdated}
                    onChange={(e) => setOutdated(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded-md bg-gray-800"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
