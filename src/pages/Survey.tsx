import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { server_url } from "../../config.json";

type Question = {
  id: number;
  text: string;
  options: { id: number; value: string }[];
  type: string;
  description: string;
};

const Survey = (): JSX.Element => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string | string[] }>(
    {}
  ); // Store answers with different data types

  useEffect(() => {
    // Fetch the questions from the backend
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${server_url}/api/questions`);
        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Failed to load questions.");
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionId: number, value: string | string[]) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleCheckboxChange = (questionId: number, option: string) => {
    setAnswers((prevAnswers) => {
      const currentAnswers = prevAnswers[questionId] as string[] | undefined;
      if (currentAnswers) {
        // Toggle the selected option
        if (currentAnswers.includes(option)) {
          return {
            ...prevAnswers,
            [questionId]: currentAnswers.filter((item) => item !== option),
          };
        } else {
          return {
            ...prevAnswers,
            [questionId]: [...currentAnswers, option],
          };
        }
      }
      return {
        ...prevAnswers,
        [questionId]: [option],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can handle the survey submission, like sending the answers to the backend
    toast.success("Survey submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-white my-4 md:my-6 md:border md:border-gray-300">
      <div className="py-6 md:pl-8 ">
        <h1 className="text-[#0190B0]">Survey</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
          {questions.map((question) => (
            <div key={question.id}>
              <h3>{question.text}</h3>
              {question.type === "choice" && question.options.length > 0 ? (
                // Render radio buttons for 'choice' type questions
                question.options.map((option) => (
                  <label key={option.id}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.value}
                      checked={
                        (answers[question.id] as string) === option.value
                      }
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                    />
                    {option.value}
                  </label>
                ))
              ) : question.type === "file" ? (
                // Render file upload for 'file' type questions
                <input
                  type="file"
                  onChange={(e) =>
                    handleAnswerChange(
                      question.id,
                      e.target.files?.[0]?.name || ""
                    )
                  }
                  required={question.required}
                />
              ) : question.type === "short_text" ? (
                // Render text input for 'short_text' type questions
                <input
                  type="text"
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  required={question.required}
                />
              ) : question.type === "long_text" ? (
                // Render textarea for 'long_text' type questions
                <textarea
                  value={answers[question.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question.id, e.target.value)
                  }
                  required={question.required}
                />
              ) : question.type === "choice_multiple" ? (
                // Render checkboxes for multiple choices (for "You can select multiple")
                question.options.map((option) => (
                  <label key={option.id}>
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={(answers[question.id] as string[]).includes(
                        option.value
                      )}
                      onChange={() =>
                        handleCheckboxChange(question.id, option.value)
                      }
                    />
                    {option.value}
                  </label>
                ))
              ) : null}
              {question.description && <p>{question.description}</p>}
            </div>
          ))}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Survey;
