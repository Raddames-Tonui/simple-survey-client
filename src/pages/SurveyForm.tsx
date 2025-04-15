// ...imports
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useSurveyContext } from "../context/SurveyContext";
import SubmissionModal from "../components/SubmissionModal";
import ThankYouModal from "../components/ThankYouModal";
import QuestionComponent from "../components/QuestionComponent";
import NavigationControls from "./survey/NavigationControls";
import ReviewSection from "./survey/ReviewSection";

const SurveyForm = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { survey, loading, submitSurvey, fetchSurveyQuestions } =
    useSurveyContext();

  const [answers, setAnswers] = useState<{ [id: number]: any }>({});
  const [files, setFiles] = useState<{ [id: number]: File[] }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isReview, setIsReview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSurveyQuestions(id);
    }
  }, [id]);

  useEffect(() => {
    const storedAnswers = localStorage.getItem(`survey-${id}`);
    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, [id]);

  const handleAnswerChange = (qid: number, value: any) => {
    const updated = { ...answers, [qid]: value };
    setAnswers(updated);
    localStorage.setItem(`survey-${id}`, JSON.stringify(updated));
  };

  const handleFileChange = (qid: number, selectedFiles: FileList | null) => {
    if (selectedFiles) {
      setFiles((prev) => ({
        ...prev,
        [qid]: [...(prev[qid] || []), ...Array.from(selectedFiles)],
      }));
    }
  };

  const handleRemoveFile = (qid: number, index: number) => {
    setFiles((prev) => {
      const updatedFiles = [...(prev[qid] || [])];
      updatedFiles.splice(index, 1);
      return { ...prev, [qid]: updatedFiles };
    });
  };

  const isValid = (answer: any, qid: number) => {
    const currentQuestion = sortedQuestions.find((q) => q.id === qid);
    if (!currentQuestion) return false;

    const { type, required } = currentQuestion;
    if (!required) return true;

    if (type === "file") {
      return files[qid] && files[qid].length > 0;
    }

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(answer);
    }

    return answer || answer === 0;
  };

  if (loading || !survey) return <Loader />;

  const sortedQuestions = [...survey.questions].sort(
    (a, b) => a.order - b.order
  );
  const currentQuestion = sortedQuestions[currentStep];
  const isAnswered = isValid(answers[currentQuestion.id], currentQuestion.id);
  const progressPercent = ((currentStep + 1) / sortedQuestions.length) * 100;

  const handleNext = () => {
    const q = sortedQuestions[currentStep];
    if (currentStep === sortedQuestions.length - 1) {
      if (q.required && !isValid(answers[q.id], q.id)) {
        alert("Please answer the required question before proceeding.");
        return;
      }
      handleReview();
    } else if (!q.required || isValid(answers[q.id], q.id)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleReview = () => {
    setIsReview(true);
  };

  const areRequiredQuestionsAnswered = () => {
    return sortedQuestions.every((q) => {
      return !q.required || isValid(answers[q.id], q.id);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const transformedAnswers: { [id: number]: string } = {};
    for (const [qid, value] of Object.entries(answers)) {
      transformedAnswers[Number(qid)] = Array.isArray(value)
        ? value.join(", ")
        : value;
    }

    const flattenedFiles = Object.values(files).flat();

    submitSurvey(transformedAnswers, flattenedFiles, id, () => {
      localStorage.removeItem(`survey-${id}`);
      setAnswers({});
      setFiles({});
      setCurrentStep(0);
      setIsReview(false);
      setIsSubmitting(false);
      setShowThankYou(true);
    });
  };

  return (
    <div className="mx-auto min-h-[90vh] py-10 px-4 bg-white md:border-x md:border-gray-300 flex flex-col">
      <div className="max-w-2xl w-full mx-auto border border-gray-300 flex-1">
        <div className="w-full bg-gray-200 pt-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-center">{survey.title}</h1>
            <p className="text-gray-600 text-center">{survey.description}</p>
          </div>
          <div className="w-full h-2 bg-gray-200 mb-4">
            <div
              className="h-2 bg-[#24C8ED] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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
                      <ul className="list-disc list-inside text-sm">
                        {files[currentQuestion.id].map((file, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between"
                          >
                            {file.name}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveFile(currentQuestion.id, index)
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
                sortedQuestions={sortedQuestions}
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
              sortedQuestions={sortedQuestions}
              answers={answers}
              files={files}
              handleRemoveFile={handleRemoveFile}
              setIsReview={setIsReview}
              handleSubmit={handleSubmit}
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
