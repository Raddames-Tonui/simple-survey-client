import React from "react";

interface NavigationControlsProps {
  currentStep: number;
  sortedQuestions: any[];
  currentQuestion: any;
  isAnswered: boolean;
  handlePrevious: () => void;
  handleNext: () => void;
  handleReview: () => void;
  areRequiredQuestionsAnswered: () => boolean;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  currentStep,
  sortedQuestions,
  currentQuestion,
  isAnswered,
  handlePrevious,
  handleNext,
  handleReview,
  areRequiredQuestionsAnswered,
}) => {
  return (
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
  );
};

export default NavigationControls;
