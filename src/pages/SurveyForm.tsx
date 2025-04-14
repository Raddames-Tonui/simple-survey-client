import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { useSurveyContext } from "../context/SurveyContext";
import QuestionProps from "../components/QuestionProps";
import SubmissionModal from "../components/SubmissionModal";
import ThankYouModal from "../components/ThankYouModal";

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
  }, [id, fetchSurveyQuestions]);

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
        [qid]: Array.from(selectedFiles),
      }));
    }
  };

  const isValid = (answer: any, qid: number) => {
    const isAnswerValid = answer || answer === 0;
    const isFileValid = files[qid] && files[qid].length > 0;
    return isAnswerValid || isFileValid;
  };

  const handleNext = () => {
    const currentQuestion = sortedQuestions[currentStep];
    if (currentStep === sortedQuestions.length - 1) {
      if (
        currentQuestion.required &&
        !isValid(answers[currentQuestion.id], currentQuestion.id)
      ) {
        alert("Please answer the required question before proceeding.");
        return;
      } else {
        handleReview();
      }
    } else if (
      !currentQuestion.required ||
      isValid(answers[currentQuestion.id], currentQuestion.id)
    ) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleReview = () => {
    setIsReview(true);
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

  if (loading || !survey) return <Loader />;

  const sortedQuestions = [...survey.questions].sort(
    (a, b) => a.order - b.order
  );
  const currentQuestion = sortedQuestions[currentStep];
  const isAnswered = isValid(answers[currentQuestion?.id], currentQuestion.id);
  const progressPercent = ((currentStep + 1) / sortedQuestions.length) * 100;

  const areRequiredQuestionsAnswered = () => {
    return sortedQuestions.every((question) => {
      return !question.required || isValid(answers[question.id], question.id);
    });
  };

  return (
    <div className="mx-auto min-h-[80vh] py-10 px-4 bg-white my-4 md:my-6 md:border md:border-gray-300">
      <div className="max-w-2xl w-full mx-auto border border-gray-300 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">
            {survey.survey_title}
          </h1>
          <p className="text-gray-600 text-center">
            {survey.survey_description}
          </p>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div
            className="h-2 bg-[#24C8ED] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit}>
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
                    className={`px-6 py-2 rounded text-white ${
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
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Review Your Answers
              </h2>
              <ul className="space-y-4 mb-6">
                {sortedQuestions.map((q) => (
                  <li key={q.id}>
                    <strong className="block">{q.text}</strong>
                    <div className="text-gray-700 mt-1">
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

      {isSubmitting && <SubmissionModal />}
      {showThankYou && <ThankYouModal onClose={() => setShowThankYou(false)} />}
    </div>
  );
};

export default SurveyForm;
