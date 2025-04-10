import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

type Option = {
  id: number;
  value: string;
};

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
  id: number;
  survey_title: string;
  survey_description?: string;
  questions: Question[];
};

type SurveyContextType = {
  survey: SurveyData | null;
  loading: boolean;
  submitSurvey: (
    answers: { [key: number]: any },
    files: File[]
  ) => Promise<void>;
};

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider = ({ children }: { children: React.ReactNode }) => {
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/surveys/6");
        const data = await res.json();
        setSurvey(data);
      } catch (err) {
        toast.error("Failed to load survey");
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, []);

  const submitSurvey = async (
    answers: { [key: number]: any },
    files: File[]
  ) => {
    const formData = new FormData();
    formData.append("survey_id", "6");
    formData.append("user_id", "5");

    Object.entries(answers).forEach(([key, value]) => {
      formData.append(`q_${key}`, value);
    });

    files.forEach((file) => {
      formData.append("certificates", file);
    });

    try {
      const response = await fetch(`http://localhost:5000/api/questions/responses`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        toast.success("Survey submitted successfully");
      } else {
        toast.error("Failed to submit survey");
      }
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Error submitting survey");
    }
  };

  return (
    <SurveyContext.Provider value={{ survey, loading, submitSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
};
