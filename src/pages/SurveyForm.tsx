import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useSurveyContext } from "../context/SurveyContext";
import SubmissionModal from "../components/SubmissionModal";
import ThankYouModal from "../components/ThankYouModal";
import NavigationControls from "./survey/NavigationControls";
import ReviewSection from "./survey/ReviewSection";
import QuestionComponent from "./survey/QuestionComponent";

const SurveyForm = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { survey, loading, submitSurvey, fetchSurveyQuestions } =
    useSurveyContext();

  const [answers, setAnswers] = useState<{ [id: number]: any }>({});
  const [files, setFiles] = useState<{ [id: number]: File[] }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isReview, setIsReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Fetch survey questions when `id` changes
  useEffect(() => {
    if (id) {
      fetchSurveyQuestions(id);
    }
  }, [id]);

  // Load saved answers from localStorage when `id` changes
  useEffect(() => {
    const storedAnswers = localStorage.getItem(`survey-${id}`);
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, [id]);

  // Update answers state and save to localStorage
  const handleAnswerChange = (qid: number, value: any) => {
    const updated = { ...answers, [qid]: value };
    setAnswers(updated);
    localStorage.setItem(`survey-${id}`, JSON.stringify(updated));
  };

  // Add selected files for a specific question to state
  const handleFileChange = (qid: number, selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles((prev) => ({
        ...prev,
        [qid]: [
          ...(prev[qid] || []),
          ...Array.from(selectedFiles), // Append newly selected files
        ],
      }));
    }
  };

  // Remove a specific file by index from the list of files for a given question
  const handleRemoveFile = (qid: string, index: number) => {
    const questionId = Number(qid); // ID  changed to number
    setFiles((prev) => {
      const updatedFiles = [...(prev[questionId] || [])]; // Clone existing files array
      updatedFiles.splice(index, 1); // Remove the file at the given index
      return { ...prev, [questionId]: updatedFiles };
    });
  };

  // Validates a user's answer based on the question type and whether it's required
  const isValid = (answer: any, qid: number) => {
    const currentQuestion = sortedQuestions.find((q) => q.id === qid); // Find the question by ID
    if (!currentQuestion) return false; // If question not found, treat as invalid

    const { type, required } = currentQuestion;

    if (!required) return true; // If not required, always valid regardless of input

    // Special case: file input must have at least one uploaded file
    if (type === "file") {
      return files[qid] && files[qid].length > 0;
    }

    // Special case: validate email format using regex
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(answer); // Returns true if it's a valid email
    }

    // For all other types: valid if there's a value (including 0)
    return answer || answer === 0;
  };

  if (loading || !survey)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

  // Create a shallow copy of the questions array to avoid mutating the original
  const sortedQuestions = [...survey.questions].sort(
    (a, b) => a.order - b.order // Sort questions based on their 'order' property fro questions
  );

  const currentQuestion = sortedQuestions[currentStep]; // Get the current question based on the step the user is on
  const isAnswered = isValid(answers[currentQuestion.id], currentQuestion.id); // Check if the current question has been answered correctly (especially if required)
  const progressPercent = ((currentStep + 1) / sortedQuestions.length) * 100;

  // Go to the next question or review if it's the last step
  const handleNext = () => {
    const q = sortedQuestions[currentStep];

    // If it's the last question and required but not valid, block navigation
    if (currentStep === sortedQuestions.length - 1) {
      if (q.required && !isValid(answers[q.id], q.id)) {
        alert("Please answer the required question before proceeding.");
        return;
      }
      handleReview(); // Review mode if all valid
    }
    // If not the last, move to next step if either not required or already valid
    else if (!q.required || isValid(answers[q.id], q.id)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Move to the previous question
  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Trigger review screen
  const handleReview = () => {
    setIsReview(true);
  };

  // Check if all required questions have valid answers
  const areRequiredQuestionsAnswered = () => {
    return sortedQuestions.every((q) => {
      // Check if the question is required and if it has a valid answer (BOOLEAN)
      return !q.required || isValid(answers[q.id], q.id);
    });
  };

  // Handles the final submission process
  const submitFormLogic = () => {
    setIsSubmitting(true); 

    const transformedAnswers: { [id: number]: string } = {}; 
    let emailAnswer: string | null = null; // Separate storage for email to be saved to survey table instead of answers table

    // Iterate through all answers by question ID
    for (const [qidStr, value] of Object.entries(answers)) {
      const qid = Number(qidStr); 
      const question = sortedQuestions.find((q) => q.id === qid); // Get full question object
      if (!question) continue; // Skip if question not found 

      // Join array values (e.g., checkboxes) into a string, else use as-is
      const formattedValue = Array.isArray(value) ? value.join(", ") : value;

      if (question.type === "email") {
        emailAnswer = formattedValue; // Store email separately
      } else {
        transformedAnswers[qid] = formattedValue; // Store regular answers
      }
    }

    // Combine all file uploads into one array for submission
    const flattenedFiles = Object.values(files).flat();

    // Call the main submission function  (id! means non-null assertion operator. in typescript)
    submitSurvey(transformedAnswers, flattenedFiles, id!, emailAnswer, () => {
      // Cleanup after successful submission
      localStorage.removeItem(`survey-${id}`);
      setFiles({});
      setCurrentStep(0);
      setIsReview(false);
      setIsSubmitting(false);
      setShowThankYou(true); // Show confirmation
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFormLogic();
  };

  return (
    <div className="mx-auto min-h-[90vh] md:my-5 bg-white md:border md:border-gray-300 flex flex-col">
      <div className="w-full mx-auto flex-1">
        <div className="w-full min-h-[12vh] bg-gray-200 relative">
          <div className="flex flex-col py-5 justify-center items-center">
            <h1 className="text-2xl font-bold text-center text-gray-800">
              {survey.survey_title}
            </h1>
            <p className="text-gray-600 text-center">
              {survey.survey_description}
            </p>
          </div>
          <div className="absolute bottom-0 w-full h-2 bg-gray-200">
            <div
              className="h-2 bg-[#24C8ED] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="py-10 px-4 md:px-6 lg:px-10">
          {!isReview ? (
            <>
              <div className="mb-6">
                <QuestionComponent
                  question={currentQuestion}
                  answer={answers[currentQuestion.id]}
                  onAnswerChange={handleAnswerChange}
                  onFileChange={handleFileChange}
                />
                {currentQuestion.type === "file" &&
                  files[currentQuestion.id]?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm font-semibold">Selected Files:</p>
                      <ul className="list-disc list-inside text-sm pl-4">
                        {files[currentQuestion.id].map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between"
                          >
                            {file.name}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveFile(
                                  currentQuestion.id.toString(),
                                  index
                                )
                              }
                              className="text-red-600 text-sm font-semibold ml-2"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <NavigationControls
                currentStep={currentStep}
                sortedQuestions={sortedQuestions.map((q) => ({
                  ...q,
                  id: q.id.toString(),
                }))}
                currentQuestion={currentQuestion}
                isAnswered={isAnswered}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                handleReview={handleReview}
                areRequiredQuestionsAnswered={areRequiredQuestionsAnswered}
              />
            </>
          ) : (
            <ReviewSection
              sortedQuestions={sortedQuestions.map((q) => ({
                ...q,
                id: q.id.toString(),
              }))}
              answers={answers}
              files={files}
              handleRemoveFile={handleRemoveFile}
              setIsReview={setIsReview}
              handleSubmit={submitFormLogic}
            />
          )}
        </form>
      </div>

      {isSubmitting && <SubmissionModal />}
      {showThankYou && <ThankYouModal onClose={() => setShowThankYou(false)} />}
    </div>
  );
};

export default SurveyForm;
