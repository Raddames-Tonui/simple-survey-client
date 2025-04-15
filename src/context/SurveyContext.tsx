import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";
import { server_url } from "../../config.json";

// ---- TYPES ---- //
type Option = { id: number; value: string };

type Question = {
  id: number;
  name: string;
  text: string;
  type: string;
  description?: string;
  required: boolean;
  options?: Option[];
  survey_id?: number;
};

type SurveyData = {
  title: string;
  description?: string;
  questions: Question[];
};

type SurveyContextType = {
  survey: SurveyData | null;
  loading: boolean;
  submitSurvey: (
    answers: { [key: number]: any },
    files: File[],
    survey_id: string,
    email?: string,
    onSuccess?: () => void
  ) => Promise<void>;
  fetchSurveyQuestions: (surveyId: string) => void;
};

// ---- CONTEXT ---- //
const SurveyContext = createContext<SurveyContextType | null>(null);

export const SurveyProvider = ({ children }: { children: React.ReactNode }) => {
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchedSurveyIds, setFetchedSurveyIds] = useState<Set<string>>(
    new Set()
  );
  console.log(survey);

  // ---- FETCH SPECIFIC SURVEY BY ID ----
  const fetchSurveyQuestions = useCallback(
    async (surveyId: string) => {
      if (fetchedSurveyIds.has(surveyId)) {
        console.log("Survey already fetched.");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `${server_url}/api/questions/survey/${surveyId}`
        );
        const data = await res.json();

        if (res.status !== 200) {
          toast.error(data.error || "Survey not found.");
          return;
        }

        // Build frontend-friendly format
        const formattedSurvey: SurveyData = {
          title: data.title || "Survey",
          description: data.description || "",
          questions: (data.questions || []).sort(
            (a: any, b: any) => a.id - b.id
          ),
        };

        setSurvey(formattedSurvey);
        setFetchedSurveyIds((prev) => new Set(prev).add(surveyId));
      } catch (err) {
        console.error("Error fetching survey:", err);
        toast.error("Error loading survey.");
      } finally {
        setLoading(false);
      }
    },
    [fetchedSurveyIds]
  );

  // ---- SUBMIT SURVEY ---- //
  const submitSurvey = async (
    answers: { [key: number]: any },
    files: File[],
    survey_id: string,
    email?: string,
    onSuccess?: () => void
  ) => {
    const formData = new FormData();
    formData.append("survey_id", survey_id);
  
    if (email) {
      formData.append("email", email);
    }
  
    // Append answers
    Object.entries(answers).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`q_${key}`, v));
      } else {
        formData.append(`q_${key}`, value);
      }
    });
  
    // Append file uploads
    files.forEach((file) => {
      formData.append("certificates", file);
    });
  
    try {
      const res = await fetch(`${server_url}/api/questions/responses`, {
        method: "PUT",
        body: formData,
      });
  
      if (!res.ok) throw new Error("Failed to submit");
  
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Error submitting survey.");
    }
  };
  

  // ---- AUTO FETCH DEFAULT SURVEY (OPTIONAL) ---- //
  useEffect(() => {
    // Optional: you could call fetchSurveyQuestions("1") here
    setLoading(false); // Don't auto-fetch, just stop loading spinner
  }, []);

  return (
    <SurveyContext.Provider
      value={{
        survey,
        loading,
        submitSurvey,
        fetchSurveyQuestions,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

// ---- HOOK ---- //
export const useSurveyContext = () => {
  const context = useContext(SurveyContext);
  if (!context)
    throw new Error("useSurveyContext must be used within a SurveyProvider");
  return context;
};
