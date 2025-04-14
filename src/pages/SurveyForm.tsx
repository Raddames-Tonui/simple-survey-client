import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useSurveyContext } from "../context/SurveyContext";
import QuestionProps from "../components/QuestionProps";
import SubmissionModal from "../components/SubmissionModal";
import ThankYouModal from "../components/ThankYouModal";

const SurveyForm = (): JSX.Element => {
  // Get survey id from URL parameters
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Retrieve context values including survey data, loading flag, and functions
  const { survey, loading, submitSurvey, fetchSurveyQuestions } =
    useSurveyContext();

  // State for answers, file uploads, tracking steps, review mode, submission state and thank you modal
  const [answers, setAnswers] = useState<{ [id: number]: any }>({});
  const [files, setFiles] = useState<{ [id: number]: File[] }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isReview, setIsReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  console.log(survey);

  // On mount: fetch survey questions using the provided id.
  useEffect(() => {
    if (id) {
      fetchSurveyQuestions(id);
    }
  }, [id, fetchSurveyQuestions]);

  // Load stored answers from localStorage if available
  useEffect(() => {
    const storedAnswers = localStorage.getItem(`survey-${id}`);
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, [id]);

  // When an answer changes, update state and localStorage
  const handleAnswerChange = (qid: number, value: any) => {
    const updated = { ...answers, [qid]: value };
    setAnswers(updated);
    localStorage.setItem(`survey-${id}`, JSON.stringify(updated));
  };

  // Handle file upload changes: convert FileList to Array and update state
  const handleFileChange = (qid: number, selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles((prev) => ({
        ...prev,
        [qid]: Array.from(selectedFiles),
      }));
    }
  };

  // -----------------------------
  // VALIDATION FUNCTION
  // -----------------------------
  // Updated isValid function to check for email format (in addition to other validations).
  // For email fields, the regex verifies the presence of "@" and a domain.
  const isValid = (answer: any, qid: number) => {
    // Find the relevant question for this answer by matching its id
    const currentQuestion = sortedQuestions.find((q) => q.id === qid);
    if (!currentQuestion) return false;

    const { type, required } = currentQuestion;

    // If the question is not required, we consider it valid.
    if (!required) return true;

    // If the question is for file uploads then ensure a file exists.
    if (type === "file") {
      return files[qid] && files[qid].length > 0;
    }

    // Custom Email Validation:
    // The email should match a basic pattern checking for text before and after the "@" and a proper domain.
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(answer);
    }

    // For all other types: Accept value if truthy or if it is exactly 0 (covers number fields)
    return answer || answer === 0;
  };

  // If survey is loading or survey object is not ready, show Loader component.
  if (loading || !survey) return <Loader />;

  // Sort the questions based on the "order" property
  const sortedQuestions = [...survey.questions].sort(
    (a, b) => a.order - b.order
  );
  const currentQuestion = sortedQuestions[currentStep];

  // Determine whether the current question is answered properly:
  const isAnswered = isValid(answers[currentQuestion.id], currentQuestion.id);

  // Calculate survey progress for progress bar display
  const progressPercent = ((currentStep + 1) / sortedQuestions.length) * 100;

  // -----------------------------
  // NAVIGATION HANDLERS
  // -----------------------------
  // Navigate to the next question if current is valid; else, alert or trigger review mode
  const handleNext = () => {
    // Grab the current question for validation
    const q = sortedQuestions[currentStep];

    // If this is the last question...
    if (currentStep === sortedQuestions.length - 1) {
      // If the question is required and validation fails, alert user.
      if (q.required && !isValid(answers[q.id], q.id)) {
        alert("Please answer the required question before proceeding.");
        return;
      }
      // Otherwise, move to review mode.
      handleReview();
    } else if (!q.required || isValid(answers[q.id], q.id)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Navigate to the previous question
  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Trigger review mode once all questions are answered or skipped as appropriate
  const handleReview = () => {
    setIsReview(true);
  };

  // Check whether all required questions are answered correctly.
  const areRequiredQuestionsAnswered = () => {
    return sortedQuestions.every((q) => {
      return !q.required || isValid(answers[q.id], q.id);
    });
  };

  // -----------------------------
  // FORM SUBMISSION
  // -----------------------------
  // When the user reviews and submits, transform answer values to strings (including arrays).
  // Then submit using the context function and reset state/localStorage.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const transformedAnswers: { [id: number]: string } = {};
    for (const [qid, value] of Object.entries(answers)) {
      // If the answer is an array (e.g. checkbox multiple values), join them
      transformedAnswers[Number(qid)] = Array.isArray(value)
        ? value.join(", ")
        : value;
    }

    // Flatten the files object into a single array of files.
    const flattenedFiles = Object.values(files).flat();

    submitSurvey(transformedAnswers, flattenedFiles, id, () => {
      // On successful submission, clear local storage and reset state values.
      localStorage.removeItem(`survey-${id}`);
      setAnswers({});
      setFiles({});
      setCurrentStep(0);
      setIsReview(false);
      setIsSubmitting(false);
      setShowThankYou(true);
    });
  };

  // -----------------------------
  // RENDERING THE COMPONENT
  // -----------------------------
  return (
    <div className="mx-auto min-h-[90vh] py-10 px-4 bg-white  md:border-x md:border-gray-300 flex flex-col">
      <div className="max-w-2xl w-full mx-auto border border-gray-300 flex-1 ">
        {/* Survey Title & Description */}
        <div className="w-full bg-gray-200 pt-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-center">
              {survey.survey_title}
            </h1>
            <p className="text-gray-600 text-center">
              {survey.survey_description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 mb-4 ">
            <div
              className="h-2 bg-[#24C8ED]  transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Form for Survey Questions */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Normal Question Mode */}
          {!isReview ? (
            <>
              <div className="mb-6">
                <QuestionProps
                  question={currentQuestion}
                  answer={answers[currentQuestion.id]}
                  onAnswerChange={handleAnswerChange}
                  onFileChange={handleFileChange}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-end gap-5 mt-8">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2 border border-gray-400 hover:bg-gray-300 text-gray-800 disabled:opacity-50"
                  >
                    Back
                  </button>
                )}

                {currentStep < sortedQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentQuestion.required && !isAnswered}
                    className={`px-6 py-2 text-white bottom-0 ${
                      isAnswered || !currentQuestion.required
                        ? "bg-[#24C8ED] hover:bg-[#0190B0]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {currentQuestion.required || isAnswered ? "Next" : "Skip"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReview}
                    disabled={!areRequiredQuestionsAnswered()}
                    className={`px-6 py-2 text-white ${
                      areRequiredQuestionsAnswered()
                        ? "bg-[#00A5CB] hover:bg-[#0190B0] font-semibold"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Review Answers
                  </button>
                )}
              </div>
            </>
          ) : (
            // Review Mode: Display answers and allow editing before final submission
            <div className="">
              <h2 className="text-xl font-bold mb-4 text-center text-[#0190B0]">
                Review Your Answers
              </h2>
              <ul className="space-y-4 mb-6">
                {sortedQuestions.map((q) => (
                  <li key={q.id}>
                    <strong className="block">{q.text}</strong>
                    <div className="text-gray-700 mt-1">
                      {/* Display file names if the question type is file */}
                      {q.type === "file" ? (
                        files[q.id] && files[q.id].length > 0 ? (
                          <ul className="list-disc list-inside">
                            {files[q.id].map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <em>No file uploaded</em>
                        )
                      ) : Array.isArray(answers[q.id]) ? (
                        answers[q.id].length > 0 ? (
                          answers[q.id].join(", ")
                        ) : (
                          <em>No answer</em>
                        )
                      ) : answers[q.id] ? (
                        answers[q.id]
                      ) : (
                        <em>No answer</em>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {/* Buttons for review mode */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsReview(false)}
                  className="px-7 py-2 border border-gray-400 hover:bg-gray-300 text-gray-800 font-semibold"
                >
                  Edit Answers
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#00A5CB] hover:bg-[#0190B0] text-white font-semibold"
                >
                  Submit Survey
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Display submission modal while the survey is being submitted */}
      {isSubmitting && <SubmissionModal />}
      {/* Display thank you modal after successful submission */}
      {showThankYou && <ThankYouModal onClose={() => setShowThankYou(false)} />}
    </div>
  );
};

export default SurveyForm;
