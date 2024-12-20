"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from 'next/navigation';
import axiosInstance from "../../../../../../utils/axiosInstance";
import Layout from "../../../../components/layout";

interface Reply {
  _id: string;
  content: string;
  thread: string;
  author: string;
  authorName?: string; // Optional field for author's name
}

interface Thread {
  _id: string;
  title: string;
  content: string;
  creator: string;
}

interface User {
  _id: string;
  name: string;
}

export default function ThreadDetails() {
  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [creatorName, setCreatorName] = useState<string>("");
  const router = useRouter();
  const { threadId, forumId } = useParams();

  useEffect(() => {
    const fetchThreadDetails = async () => {
      try {
        const response = await axiosInstance.get<Thread>(`/threads/${threadId}`);
        setThread(response.data);

        // Fetch creator name
        const creatorResponse = await axiosInstance.get<User>(`/users/${response.data.creator}`);
        setCreatorName(creatorResponse.data.name);

        // Fetch replies for the specific thread
        const repliesResponse = await axiosInstance.get<Reply[]>(`/replies/${threadId}`);
        const repliesWithAuthorNames = await Promise.all(
          repliesResponse.data.map(async reply => {
            const authorResponse = await axiosInstance.get(`/users/${reply.author}`);
            return { ...reply, authorName: authorResponse.data.name };
          })
        );
        setReplies(repliesWithAuthorNames);

        // Fetch moderator name
        const forumResponse = await axiosInstance.get<{ moderator: string }>(`/forums/${forumId}`);
      } catch (error) {
        console.error("Error fetching thread details", error);
      }
    };

    fetchThreadDetails();
  }, [threadId, forumId]);

  if (!thread) {
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
        <h1 className="text-3xl font-bold text-white mb-8">{thread.title}</h1>
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white">
          <p className="text-xl mb-4">{thread.content}</p>
          <p className="text-lg mb-4">Creator: {creatorName}</p>
        </div>
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white mt-8">
          <h2 className="text-2xl font-bold mb-4">Replies</h2>
          {replies.length > 0 ? (
            <ul className="mt-4 grid grid-cols-1 gap-4">
              {replies.map(reply => (
                <li key={reply._id} className="bg-[#353535] px-6 py-4 rounded-md text-gray-200">
                  <p className="text-sm text-gray-400 mb-2">Author: {reply.authorName || reply.author}</p>
                  <p className="text-base">{reply.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No replies available for this thread.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}