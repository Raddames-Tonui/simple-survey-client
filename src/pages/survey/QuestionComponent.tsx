import { FC } from "react";

interface QuestionProps {
  question: any;
  answer: any;
  onAnswerChange: (id: number, value: any) => void;
  onFileChange?: (id: number, files: FileList | null) => void;
  fileErrors?: { [id: number]: string };
}

const QuestionComponent: FC<QuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  onFileChange,
  fileErrors,
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
          <>
            <label className="block text-sm font-medium text-gray-700 mt-3 mb-1">
              Upload File(s)
            </label>
            <div className="relative w-full">
              <input
                type="file"
                required={required}
                multiple
                accept=".pdf"
                onChange={handleFileInput}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                 file:border-0
                 file:text-md file:font-semibold
                 file:bg-[#46535c] file:text-white
                 hover:file:bg-[#0190B0]
                 cursor-pointer"
              />
            </div>

            {type === "file" && fileErrors?.[id] && (
              <p className="text-red-600 text-sm mt-2">{fileErrors[id]}</p>
            )}
          </>
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

export default QuestionComponent;
