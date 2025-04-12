import { useState } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { useSurveyContext } from "../context/SurveyContext";


const Survey = (): JSX.Element => {
  const { survey, loading, submitSurvey } = useSurveyContext();
  const { user } = useAuth();
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [files, setFiles] = useState<File[]>([]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user_id = user?.id.toString() || null;
    const survey_id = survey?.questions[0]?.survey_id?.toString() || "";
    if (!user_id || !survey_id) return;

    submitSurvey(answers, files, user_id, survey_id);
  };

  const renderInput = (question: any) => {
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
          className="block mt-2"
        />
      );
    }

    if ((type === "radio" || type === "checkbox") && Array.isArray(options)) {
      return options.map((option: any) => (
        <label key={option.id} className="block">
          <input
            type={type}
            name={type === "radio" ? `question-${id}` : `${id}-${option.value}`}
            value={option.value}
            checked={
              type === "radio"
                ? answers[id] === option.value
                : (answers[id] || []).includes(option.value)
            }
            onChange={() =>
              type === "radio"
                ? handleAnswerChange(id, option.value)
                : handleCheckboxChange(id, option.value)
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

  if (loading || !survey) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white my-10 md:my-6 md:border md:border-gray-300">
      <div className="py-6 md:pl-8 px-4">
        <div className="text-center mb-4">
          <h1 className="text-[#0190B0] font-semibold text-xl mb-2">
            {survey.survey_title}
          </h1>
          {survey.survey_description && (
            <p className="text-gray-700 font-semibold">
              {survey.survey_description}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
          {survey.questions.map((question) => (
            <div key={question.id}>
              <label className="font-semibold block mb-1">{question.text}</label>
              {question.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {question.description}
                </p>
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