import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { server_url } from "../../config.json";
import Loader from "../components/Loader";

type Option = {
  id: number;
  value: string;
};

type Question = {
  id: number;
  name: string;
  text: string;
  type: string;
  description?: string;
  required: boolean;
  options?: Option[];
};

type SurveyData = {
  survey_title: string;
  survey_description?: string;
  questions: Question[];
};

const Survey = (): JSX.Element => {
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [files, setFiles] = useState<File[]>([]); // To store the files

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(`${server_url}/api/questions`);
        const data = await response.json();

        const surveyInfo = {
          survey_title: data.questions[0]?.survey_title || "Survey",
          survey_description: data.questions[0]?.survey_description || "",
          questions: data.questions
            .map((q: any) => q.question) // Extract questions data
            .sort((a: Question, b: Question) => a.id - b.id), // Sort questions by id
        };

        setSurvey(surveyInfo);
      } catch (error) {
        console.error("Error fetching survey:", error);
        toast.error("Failed to load survey.");
      }
    };

    fetchSurvey();
  }, []);

  const handleAnswerChange = (id: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: number, value: string) => {
    setAnswers((prev) => {
      const existing = prev[id] || [];
      const updated = existing.includes(value)
        ? existing.filter((v: string) => v !== value)
        : [...existing, value];
      return { ...prev, [id]: updated };
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("survey_id", "6"); // Example, this can be dynamic
    formData.append("user_id", "5");  // Example, this can be dynamic

    // Add answers to the form data
    Object.keys(answers).forEach((key) => {
      formData.append(`q_${key}`, answers[parseInt(key)] || ""); // Ensure non-null values
    });

    // Add files to the form data
    files.forEach((file) => {
      formData.append("certificates", file); // Add certificates to the form data
    });

    try {
      const response = await fetch(`${server_url}/api/questions/responses`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        toast.success("Survey submitted successfully");
      } else {
        toast.error("Failed to submit survey");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Error submitting survey");
    }
  };

  const renderInput = (question: Question) => {
    const { id, type, required, options } = question;

    if (type === "textarea") {
      return (
        <textarea
          required={required}
          value={answers[id] || ""}
          onChange={(e) => handleAnswerChange(id, e.target.value)}
          className="w-full p-2 border rounded"
        />
      );
    }

    if (type === "file") {
      return (
        <input
          type="file"
          required={required}
          multiple
          accept=".pdf"
          onChange={handleFileChange}
          className=""
        />
      );
    }

    if (
      (type === "radio" || type === "checkbox") &&
      Array.isArray(options) &&
      options.length > 0
    ) {
      return options.map((option) => (
        <label key={option.id} className="block">
          <input
            type={type}
            name={type === "radio" ? `question-${id}` : undefined}
            value={option.value}
            checked={type === "radio" ? answers[id] === option.value : (answers[id] || []).includes(option.value)}
            onChange={() =>
              type === "radio" ? handleAnswerChange(id, option.value) : handleCheckboxChange(id, option.value)
            }
            className="mr-2"
          />
          {option.value}
        </label>
      ));
    }

    return (
      <input
        type={type}
        required={required}
        value={answers[id] || ""}
        onChange={(e) => handleAnswerChange(id, e.target.value)}
        className="w-full p-2 border rounded"
      />
    );
  };

  if (!survey) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white my-4 md:my-6 md:border md:border-gray-300">
      <div className="py-6 md:pl-8 px-4">
        <div className="flex flex-col justify-center items-center mb-4">
          <h1 className="text-[#0190B0] font-semibold text-xl mb-2  ">{survey.survey_title}</h1>
          {survey.survey_description && (
            <p className="text-gray-700 font-semibold">{survey.survey_description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
          {survey.questions.map((question) => (
            <div key={question.id}>
              <label className="font-semibold block mb-1">{question.text}</label>
              {question.description && (
                <p className="text-sm text-gray-500 mt-1">{question.description}</p>
              )}

              {renderInput(question)}
            </div>
          ))}
          <button
            type="submit"
            className="bg-[#00A5CB] hover:bg-[#0190B0] py-2 px-5 text-white font-semibold w-32"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Survey;
