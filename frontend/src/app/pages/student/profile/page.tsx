"use client";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import axios from "axios";
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Optimized image component from Next.js
import Layout from '../components/layout';
import { course } from "@/app/_lib/page";


interface User {
  name: string;
  email: string;
  role: string;
  profilePictureUrl?: string;
  courses: string[];
  emailVerified: boolean;
  ratingsc?: number;
  avgRating?: number;
}



export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<course[]>([]);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState(user?.name || "");
  const [updatedProfilePictureUrl, setUpdatedProfilePictureUrl] = useState(user?.profilePictureUrl || "");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get<User>('/users/currentUser');
        setUser(response.data);

        // Fetch course details for each course ID
        const courseDetails = await Promise.all(
          response.data.courses.map(async (courseId) => {
            const courseResponse = await axiosInstance.get<course>(`/course/${courseId}`);
            return courseResponse.data;
          })
        );
        setCourses(courseDetails);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
          alert("User isn't logged in. Redirecting to login page.");
          router.push('/pages/auth/login');
        } else {
          console.error("Error fetching user data", error);
        }
      }
    };
    fetchUser();
  }, [router]);

  const handleUpdateProfile = async () => {
    try {
      const updatedData = {
        name: updatedName,
        profilePictureUrl: updatedProfilePictureUrl,
      };

      await axiosInstance.put('/users/currentUser', updatedData);
      alert("Profile updated successfully.");
      setIsEditing(false);
      setUser((prevUser) => prevUser ? { ...prevUser, ...updatedData } : null);
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmation) return;

    try {
      await axiosInstance.delete('/users');
      alert("Account deleted successfully. Redirecting to homepage.");
      router.push('/'); // Redirect to homepage or login page after deletion
    } catch (error) {
      console.error("Error deleting account", error);
      alert("Failed to delete account. Please try again.");
    }
  };


  if (!user) {
    return <p className="text-gray-400">Loading...</p>;
  }

  return (
    <Layout>
      <main className="min-h-screen bg-[#121212] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl bg-[#202020] p-8 shadow-lg">
          <h1 className="mb-6 text-center text-3xl font-bold text-white">Profile</h1>

          <section className="flex items-center gap-4">
            {user.profilePictureUrl && (
              <Image
                src={user.profilePictureUrl}
                alt={`${user.name}'s Profile Picture`}
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-400 text-lg">{user.email}</p>
            </div>
          </section>

          <section className="mt-8 grid grid-cols-2 gap-4 text-gray-300">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-400">Role</p>
              <p className="font-medium text-lg">{user.role}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-400">Email Verified</p>
              <p className="font-medium text-lg">{user.emailVerified ? 'Yes' : 'No'}</p>

            </div>
            {user.ratingsc ? (
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-400">Rating Score</p>
                <p className="font-medium text-lg">{user.ratingsc}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-400">Rating Score</p>
                <p className="font-medium text-lg">Unrated</p>
              </div>
            )}
            {user.avgRating ? (
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-400">Average Rating</p>
                <p className="font-medium text-lg">{user.avgRating}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-400">Average Rating</p>
                <p className="font-medium text-lg">Unrated</p>
              </div>
            )}

            <section className="mt-8">
              <h3 className="text-xl font-semibold text-white">
                {isEditing ? "Editing Profile" : "Edit Personal Information"}
              </h3>
              {isEditing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateProfile();
                  }}
                  className="mt-4 grid gap-4"
                >
                  <div>
                    <label htmlFor="updatedName" className="block text-gray-400">Name</label>
                    <input
                      type="text"
                      id="updatedName"
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-800 text-white"
                      required
                    />
                  </div>


                  <div>
                    <label htmlFor="updatedProfilePictureUrl" className="block text-gray-400">Profile Picture URL</label>
                    <input
                      type="text"
                      id="updatedProfilePictureUrl"
                      value={updatedProfilePictureUrl}
                      onChange={(e) => setUpdatedProfilePictureUrl(e.target.value)}
                      className="w-full p-2 rounded-md bg-gray-800 text-white"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Edit Profile
                </button>
              )}
            </section>
            <section className="mt-8">
              <button
                onClick={handleDeleteAccount}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete Account
              </button>
            </section>
          </section>

          {courses.length > 0 && (
            <section className="mt-8">
              <h3 className="text-xl font-semibold text-white">Courses</h3>
              <ul className="mt-4 grid grid-cols-1 gap-2">
                {courses.map((course) => course.isAvailable && (
                  <li key={course._id.toString()} className="bg-[#353535] px-4 py-2 rounded-md text-gray-200">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Course Title</p>
                    <p className="font-medium text-base">{course.title}</p>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Course ID</p>
                    <p className="font-medium text-base">{course._id.toString()}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </Layout>
  );
}