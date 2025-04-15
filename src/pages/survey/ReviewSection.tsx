
interface ReviewSectionProps {
  sortedQuestions: { id: string; text: string; type: string }[];
  answers: Record<string, any>;
  files: Record<string, File[]>;
  handleRemoveFile: (questionId: string, index: number) => void;
  setIsReview: (value: boolean) => void;
  handleSubmit: () => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  sortedQuestions,
  answers,
  files,
  handleRemoveFile,
  setIsReview,
  handleSubmit,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-center text-[#0190B0]">
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
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        {file.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(q.id, index)}
                          className="text-red-600 text-xs ml-2"
                        >
                          Remove
                        </button>
                      </li>
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
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-[#00A5CB] hover:bg-[#0190B0] text-white font-semibold"
        >
          Submit Survey
        </button>
      </div>
    </div>
  );
};

export default ReviewSection;
