"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import Layout from "@/app/components/layout";
import { quiz, question, module ,response,user} from "@/app/_lib/page";
import mongoose from "mongoose";

export default function QuizPage() {
  const { courseId } = useParams(); // courseId is from the URL path
  const searchParams = useSearchParams(); // useSearchParams to get query parameters
  const moduleId = searchParams.get("moduleId"); // Extract moduleId from query parameters

  const [quiz, setQuiz] = useState<quiz | null>(null);
  const [responses, setResponse] = useState<response | null>(null);
  const [questions, setQuestions] = useState<question[]>([]); // For quiz questions
  const [module, setModule] = useState<module | null>(null);
  const [isLoading, setIsLoading] = useState(false);
 const [user, setUser] = useState<user | null>(null);
 const [isQuizCreated, setIsQuizCreated] = useState(false);
 const [responseState, setResponseState] = useState<response | null>(null);
 useEffect(() => {

  const fetchUser = async () => {
    try {
      const moduleRes = await axiosInstance.get<module>(`/modules/${moduleId}`);
      setModule(moduleRes.data);
      setIsLoading(true);
      const userResponse = await axiosInstance.get<user>("/users/currentUser");
      setUser(userResponse.data);

      
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUser();
}, []);

useEffect(() => {
  
const createQuiz = async () => {
  if (!moduleId || !user?._id) return; // Ensure moduleId and user ID are available

  try {
    setIsLoading(true);
    const newQuiz = {
      Module_id: moduleId,
      created_at: new Date(),
      user_id: user._id,
    };

    const response = await axiosInstance.post<quiz>("/quizzes", newQuiz);
    const createdQuiz = response.data;

    setQuiz(createdQuiz);
    setQuestions(createdQuiz.quizQuestions || []);
  } catch (error) {
    console.error("Error creating quiz:", error);
  } finally {
    setIsLoading(false);
  }
};

  const fetchQuiz = async () => {
    if (!moduleId || !user?._id) return; // Ensure moduleId and user ID are available

    try {
      setIsLoading(true);
      const response = await axiosInstance.get<quiz>(
        `/quizzes/by-module-and-user?moduleId=${moduleId}&userId=${user._id}`
      );
      const q=response.data;
      console.log("responseQ",q.quizQuestions);


      if (response.data) {
        setQuiz(response.data);
        setQuestions(response.data.quizQuestions);
        console.log("response",response.data);
        console.log("responseQ1",q.quizQuestions);
        console.log("quesstions",questions);
        console.log("quiz",quiz);
      } else {
        createQuiz(); // Call createQuiz if no quiz exists
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchQuiz();
}, [ moduleId, user?._id]);


useEffect(() => {

  const fetchResponse = async () => {
    try {
          // Check for existing response
          const responseRes = await axiosInstance.get<response>(
            `/responses/by-quiz-and-user?quizId=${quiz?._id}&userId=${user?._id}`
          );

          if (responseRes.data) {
            setResponseState(responseRes.data);
          } else {
            // Create a new response if none exists
            const newResponse = {
              user_id: userResponse.data._id,
              quiz_id: quizResponse.data._id,
              answers: [],
              score: 0,
              correctAnswersI: [],
              submittedAt: null,
              nextLevel: false,
              pass: false,
            };

            const createdResponse = await axiosInstance.post<response>(
              "/responses",
              newResponse
            );
            setResponseState(createdResponse.data);
          }
        }
      catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };


  
}, []);

const handleStartQuiz = () => {
  console.log("Starting quiz...");
};


  return (
    <Layout>
      <div className="p-8 bg-gray-800 text-white rounded-lg shadow-lg max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Quiz</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : quiz ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Quiz for Module: {module?.title || "Unknown"}
            </h2>
            
            <ul className="space-y-4">
  {questions.map((q, index) => {
    const isMCQ = q.question.includes(","); // Check if the question has commas
    const parts = q.question.split(","); // Split the question by commas
    const questionText = parts[0]; // Extract the actual question text
    const options = isMCQ ? parts.slice(1) : ["True", "False"]; // Exclude the first part for MCQ options

    return (
      <li key={q.id.toString()} className="border-b border-gray-700 pb-4">
        <p className="text-lg">
          <span className="font-semibold">Question {index + 1}:</span> {questionText}
        </p>
        <div className="ml-4 space-y-2">
          {options.map((option, optIndex) => (
            <label key={optIndex} className="flex items-center space-x-2">
              <input
                type="radio"
                name={`question-${index}`}
                value={option.trim()}
                className="form-radio text-blue-500"
              />
              <span>{option.trim()}</span>
            </label>
          ))}
        </div>
      </li>
    );
  })}
</ul>

            <button
              onClick={handleStartQuiz}
              className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <p>No quiz available.</p>
        )}
      </div>
    </Layout>
  );
}


