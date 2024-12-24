"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "./components/navbar";
import { instructor, course } from "@/app/_lib/page";

const HomePage: React.FC = () => {
  const [courses, setCourses] = useState<course[]>([]);
  const [instructors, setInstructors] = useState<instructor[]>([]);
  const [courseFilterText, setCourseFilterText] = useState<string>(""); // Separate filter for courses
  const [instructorFilterText, setInstructorFilterText] = useState<string>(""); // Separate filter for instructors

  useEffect(() => {
    // Fetch courses
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get<course[]>("/course");
        const validCourses = response.data.filter((course) => !course.isOutdated); // Filter out outdated courses
        setCourses(validCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    // Fetch instructors
    const fetchInstructors = async () => {
      try {
        const response = await axiosInstance.get<instructor[]>("/users");
        const instructorUsers = response.data.filter((user) => user.role === "instructor");
        setInstructors(instructorUsers);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    };

    fetchCourses();
    fetchInstructors();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(courseFilterText.toLowerCase()) ||
      course.category.toLowerCase().includes(courseFilterText.toLowerCase()) ||
      course.difficultyLevel.toLowerCase().includes(courseFilterText.toLowerCase())
  );

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(instructorFilterText.toLowerCase()) ||
      instructor.email.toLowerCase().includes(instructorFilterText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl bg-[#202020] p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">Welcome to Hogwarts Elearn</h1>

          {/* Courses Section */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold text-white">Courses</h2>

            {/* Course Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search courses by name, category, or difficulty"
                value={courseFilterText}
                onChange={(e) => setCourseFilterText(e.target.value)}
                className="p-2 rounded-md bg-gray-800 text-white w-full"
              />
            </div>

            {/* Course List */}
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <li key={course._id.toString()} className="bg-[#353535] p-4 rounded-lg text-gray-300">
                    <h3 className="text-lg font-bold text-white">{course.title}</h3>
                    <p className="text-sm text-gray-400">{course.description}</p>
                    <p className="text-sm text-gray-400">Category: {course.category}</p>
                    <p className="text-sm text-gray-400">Difficulty: {course.difficultyLevel}</p>
                  </li>
                ))
              ) : (
                <p className="text-gray-400">No courses match your search criteria.</p>
              )}
            </ul>
          </section>

          {/* Instructors Section */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-white">Instructors</h2>

            {/* Instructor Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search instructors by name or email"
                value={instructorFilterText}
                onChange={(e) => setInstructorFilterText(e.target.value)}
                className="p-2 rounded-md bg-gray-800 text-white w-full"
              />
            </div>

            {/* Instructor List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstructors.length > 0 ? (
                filteredInstructors.map((instructor) => (
                  <div
                    key={instructor._id.toString()}
                    className="bg-[#353535] p-4 rounded-lg text-gray-300"
                  >
                    <h3 className="text-lg font-bold text-white">{instructor.name}</h3>
                    <p className="text-sm text-gray-400">{instructor.email}</p>
                    {instructor.avgRating && (
                      <p className="text-sm text-gray-400">Avg Rating: {instructor.avgRating.toFixed(1)}</p>
                    )}
                    <p className="text-sm text-gray-400">Courses: {instructor.courses.length}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No instructors match your search criteria.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
