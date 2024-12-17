"use client";
import {course} from  "@/app/_lib/page";
import {instructor} from "@/app/_lib/page";
import { user } from "@/app/_lib/page";
import {useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import axiosInstance from "../../../utils/axiosInstance";

export default function Courses(){
const [Courses,setCourses]=useState<course[]>([]);
const [myCourses,setmyCourses]=useState<course[]>([]);
 const [user, setUser] = useState<user | null>(null);
 const[courseName,setname]=useState<String>("");
 const[courseDescription,setDescription]=useState<string>("");
 const[courseDl,setDl]=useState<string>("");
 const[category,setCategory]=useState<string>("");
 const[courseKeywords,setKeywords]=useState<string>("");
 const [showModal, setShowModal] = useState(false); // To toggle modal visibility

const router=useRouter();



useEffect(()=>{
  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get<user>('/users/currentUser');
      setUser(response.data);
    }catch(error){
      console.error("error fetching user",error);
    }
  };
 fetchUser();

    const fetchCourses=async()=>{
        try{
            
            const response =await axiosInstance.get<course[]>(`/course`);

            setCourses(response.data);
        }catch(error){
            console.error("error fetching courses",error);
        }
    };
    fetchCourses();


   
  
},[]);


const createAcourse=async()=>{
  try{
    const newCourse={
      title: courseName,
      description: courseDescription,
      category: category,
      difficultyLevel: courseDl,
      createdBy: user?._id, 
      createdAt: new Date(),
      isOutdated: false,
      ratingCount: 0,
      averageRating: 0,
      BeginnerCount: 0,
      IntermediateCount: 0,
      AdvancedCount: 0,
      keywords: courseKeywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0), // Ensure valid strings only
    };
    const response=await axiosInstance.post("/course",newCourse);
    console.log("Course created:", response.data);
   // setCourses((prevCourses) => [...prevCourses, response.data]);
   setShowModal(false);

   // Clear input fields
   setname("");
   setDescription("");
   setDl("");
   setCategory("");
   setKeywords("");
    }
  catch(error){
    console.error(error,"error creating course");
  }
  
}


return (
    <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
      <h1 className="text-3xl font-bold text-white mb-8">Courses</h1>
      <div className="w-full max-w-4xl">
        {Courses.length > 0 ? (
          <ul className="space-y-4">
            {Courses.map((course:course, index) => (
              <li
                key={index}
                className="p-4 bg-gray-800 rounded-lg text-white shadow-md"
              >
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="text-gray-400">{course.description}</p>
                <p className="text-gray-400 font-semibold">Rating:{course.averageRating}</p>
                <Link
                  href={`/pages/instructor/courses/${course._id}`}
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
        {/* Add Course Button */}
        <button
        onClick={() => setShowModal(true)}
        className="mt-8 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md"
      >
        Add a New Course
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">Create Course</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createAcourse();
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
                  onChange={(e) => setname(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-800 text-white"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="courseDescription"
                  className="block text-gray-400"
                >
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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

}