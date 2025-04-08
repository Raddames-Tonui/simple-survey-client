import React, { useState } from "react";

const Survey = (): JSX.Element => {
  const [answers, setAnswers] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Survey submitted: ${answers}`);
  };

  return (
    <div>
      <h1>Survey</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Your Answer:
          <input
            type="text"
            value={answers}
            onChange={(e) => setAnswers(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Survey;
