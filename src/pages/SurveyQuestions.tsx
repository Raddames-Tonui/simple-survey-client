import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import Loader from "../components/Loader";
import { useSurveyContext } from "../context/SurveyContext";

const SurveyQuestions = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>(); // Get the survey id from URL
  const { survey, loading, submitSurvey, fetchSurveyQuestions } =
    useSurveyContext();
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [files, setFiles] = useState<{ [key: number]: File[] }>({});

  // Fetch the survey questions when the component is mounted
  useEffect(() => {
    if (id) {
      fetchSurveyQuestions(id); // Fetch survey questions by surveyId
    }
  }, [id, fetchSurveyQuestions]);

  // console.log(survey)

  const handleAnswerChange = (id: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  // Handles checkbox input changes for multi-select questions
  const handleCheckboxChange = (id: number, value: string) => {
    setAnswers((prev) => {
      // Get the current array of selected values for the given question ID, or an empty array if none
      const existing = prev[id] || [];

      // If the clicked value is already selected, remove it (uncheck), otherwise add it (check)
      const updated = existing.includes(value)
        ? existing.filter((v: string) => v !== value) // remove value
        : [...existing, value]; // add value

      // Return the updated state with the modified array for this question ID
      return { ...prev, [id]: updated };
    });
  };

  // Handles file input changes for a specific question (by ID)
  const handleFileChange = (
    id: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Check if files were selected
    if (event.target.files) {
      setFiles((prev) => ({
        ...prev,
        [id]: Array.from(event.target.files), // convert FileList to array and assign to current ID
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Flatten the files object into an array
    //  Object.values(files) gets the values (which are arrays of files) from the files object.
    // .flat() flattens the nested arrays into a single array, so submitSurvey receives a proper array of files.
    const flattenedFiles = Object.values(files).flat();
    submitSurvey(answers, flattenedFiles, id); // passing flattened files as an array
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
          onChange={(e) => handleFileChange(id, e)}
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

    // handle: text, email, number, url, date
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
    <div className="min-h-screen bg-white my-4 md:my-6 md:border md:border-gray-300">
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
          {[...survey.questions] // Create a shallow copy of the questions array to avoid mutating the original
            .sort((a, b) => a.order - b.order) // Sort questions based on their 'order' property
            .map((question) => (
              <div key={question.id}>
                {/* Unique key for React reconciliation */}
                <label className="font-semibold block mb-1">
                  {question.text} {/* Display the question text */}
                </label>
                {question.description && ( // If a description exists, show it
                  <p className="text-sm text-gray-500 mt-1">
                    {question.description}
                  </p>
                )}
                {/* Render appropriate input element based on question type */}
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

export default SurveyQuestions;
