import React, { useState } from "react";
import toast from "react-hot-toast";
import { server_url } from "../../config.json";

interface Question {
  name: string;
  type: string;
  required: boolean;
  text: string;
  description?: string;
  options?: string[];
}

export default function CreateSurvey() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [newQuestion, setNewQuestion] = useState<Question>({
    name: "",
    type: "text",
    required: false,
    text: "",
    description: "",
    options: [],
  });

  const inputTypes = [
    "text",
    "email",
    "number",
    "url",
    "textarea",
    "checkbox",
    "radio",
    "date",
    "file",
  ];

  const handleAddQuestion = () => {
    if (!newQuestion.name || !newQuestion.text) return;
    setQuestions([...questions, { ...newQuestion }]);
    setNewQuestion({
      name: "",
      type: "text",
      required: false,
      text: "",
      description: "",
      options: [],
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...(newQuestion.options || [])];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const addOptionField = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...(newQuestion.options || []), ""],
    });
  };

  const submitSurvey = async () => {
    try {
      const res = await fetch(`${server_url}/api/surveys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔐 Send cookies (with JWT) to backend
        body: JSON.stringify({
          title,
          description,
          is_published: isPublished,
          questions,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();
      toast.success(`Survey created! ID: ${data.survey_id}`);

      // Optional: reset form
      setTitle("");
      setDescription("");
      setIsPublished(false);
      setQuestions([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to create survey");
    }
  };

  return (
    <div className="min-h-screen bg-white my-4 md:my-6 md:border md:border-gray-300">
      <div className="py-6 md:pl-8 px-4">
        <h1 className="text-xl font-bold mb-4">Create New Survey</h1>
        <div className="mb-4">
          <label className="block font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex items-center space-x-3 my-5">
          <label className="group flex items-center cursor-pointer">
            <input
              className="hidden peer"
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
            />

            <span className="relative w-6 h-6 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md shadow-md transition-all duration-500 peer-checked:border-[#00A5CB] peer-checked:bg-[#00A5CB] peer-hover:scale-105 peer-checked:hover:bg-[#0190B0]">
              <span className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 opacity-0 peer-checked:opacity-100 rounded-md transition-all duration-500 peer-checked:animate-pulse"></span>

              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                className="hidden w-5 h-5 text-white peer-checked:block transition-transform duration-500 transform scale-50 peer-checked:scale-100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                />
              </svg>
            </span>

            <span className="ml-3 text-gray-700 group-hover:text-[#00A5CB] font-medium transition-colors duration-300">
              Publish now?
            </span>
          </label>
        </div>

        <hr className="mb-6" />
        <h2 className="text-xl font-semibold mb-2">Add Question</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Name (e.g. full_name)"
            value={newQuestion.name}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, name: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />
          <input
            placeholder="Text (question prompt)"
            value={newQuestion.text}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, text: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />
          <select
            value={newQuestion.type}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, type: e.target.value })
            }
            className="border px-3 py-2 rounded"
          >
            {inputTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            placeholder="Description (optional)"
            value={newQuestion.description}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, description: e.target.value })
            }
            className="border px-3 py-2 rounded"
          />
        </div>
        {/* <label className="inline-flex items-center my-3">
          <input
            type="checkbox"
            checked={newQuestion.required}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, required: e.target.checked })
            }
            className="mr-2"
          />
          Required
        </label> */}
        <div className="flex items-center space-x-3 my-5">
          <label className="group flex items-center cursor-pointer">
            <input
              className="hidden peer"
              type="checkbox"
              checked={newQuestion.required}
              onChange={(e) =>
                setNewQuestion({ ...newQuestion, required: e.target.checked })
              }
            />

            <span className="relative w-6 h-6 flex justify-center items-center bg-gray-100 border-2 border-gray-400 rounded-md shadow-md transition-all duration-500 peer-checked:border-[#00A5CB] peer-checked:bg-[#00A5CB] peer-hover:scale-105 peer-checked:hover:bg-[#0190B0]">
              <span className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 opacity-0 peer-checked:opacity-100 rounded-md transition-all duration-500 peer-checked:animate-pulse"></span>

              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                className="hidden w-5 h-5 text-white peer-checked:block transition-transform duration-500 transform scale-50 peer-checked:scale-100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                />
              </svg>
            </span>

            <span className="ml-3 text-gray-700 group-hover:text-[#00A5CB] font-medium transition-colors duration-300">
              Required
            </span>
          </label>
        </div>

        {(newQuestion.type === "checkbox" || newQuestion.type === "radio") && (
          <div className="mb-4">
            <p className="font-medium">Options</p>
            {(newQuestion.options || []).map((opt, i) => (
              <input
                key={i}
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="border px-3 py-1 rounded block my-1 w-full"
              />
            ))}
            <button
              type="button"
              onClick={addOptionField}
              className="mt-1 text-sm text-blue-500"
            >
              + Add Option
            </button>
          </div>
        )}
        <button
          onClick={handleAddQuestion}
          className="bg-green-600 text-white px-4 py-2 rounded mb-6 block"
        >
          Add Question
        </button>
        {questions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Questions Preview</h3>
            <ul className="list-disc pl-5">
              {questions.map((q, i) => (
                <li key={i}>
                  <strong>{q.text}</strong> ({q.type}){" "}
                  {q.required && <span className="text-red-500">*</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={submitSurvey}
          className="bg-[#00A5CB] hover:bg-[#0190B0] py-2 px-5  text-white font-semibold w-32"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
