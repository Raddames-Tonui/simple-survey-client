import React, { useState } from "react";
import toast from "react-hot-toast";
import { server_url } from "../../config.json";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Checkbox from "../components/Checkbox";
import { useAuth } from "../context/AuthContext";
import { useCookies } from "react-cookie";

interface Question {
  name: string;
  type: string;
  required: boolean;
  text: string;
  description?: string;
  options?: string[];
  order?: number;
}

export default function CreateSurvey() {
  const { user, isLoading } = useAuth();
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

  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;
  // console.log(token)

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

    setQuestions([
      ...questions,
      {
        ...newQuestion,
        order: questions.length,
      },
    ]);

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

  const handleOnDragEnd = (result: any) => {
    const { destination, source } = result;
    if (!destination) return;

    const reorderedQuestions = Array.from(questions);
    const [removed] = reorderedQuestions.splice(source.index, 1);
    reorderedQuestions.splice(destination.index, 0, removed);

    setQuestions(reorderedQuestions);
  };

  const submitSurvey = async () => {
    try {
      if (!token) {
        toast.error("You must be logged in to submit a survey");
        return;
      }

      const surveyData = {
        title,
        description,
        is_published: isPublished,
        questions: questions.map((q, index) => ({
          ...q,
          order: index,
        })),
      };

      const res = await fetch(`${server_url}/api/surveys/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(surveyData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();
      toast.success(`📝 Survey has been created!`);

      setTitle("");
      setDescription("");
      setIsPublished(false);
      setQuestions([]);
    } catch (err: any) {
      toast.error(err.message || "Failed to create survey");
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("survey_draft");
    setTitle("");
    setDescription("");
    setIsPublished(false);
    setQuestions([]);
    setNewQuestion({
      name: "",
      type: "text",
      required: false,
      text: "",
      description: "",
      options: [],
    });
    toast.success("Draft cleared");
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-[90vh]  ">
      <div className="">
        <h1 className="px-3 md:px-0 text-xl font-bold mb-4  mt-6 text-[#0190B0]">
          Create Your Survey
        </h1>
        <hr className="text-[#0190B0] mb-4" />
      </div>
      <div className=" md:pl-8 px-4 bg-white min-h-[80vh] my-4 md:my-6 md:border md:border-gray-300">
        <h1 className="text-xl font-bold mb-4 text-[#0190B0]"></h1>

        <div className="mb-4">
          <label className="block font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <Checkbox
          checked={isPublished}
          onChange={setIsPublished}
          label="Publish now?"
        />

        <hr className="mb-6" />
        <h2 className="text-xl font-semibold mb-2">Add Question</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Name (e.g. full_name)"
            value={newQuestion.name}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, name: e.target.value })
            }
            className="border border-gray-300 px-3 py-2 rounded"
          />
          <input
            placeholder="Text (question prompt)"
            value={newQuestion.text}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, text: e.target.value })
            }
            className="border border-gray-300 px-3 py-2 rounded"
          />
          <select
            value={newQuestion.type}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, type: e.target.value })
            }
            className="border border-gray-300 px-3 py-2 rounded"
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
            className="border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <Checkbox
          checked={newQuestion.required}
          onChange={(checked) =>
            setNewQuestion({ ...newQuestion, required: checked })
          }
          label="Required"
        />

        {(newQuestion.type === "checkbox" || newQuestion.type === "radio") && (
          <div className="mb-4">
            <p className="font-medium">Options</p>
            {(newQuestion.options || []).map((opt, i) => (
              <input
                key={i}
                value={opt}
                onChange={(e) => handleOptionChange(i, e.target.value)}
                placeholder={`Option ${i + 1}`}
                className="border border-gray-300 px-3 py-1 rounded block my-1 w-full"
              />
            ))}
            <button
              type="button"
              onClick={addOptionField}
              className="mt-1 text-md text-blue-500 font-semibold"
            >
              + Add Option
            </button>
          </div>
        )}

        <button
          onClick={handleAddQuestion}
          className="bg-[#00A5CB] hover:bg-[#0190B0] text-white px-4 py-2 font-semibold  mb-6 block"
        >
          Add Question
        </button>

        {questions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Questions Preview</h3>
            <h4 className="text-md text-gray-600 mb-2">
              Drag and drop to reorder questions.
            </h4>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <ul
                    className="space-y-2"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {questions.map((q, i) => (
                      <Draggable
                        key={i}
                        draggableId={`question-${i}`}
                        index={i}
                      >
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 bg-white border border-gray-300 rounded-sm shadow-sm cursor-move hover:shadow-md hover:bg-gray-100 transition-shadow"
                          >
                            <strong>{q.name}</strong> ({q.type}){" "}
                            {q.required && (
                              <span className="text-red-500 font-semibold text-md">
                                *
                              </span>
                            )}
                            <p>{q.text}</p>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            className="border border-gray-500 hover:bg-gray-400 hover:text-white py-2 px-5 mr-4 text-gray-800 font-semibold w-32"
          >
            Cancel
          </button>

          <button
            onClick={submitSurvey}
            className="Answers py-2 px-5 text-white  w-32 bg-[#00A5CB] hover:bg-[#0190B0] font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
