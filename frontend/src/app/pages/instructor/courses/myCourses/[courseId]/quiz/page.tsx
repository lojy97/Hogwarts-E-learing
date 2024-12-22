"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import Layout from "@/app/components/layout";
import { quiz, question, module } from "@/app/_lib/page";
import mongoose from "mongoose";
import { KeyObject } from "node:crypto";


export default function QuizPage() {
    const { courseId } = useParams(); // courseId is from the URL path
  const [searchParams] = useSearchParams(); // useSearchParams to get query parameters
  const moduleId = searchParams[1] // Manually extract the moduleId from query parameters
  const [quiz, setQuiz] = useState<quiz | null>(null);
  const [questionsQ, setQuestionsQ] = useState<question[]>([]);
  const [tfCount, setTfCount] = useState(0);
  const [mcqCount, setMcqCount] = useState(0);
  const [module,setModule]=useState<module| null>(null);
  const [QB, setQB] = useState<{
    tf: { id: mongoose.Types.ObjectId; question: string; correctAnswer: string }[];
    mcq: { id: mongoose.Types.ObjectId; question: string; correctAnswer: string }[];
  }>({
    tf: [],
    mcq: [],
  });


  useEffect(() => {
      
    console.log("course id:",courseId);
    console.log("module id ", moduleId); // courseId from path, moduleId from query
    const fetchQuesstionsData = async () => {

      try {
        const moduleRes = await axiosInstance.get<module>(`/modules/${moduleId}`);
        let qbId=moduleRes.data.questionBank_id;

       
        if(!qbId){

          const createQBResponse = await axiosInstance.post(`/questions`, {
            tf: [],
            mcq: [],
          });

          qbId = createQBResponse.data._id;
    
          // Update the module with the new Question Bank ID
          await axiosInstance.put(`/modules/${moduleId}`, { questionBank_id: qbId });



        }
        setModule(moduleRes.data);
        const response =await axiosInstance.get<question>(`/questions/${qbId}`)
        setQB(response.data);
        console.log ("og QBid",qbId)
       // setTfCount(response.data.TF);
        //setMcqCount(response.data.MCQ);
        //setQuestions(response.data.quizQuestions);
       // console.log("QB",response.data);
       
      } catch (error) {
        console.error("Error fetching quesstion bank data", error);
      }
    };

    fetchQuesstionsData();
    
  }, [courseId,moduleId]);

  const handleAddTF = async (question: string, correctAnswer: string) => {
    try {
      const qbid=module?.questionBank_id;
      
      const newQuestionId = new mongoose.Types.ObjectId(); // Generate a unique ID for the new question

      const newTfQuestion = {
        id: newQuestionId,
        question,
        correctAnswer,
      };
      const upTF={
        tf: [...QB.tf, newTfQuestion],
      } 
      const response = await axiosInstance.put(`/questions/${qbid}`, upTF);
    
      setQB((prevQB) => ({
        ...prevQB,
        tf: [...prevQB.tf, newTfQuestion],
      }));
      alert("Question added successfully!");
    } catch (error) {
      console.error("Error adding question", error);
      alert("Failed to add question.");
    }
  };
  const handleDeleteTF = async (id:string) => {
    try {
      const qbid=module?.questionBank_id;
      
      const upTF = {
        tf: QB.tf.filter((thistf) => thistf.id.toString() !== id),
      };
      const response = await axiosInstance.put(`/questions/${qbid}`, upTF);
    
      setQB((prevQB) => ({
        ...prevQB,
        tf: [...prevQB.tf].filter((thistf) => thistf.id.toString() !== id),
      }));
      alert("Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting tf question", error);
      alert("Failed to delete question.");
    }
  };
  const handleupdateTF = async (id:string,question: string, correctAnswer: string) => {
    try {
      const qbid=module?.questionBank_id;
      
      const newQuestionId = new mongoose.Types.ObjectId(); // Generate a unique ID for the new question

      const updatedData = {
        id: id,
        question,
        correctAnswer,
      };

      const upTF={
        tf: QB.tf.map((tfItem) => {
          if (tfItem.id.toString() === id) {
            // Edit the mcq item here
            return { ...tfItem, ...updatedData }; // Spread updatedData to modify the item
          }
          return tfItem; // Return the item as is if the id doesn't match
        }),
      } 
      const response = await axiosInstance.put(`/questions/${qbid}`, upTF);
    
      setQB((prevQB) => ({
        ...prevQB,
        tf: [...prevQB.tf.map((tfItem) => {
          if (tfItem.id.toString() === id) {
            // Edit the mcq item here
            return { ...tfItem, ...updatedData }; // Spread updatedData to modify the item
          }
          return tfItem; // Return the item as is if the id doesn't match
        })]
      }));
      alert("Question added successfully!");
    } catch (error) {
      console.error("Error adding question", error);
      alert("Failed to add question.");
    }
  };

  const handleAddMCQ = async (question: string, correctAnswer: string) => {
    try {
      const qbid=module?.questionBank_id;
      
      const newQuestionId = new mongoose.Types.ObjectId(); // Generate a unique ID for the new question

      const newMCQQuestion = {
        id: newQuestionId,
        question,
        correctAnswer,
      };
      const upMCQ={
        mcq: [...QB.mcq, newMCQQuestion],
      } 
      const response = await axiosInstance.put(`/questions/${qbid}`, upMCQ);
    
      setQB((prevQB) => ({
        ...prevQB,
        mcq: [...prevQB.mcq, newMCQQuestion],
      }));
      alert("Question added successfully!");
    } catch (error) {
      console.error("Error adding question", error);
      alert("Failed to add question.");
    }
  };
  const handleDeleteMCQ = async (id:string) => {
    try {
      const qbid=module?.questionBank_id;
      
      const upmcq = {
        mcq: QB.mcq.filter((thismcq) => thismcq.id.toString() !== id),
      };
      const response = await axiosInstance.put(`/questions/${qbid}`, upmcq);
    
      setQB((prevQB) => ({
        ...prevQB,
        mcq: [...prevQB.mcq].filter((thismcq) => thismcq.id.toString() !== id),
      }));
      alert("Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting mcq question", error);
      alert("Failed to delete question.");
    }
  };
  const handleupdateMCQ = async (id:string,question: string, correctAnswer: string) => {
    try {
      const qbid=module?.questionBank_id;
      
      const newQuestionId = new mongoose.Types.ObjectId(); // Generate a unique ID for the new question

      const updatedData = {
        id: id,
        question,
        correctAnswer,
      };

      const upMCQ={
        mcq: QB.mcq.map((mcqItem) => {
          if (mcqItem.id.toString() === id) {
            // Edit the mcq item here
            return { ...mcqItem, ...updatedData }; // Spread updatedData to modify the item
          }
          return mcqItem; // Return the item as is if the id doesn't match
        }),
      } 
      const response = await axiosInstance.put(`/questions/${qbid}`, upMCQ);
    
      setQB((prevQB) => ({
        ...prevQB,
        mcq: [...prevQB.mcq.map((mcqItem) => {
          if (mcqItem.id.toString() === id) {
            // Edit the mcq item here
            return { ...mcqItem, ...updatedData }; // Spread updatedData to modify the item
          }
          return mcqItem; // Return the item as is if the id doesn't match
        })]
      }));
      alert("Question added successfully!");
    } catch (error) {
      console.error("Error adding question", error);
      alert("Failed to add question.");
    }
  };

  const handleUpdateQuizCounts = async (mcqC:number,tfC:number) => {
    try {
     const modid=module?._id;
      await axiosInstance.put(`/modules/${modid}`, { TFcount: tfC, MCQcount: mcqC });
      alert("Quiz counts updated successfully!");
    } catch (error) {
      console.error("Error updating quiz counts", error);
      alert("Failed to update quiz counts.");
    }
  };

  if (!QB) {
    return (
      <Layout>
        <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
  <div className="flex flex-col items-center min-h-screen bg-[#121212] p-6">
    <h1 className="text-3xl font-bold text-white mb-8">Quiz for Module</h1>

    <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <input
            type="number"
            value={tfCount}
            onChange={(e) => setTfCount(Number(e.target.value))}
            placeholder="TF Count"
            className="text-black p-1 rounded"
          />
          <input
            type="number"
            value={mcqCount}
            onChange={(e) => setMcqCount(Number(e.target.value))}
            placeholder="MCQ Count"
            className="text-black p-1 rounded"
          />
          <button
            onClick={handleUpdateQuizCounts}
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700"
          >
            Update Counts
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {/* Render True/False Questions */}
        <h2 className="text-2xl font-bold mb-2">True/False Questions</h2>
        {QB.tf.map((q) => (
          <li key={q.id.toString()} className="border-b border-gray-700 pb-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-medium">{q.question}</h3>
                <p className="text-gray-400">Correct Answer: {q.correctAnswer}</p>
              </div>
              <div className="flex space-x-2">
              <button
                onClick={() => handleDeleteTF(q.id.toString())}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                  onClick={() => {
                    const updatedQuestion = prompt("Enter updated question:", q.question);
                    const updatedAnswer = prompt("Enter updated answer:", q.correctAnswer);
                    if (updatedQuestion && updatedAnswer) {
                      handleupdateTF(q.id.toString(), updatedQuestion, updatedAnswer);
                    }
                  }}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-700"
                >
                  Update
                </button>
                </div>
            </div>
          </li>
        ))}

        {/* Render Multiple Choice Questions */}
        <h2 className="text-2xl font-bold mt-6 mb-2">Multiple Choice Questions</h2>
        {QB.mcq.map((q) => (
          <li key={q.id.toString()} className="border-b border-gray-700 pb-4">
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-medium">{q.question}</h3>
                <p className="text-gray-400">Correct Answer: {q.correctAnswer}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteMCQ(q.id.toString())}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    const updatedQuestion = prompt("Enter updated question:", q.question);
                    const updatedAnswer = prompt("Enter updated answer:", q.correctAnswer);
                    if (updatedQuestion && updatedAnswer) {
                      handleupdateMCQ(q.id.toString(), updatedQuestion, updatedAnswer);
                    }
                  }}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-700"
                >
                  Update
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>

    {/* Add New TF Question */}
    <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white mt-8">
      <h2 className="text-2xl font-bold mb-4">Add New True/False Question</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleAddTF(formData.get("question") as string, formData.get("correctAnswer") as string);
        }}
      >
        <input
          type="text"
          name="question"
          placeholder="Question text"
          required
          className="w-full p-2 mb-4 text-black rounded"
        />
        <input
          type="text"
          name="correctAnswer"
          placeholder="Correct Answer"
          required
          className="w-full p-2 mb-4 text-black rounded"
        />
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
          Add Question
        </button>
      </form>
    </div>

    {/* Add New MCQ Question */}
    <div className="w-full max-w-4xl bg-[#202020] p-8 rounded-lg shadow-lg text-white mt-8">
      <h2 className="text-2xl font-bold mb-4">Add New Multiple Choice Question</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          handleAddMCQ(formData.get("question") as string, formData.get("correctAnswer") as string);
        }}
      >
        <input
          type="text"
          name="question"
          placeholder="Question text"
          required
          className="w-full p-2 mb-4 text-black rounded"
        />
        <input
          type="text"
          name="correctAnswer"
          placeholder="Correct Answer"
          required
          className="w-full p-2 mb-4 text-black rounded"
        />
        <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700">
          Add Question
        </button>
      </form>
    </div>
  </div>
</Layout>

  );
}
