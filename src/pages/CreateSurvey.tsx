import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { server_url } from "../../config.json";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Checkbox from "../components/Checkbox";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

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
  const { user, logout, isLoading } = useAuth(); // Access user and loading state
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
  const navigate = useNavigate();

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

  // Redirect to login if no user is authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      toast.error("You must be logged in to create a survey");
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const handleAddQuestion = () => {
    if (!newQuestion.name || !newQuestion.text) return;

    setQuestions([
      ...questions,
      {
        ...newQuestion,
        order: questions.length, // Assign order as the next index
      },
    ]);

    // Reset the new question form
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
      const surveyData = {
        title,
        description,
        is_published: isPublished,
        questions: questions.map((q, index) => ({
          ...q,
          order: index,
        })),
      };

      // Log the data that will be submitted
      console.log("Submitting survey data:", surveyData);

      const res = await fetch(`${server_url}/api/surveys`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();
      toast.success(`Survey created! ID: ${data.survey_id}`);

      // Clear form after submission
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

        {/* Survey Title */}
        <div className="mb-4">
          <label className="block font-medium">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Survey Description */}
        <div className="mb-4">
          <label className="block font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Publish Checkbox - Using the Checkbox component */}
        <Checkbox
          checked={isPublished}
          onChange={setIsPublished}
          label="Publish now?"
        />

        <hr className="mb-6" />
        <h2 className="text-xl font-semibold mb-2">Add Question</h2>

        {/* Question Form */}
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

        {/* Required Checkbox - Using the Checkbox component */}
        <Checkbox
          checked={newQuestion.required}
          onChange={(checked) =>
            setNewQuestion({ ...newQuestion, required: checked })
          }
          label="Required"
        />

        {/* Conditional Options */}
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

        {/* Preview and Drag & Drop */}
        {questions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">Questions Preview</h3>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="questions">
                {(provided) => (
                  <ul
                    className="list-disc pl-5"
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
                          >
                            <strong>{q.text}</strong> ({q.type}){" "}
                            {q.required && (
                              <span className="text-red-500">*</span>
                            )}
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

        <button
          onClick={submitSurvey}
          className="bg-[#00A5CB] hover:bg-[#0190B0] py-2 px-5 text-white font-semibold w-32"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
