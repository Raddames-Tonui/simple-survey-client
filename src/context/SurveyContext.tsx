// src/context/SurveyContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { server_url } from "../../config.json";

type Option = { id: number; value: string };
type Question = {
  id: number;
  name: string;
  text: string;
  type: string;
  description?: string;
  required: boolean;
  options?: Option[];
};

type SurveyData = {
  survey_title: string;
  survey_description?: string;
  questions: Question[];
};

type SurveyContextType = {
  survey: SurveyData | null;
  loading: boolean;
  submitSurvey: (
    answers: { [key: number]: any },
    files: File[],
    user_id: string,
    survey_id: string
  ) => Promise<void>;
};

const SurveyContext = createContext<SurveyContextType | null>(null);

export const SurveyProvider = ({ children }: { children: React.ReactNode }) => {
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSurvey = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${server_url}/api/questions`);
      const data = await res.json();
      const formattedSurvey = {
        survey_title: data.questions[0]?.survey_title || "Survey",
        survey_description: data.questions[0]?.survey_description || "",
        questions: data.questions
          .map((q: any) => q.question)
          .sort((a: any, b: any) => a.id - b.id),
      };
      setSurvey(formattedSurvey);
    } catch (err) {
      console.error("Error fetching survey:", err);
      toast.error("Failed to load survey.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurvey();
  }, []);

  const submitSurvey = async (
    answers: { [key: number]: any },
    files: File[],
    user_id: string,
    survey_id: string
  ) => {
    const formData = new FormData();
    formData.append("survey_id", survey_id);
    formData.append("user_id", user_id);

    Object.keys(answers).forEach((key) => {
      formData.append(`q_${key}`, answers[+key]);
    });

    files.forEach((file) => {
      formData.append("certificates", file);
    });

    try {
      const res = await fetch(`${server_url}/api/questions/responses`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit");

      toast.success("Survey submitted successfully");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Error submitting survey");
    }
  };

  return (
    <SurveyContext.Provider value={{ survey, loading, submitSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurveyContext = () => {
  const context = useContext(SurveyContext);
  if (!context)
    throw new Error("useSurveyContext must be used within a SurveyProvider");
  return context;
};
