import { FC } from "react";

interface QuestionProps {
  question: any;
  answer: any;
  onAnswerChange: (id: number, value: any) => void;
  onFileChange?: (id: number, files: FileList | null) => void;
}

const QuestionProps: FC<QuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  onFileChange,
}) => {
  const { id, type, required, options, text, description } = question;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onAnswerChange(id, e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const updated = Array.isArray(answer) ? [...answer] : [];
    if (e.target.checked) {
      if (!updated.includes(value)) updated.push(value);
    } else {
      const index = updated.indexOf(value);
      if (index > -1) updated.splice(index, 1);
    }
    onAnswerChange(id, updated);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onFileChange) {
      onFileChange(id, e.target.files);
    }
  };

  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            required={required}
            value={answer || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded min-h-[20vh] h-auto"
          />
        );

      case "file":
        return (
          <input
            type="file"
            required={required}
            multiple
            accept=".pdf"
            onChange={handleFileInput}
            className="w-full p-2 border border-gray-300 rounded"
          />
        );

      case "radio":
        return (
          <div className="space-y-2">
            {options?.map((option: any) => (
              <label key={option.value} className="block">
                <input
                  type="radio"
                  value={option.value}
                  checked={answer === option.value}
                  onChange={handleChange}
                  className="mr-2"
                />
                {option.value}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {options?.map((option: any) => (
              <label key={option.value} className="block">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={
                    Array.isArray(answer) && answer.includes(option.value)
                  }
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                {option.value}
              </label>
            ))}
          </div>
        );

      case "email":
        return (
          <input
            type="email"
            required={required}
            value={answer || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="example@email.com"
          />
        );

      case "url":
        return (
          <input
            type="url"
            required={required}
            value={answer || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="https://example.com"
          />
        );

      case "date":
        return (
          <input
            type="date"
            required={required}
            value={answer || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        );

      default: // text, number, etc.
        return (
          <input
            type={type}
            required={required}
            value={answer || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        );
    }
  };

  return (
    <div>
      <label className="block text-md font-medium mb-1">{text}</label>
      {description && (
        <p className="text-gray-500 text-sm mb-2">{description}</p>
      )}
      {renderInput()}
    </div>
  );
};

export default QuestionProps;
