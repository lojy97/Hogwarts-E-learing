"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from "../../../../../utils/axiosInstance";
import Layout from "../../../components/layout";

interface Forum {
  _id: string;
  title: string;
  description: string;
  course: string;
}

interface Thread {
  _id: string;
  title: string;
  content: string;
  forum: string;
}

export default function ForumDetails() {
  const [forum, setForum] = useState<Forum | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const router = useRouter();
  const { forumId } = useParams();

  useEffect(() => {
    const fetchForumDetails = async () => {
      try {
        const response = await axiosInstance.get<Forum>(`/forums/${forumId}`);
        setForum(response.data);
      } catch (error) {
        console.error("Error fetching forum details", error);
      }
    };

    const fetchThreads = async () => {
      try {
        const response = await axiosInstance.get<Thread[]>('/threads');
        const filteredThreads = response.data.filter(thread => thread.forum === forumId);
        setThreads(filteredThreads);
      } catch (error) {
        console.error("Error fetching threads", error);
      }
    };

    fetchForumDetails();
    fetchThreads();
  }, [forumId]);

  if (!forum) {
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
        <h1 className="text-3xl font-bold text-white mb-8">{forum.title}</h1>
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white">
          <p className="text-xl mb-4">{forum.description}</p>
        </div>
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white mt-8">
          <h2 className="text-2xl font-bold mb-4">Threads</h2>
          {threads.length > 0 ? (
            <ul className="mt-4 grid grid-cols-1 gap-2">
              {threads.map(thread => (
                <li
                  key={thread._id}
                  className="bg-[#353535] px-4 py-2 rounded-md text-gray-200 cursor-pointer"
                  onClick={() => router.push(`/pages/student/courses/${forum.course}/${forum._id}/${thread._id}`)}
                >
                  <p className="text-xs uppercase tracking-wide text-gray-400">Title</p>
                  <p className="font-medium text-base">{thread.title}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-400">Content</p>
                  <p className="font-medium text-base">{thread.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No threads available for this forum.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}