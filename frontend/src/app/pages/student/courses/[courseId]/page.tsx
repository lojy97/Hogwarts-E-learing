"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from "../../../../utils/axiosInstance";
import Layout from "../../components/layout";
import { course } from "@/app/_lib/page";
import Cookies from "js-cookie";


interface Forum {
  _id: string;
  title: string;
  description: string;
  course: string;
  moderator: string;
}

interface User {
  _id: string;
  name: string;
}


export default function CourseDetails() {
  const [course, setCourse] = useState<course | null>(null);
  const [bc, setbc] = useState<number>(0);
  const [forums, setForums] = useState<Forum[]>([]);
  const [moderatorNames, setModeratorNames] = useState<{ [key: string]: string }>({});
  const [newForumTitle, setNewForumTitle] = useState<string>("");
  const [newForumDescription, setNewForumDescription] = useState<string>("");
  const router = useRouter();
  const { courseId } = useParams();
  const [modules, setModules] = useState<module[]>([]);
    const [moduleTitle, setModuleTitle] = useState<string>('');
    const [moduleContent, setModuleContent] = useState<string>('');
    const [moduleDifficulty, setModuleDifficulty] = useState<string>('Beginner');
  const userId = Cookies.get("userId");



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

        // Fetch moderator names
        const moderatorNames = await Promise.all(
          filteredForums.map(async forum => {
            const moderatorResponse = await axiosInstance.get<User>(`/users/${forum.moderator}`);
            return { forumId: forum._id, name: moderatorResponse.data.name };
          })
        );

        const moderatorNamesMap = moderatorNames.reduce((acc, curr) => {
          acc[curr.forumId] = curr.name;
          return acc;
        }, {} as { [key: string]: string });

        setModeratorNames(moderatorNamesMap);
      } catch (error) {
        console.error("Error fetching forums", error);
      }
    };const fetchModules = async () => {
      try {
        const response = await axiosInstance.get<module[]>(`/modules/course/${courseId}`);
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching modules", error);
      }
    };

   
    fetchModules();

    fetchCourseDetails();
    fetchForums();
  }, [courseId]);

  const handleCreateForum = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/forums', {
        title: newForumTitle,
        description: newForumDescription,
        course: courseId,
      });
      setForums([...forums, response.data]);
      setNewForumTitle("");
      setNewForumDescription("");
    } catch (error) {
      console.error("Error creating forum", error);
    }
  };

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
      const oldgbc=course.BeginnerCount;
      const newbc=oldgbc+1;
      setbc(newbc);
      try {
        const updatedCourse = {
          BeginnerCount:newbc
        }; 
        const courseResponse=await axiosInstance.put(`/course/count/${courseId}`,updatedCourse);

        }catch(error){
          console.error("error incrementing count",error);
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

  const handleForumDelete = async (forumId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await axiosInstance.delete(`/forums/${forumId}`);
      if (response.status === 200) {
        const response = await axiosInstance.get<Forum[]>('/forums');
        const filteredForums = response.data.filter(forum => forum.course === courseId);
        setForums(filteredForums);
      }
    } catch (error) {
      console.error("Error deleting forum", error);
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
//merge
  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
        <h1 className="text-3xl font-bold text-white mb-8">{course.title}</h1>

        {/* Course Details */}
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white mb-8">
          <p className="text-xl mb-4">{course.description}</p>
          <p className="text-gray-400 mb-4">Category: {course.category}</p>
          <p className="text-gray-400 mb-4">Difficulty Level: {course.difficultyLevel}</p>
          <p className="text-gray-400 mb-4">Rating: {course.averageRating}</p>
          <p className="text-gray-400 mb-4">BeginnerCount: {bc}</p>
          <p className="text-gray-400 mb-4">
            Created At: {new Date(course.createdAt).toLocaleDateString()}
          </p>
          <p className="text-gray-400 mb-4">Is Outdated: {course.isOutdated ? 'Yes' : 'No'}</p>
          <button
            onClick={handleEnroll}
            className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md"
          >
            Enroll
          </button>
        </div>
        
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white">
  <h2 className="text-2xl font-bold mb-4">Modules</h2>
  {modules.length > 0 ? (
    <ul className="space-y-4">
      
      {modules.map((mod) => (
        
        <li key={mod._id} className="border-b border-gray-700 pb-4">
          
          <h3 className="text-xl font-semibold">{mod.title}</h3>
          <p className="text-gray-400">{mod.content}</p>
          <button
                                        onClick={() => router.push(`${courseId}/quiz?moduleId=${mod._id}`)}
      className="text-blue-500 hover:text-blue-700 mt-2"
    >  View Quiz
    </button> 
          <div className="mt-2">
            <h4 className="text-lg font-semibold text-gray-400">Resources:</h4>
            {mod.resources?.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {mod.resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 underline"
                      download
                    >
                      Download File {index + 1}
                    </a>
                  </li>
                  
                ))}
               
              </ul>
              
            ) : (
              <p className="text-gray-400">No resources available for download.</p>
            )}
          </div>
        </li>
      ))}
      
    </ul>

    
  ) : (
    <p className="text-gray-400">No modules available.</p>
  )}
  
</div>

        {/* Forums Section */}
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white">
          <h2 className="text-2xl font-bold mb-6">Forums</h2>
          <div className="flex gap-8">
            {/* Forum List */}
            <div className="w-2/3">
              {forums.length > 0 ? (
                <ul className="grid grid-cols-1 gap-4">
                  {forums.map((forum) => (
                    <li
                      key={forum._id}
                      className="bg-[#353535] px-4 py-3 rounded-md text-gray-200 cursor-pointer hover:bg-[#454545]"
                      onClick={() =>
                        router.push(`/pages/student/courses/${courseId}/${forum._id}`)
                      }
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-400">Title</p>
                      <p className="font-medium text-base">{forum.title}</p>
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        Moderator
                      </p>
                      <p className="font-medium text-base">{moderatorNames[forum._id]}</p>
                      {forum.moderator === userId && (
                        <button
                          onClick={(e) => handleForumDelete(forum._id, e)}
                          className="text-red-500 hover:underline mt-2"
                        >
                          Delete Forum
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No forums available for this course.</p>
              )}
            </div>

            {/* Create New Forum Form */}
            <div className="w-1/3">
              <section>
                <h3 className="text-xl font-semibold text-white mb-4">Create New Forum</h3>
                <form onSubmit={handleCreateForum} className="grid gap-4">
                  <div>
                    <label htmlFor="newForumTitle" className="block text-gray-400">
                      Title
                    </label>
                    <input
                      type="text"
                      id="newForumTitle"
                      value={newForumTitle}
                      onChange={(e) => setNewForumTitle(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-800 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="newForumDescription" className="block text-gray-400">
                      Description
                    </label>
                    <textarea
                      id="newForumDescription"
                      value={newForumDescription}
                      onChange={(e) => setNewForumDescription(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-800 text-white"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}