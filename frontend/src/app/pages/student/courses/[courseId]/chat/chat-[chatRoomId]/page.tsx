"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import axiosInstance from "../../../../../../utils/axiosInstance";
import Layout from "../../../../components/layout";
import Cookies from "js-cookie";

interface ChatRoom {
  _id: string;
  title: string;
  participants: string[];
  roomType: string;
  course: string;
  creator: string;
}

interface Message {
  _id: string;
  content: string;
  chatRoom: string;
  sender: string;
}

interface User {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  title: string;
}

export default function ChatRoomDetails() {
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [creatorName, setCreatorName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  const [participantNames, setParticipantNames] = useState<{
    [key: string]: string;
  }>({});
  const [isParticipant, setIsParticipant] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const userId = Cookies.get("userId");

  const [actualChatRoomId, setActualChatRoomId] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);

  // Extract IDs from URL
  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean); // Simplified filter
    const courseIdIndex = segments.indexOf("courses") + 1;
    const chatRoomIdIndex = segments.findIndex((s) => s.startsWith("chat-"));

    if (courseIdIndex > 0 && segments[courseIdIndex]) {
      setCourseId(segments[courseIdIndex]);
    }
    if (chatRoomIdIndex > -1) {
      setActualChatRoomId(segments[chatRoomIdIndex].slice(5)); // Extract after "chat-"
    }
  }, [pathname]);

  // Fetch chat room data, including participant names
  useEffect(() => {
    const fetchChatRoomData = async () => {
      if (!actualChatRoomId) return;

      try {
        const chatRoomResponse = await axiosInstance.get<ChatRoom>(
          `/chat-rooms/${actualChatRoomId}`
        );
        const chatRoomData = chatRoomResponse.data;
        setChatRoom(chatRoomData);

        const creatorResponse = await axiosInstance.get<User>(
          `/users/${chatRoomData.creator}`
        );
        setCreatorName(creatorResponse.data.name);

        if (courseId) {
          const courseResponse = await axiosInstance.get<Course>(
            `/course/${courseId}`
          ); // Fixed endpoint to `/courses/${courseId}`
          setCourseName(courseResponse.data.title);
        }
        


//hi

        const fetchParticipantDetails = async () => {  // Important: Make this an async function
          try {
            console.log("Fetching participant details for participants:", chatRoomData.participants);
            const participantResponses = await Promise.all(
              chatRoomData.participants.map(async (participantId) => {
                console.log("Fetching details for participantId:", participantId._id);
                const participantResponse = await axiosInstance.get<User>(`/users/${participantId._id}`);
                console.log(`Details fetched for participantId ${participantId._id}:`, participantResponse);
                console.log("Participant name:", participantResponse.data.name);
                return { id: participantResponse.data._id, name: participantResponse.data.name };
              })
            );
      
            const newParticipantNames = participantResponses.reduce((acc, { id, name }) => {
              acc[id] = name;
              return acc;
            }, {} as { [key: string]: string });
      
            // Set the state with the new data!
            setParticipantNames(newParticipantNames);
      
            console.log("Participant names map SET:", newParticipantNames); // Log after setting the state

            setParticipantNames(newParticipantNames);
            setIsParticipant(userId ? chatRoomData.participants.some(p => p._id === userId) : false);
        
            console.log("Participant names SET:", newParticipantNames);
            console.log("isParticipant SET:", userId ? chatRoomData.participants.some(p => p._id === userId) : false)
      
          } catch (error) {
            console.error("Error fetching participant details:", error);
            // Handle the error (e.g., display an error message)
          }
        };

        await fetchParticipantDetails(); // Make sure to await it

        


      } catch (error) {
        console.error("Error fetching chat room data:", error);
      }
    };

    const fetchMessages = async () => {
      if (!actualChatRoomId) return;
      try {
        const response = await axiosInstance.get<Message[]>(
          `chatmessage/message/${actualChatRoomId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };


    if (actualChatRoomId) {
      fetchChatRoomData();
      fetchMessages();
      
    }
  }, [actualChatRoomId, courseId, userId]); // userId added to dependency array

  useEffect(() => {
    console.log("Participant names:", participantNames); // Log the state
}, [participantNames]); // Log whenever the state changes

  const handleCreateMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualChatRoomId) return;
    try {
      const response = await axiosInstance.post<Message>("/chatmessage/message", {
        content: newMessageContent,
        chatRoomId: actualChatRoomId,
      });

      setMessages([...messages, response.data]);
      setNewMessageContent("");
    } catch (error) {
      console.error("Error creating message", error);
    }
  };

  const handleMessageDelete = async (
    messageId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const response = await axiosInstance.delete(`/chatmessage/message/${messageId}`);
      if (response.status === 200) {
        setMessages(messages.filter((message) => message._id !== messageId));
      }
    } catch (error) {
      console.error("Error deleting message", error);
    }
  };

  if (!chatRoom) {
    return (
      <Layout>
        <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
          <p className="text-gray-400">chatrooms Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
        <h1 className="text-3xl font-bold text-white mb-8">{chatRoom.title}</h1>
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white">
          <p className="text-xl mb-4">Room Type: {chatRoom.roomType}</p>
          <p className="text-lg mb-4">Course: {courseName}</p>
          <p className="text-lg mb-4">Creator: {creatorName}</p>
          <p className="text-lg mb-4">Participants:</p>
          <ul>
            {Object.keys(participantNames).map((id) => {
              console.log("Mapping ID:", id, "Name:", participantNames[id]); // Log inside map
              return (
                <li key={id}>
                  {participantNames[id] || "Loading..."}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Messages Section */}
        <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white mt-8">
          <h2 className="text-2xl font-bold mb-4">Messages</h2>
          <div className="flex gap-8">
            {/* Messages List (2/3 width) */}
            <div className="w-2/3">
              {messages.length > 0 ? (
                <ul className="grid grid-cols-1 gap-4">
                  {messages.map((message) => (
                    <li
                      key={message._id}
                      className="bg-[#353535] px-4 py-3 rounded-md text-gray-200 cursor-pointer hover:bg-[#454545]"

                    >
                      <p className="text-xs uppercase tracking-wide text-gray-400">Content</p>
                      <p className="font-medium text-base">{message.content}</p>
                      {message.sender === userId && (
                        <button
                          onClick={(e) => handleMessageDelete(message._id, e)}
                          className="text-red-500 hover:underline mt-2"
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No messages available for this chat room.</p>
              )}
            </div>

            {/* Create New Message Form (1/3 width) */}
            {isParticipant && (
              <div className="w-1/3">
                <section>
                  <h3 className="text-xl font-semibold text-white mb-4">Create New Message</h3>
                  <form onSubmit={handleCreateMessage} className="grid gap-4">
                    <div>
                      <label htmlFor="newMessageContent" className="block text-gray-400">
                        Content
                      </label>
                      <input
                        type="text"
                        id="newMessageContent"
                        value={newMessageContent}
                        onChange={(e) => setNewMessageContent(e.target.value)}
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
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}