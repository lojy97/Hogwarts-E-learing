"use client";
import {course} from  "@/app/_lib/page";
import {instructor} from "@/app/_lib/page";
import { user } from "@/app/_lib/page";
import {useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Link from "next/link";
import axiosInstance from "../../../../utils/axiosInstance";



export default function Courses(){

    const [myCourses,setmyCourses]=useState<course[]>([]);
     const [user, setUser] = useState<user | null>(null);
     const router=useRouter();

 useEffect(()=>{
            const fetshMyCourses=async()=>{
    try {
      const response = await axiosInstance.get<user>('/users/currentUser');
      setUser(response.data);
  
      const courseDetails = await Promise.all(
        response.data.courses.map(async (courseId: string) => {
          const courseResponse = await axiosInstance.get<course>(`/course/${courseId}`);
          return courseResponse.data;
        })
      );
      setmyCourses(courseDetails);
  
  }catch(error){
    console.error(error,"cannot view courses of user")
  }
}
fetshMyCourses();
},[]);
return(
    <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
    <h1 className="text-3xl font-bold text-white mb-8">Courses</h1>
    <div className="w-full max-w-4xl">
      {myCourses.length > 0 ? (
        <ul className="space-y-4">
          {myCourses.map((course:course, index) => (course.isAvailable && (
            <li
              key={index}
              className="p-4 bg-gray-800 rounded-lg text-white shadow-md"
            >
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-400">{course.description}</p>
              <p className="text-gray-400 font-semibold">Rating:{course.averageRating}</p>
              <Link
                href={`/pages/instructor/courses/myCourses/${course._id}`}
                className="text-blue-400 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
            </li>
          )))}
        </ul>
      ) : (
        <p className="text-gray-400">No courses available.</p>
      )}
    </div>
    </div>
);
        
}