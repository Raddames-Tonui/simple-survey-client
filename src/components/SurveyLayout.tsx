import QuestionComponent from "../pages/survey/QuestionComponent";

const SurveyLayout = ({
  survey,
  progressPercent,
  isReview,
  currentQuestion,
  answers,
  files,
  fileErrors,
  onAnswerChange,
  onFileChange,
  onNext,
  onPrevious,
  onReview,
  onEdit,
  onSubmit,
  currentStep,
  sortedQuestions,
  isAnswered,
  areRequiredQuestionsAnswered,
  isSubmitting,
}) => {
  return (
    <div className="mx-auto min-h-[90vh] py-10 px-4 bg-white md:border-x md:border-gray-300 flex flex-col">
      <div className="max-w-2xl w-full mx-auto border border-gray-300 flex-1">
        {/* Title and Description */}
        <div className="w-full bg-gray-200 pt-4">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">{survey.survey_title}</h1>
            <p className="text-gray-600">{survey.survey_description}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 mb-4">
            <div
              className="h-2 bg-[#24C8ED] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Form Start */}
        <form onSubmit={onSubmit} className="p-6">
          {!isReview ? (
            <>
              {/* Current Question */}
              <div className="mb-6">
                <QuestionComponent
                  question={currentQuestion}
                  answer={answers[currentQuestion.id]}
                  onAnswerChange={onAnswerChange}
                  onFileChange={onFileChange}
                  fileErrors={fileErrors}
                />
              </div>

              {/* Nav Buttons */}
              <div className="flex justify-end gap-5 mt-8">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={onPrevious}
                    className="px-6 py-2 border border-gray-400 hover:bg-gray-300 text-gray-800"
                  >
                    Back
                  </button>
                )}
                {currentStep < sortedQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={currentQuestion.required && !isAnswered}
                    className={`px-6 py-2 text-white ${
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
                    onClick={onReview}
                    disabled={!areRequiredQuestionsAnswered()}
                    className={`px-6 py-2 text-white ${
                      areRequiredQuestionsAnswered()
                        ? "bg-[#00A5CB] hover:bg-[#0190B0]"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Review Answers
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Review Mode */}
              <h2 className="text-xl font-bold mb-4 text-center text-[#0190B0]">
                Review Your Answers
              </h2>
              <ul className="space-y-4 mb-6">
                {sortedQuestions.map((q) => (
                  <li key={q.id}>
                    <strong>{q.text}</strong>
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
              {/* Review Nav Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onEdit}
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
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default SurveyLayout;
