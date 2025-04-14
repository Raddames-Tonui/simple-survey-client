import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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
  survey_id?: number;
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
    survey_id: string,
    onSuccess?: () => void 
  ) => Promise<void>;
  fetchSurveyQuestions: (surveyId: string) => void;
};

const SurveyContext = createContext<SurveyContextType | null>(null);

export const SurveyProvider = ({ children }: { children: React.ReactNode }) => {
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchedSurveyIds, setFetchedSurveyIds] = useState<Set<string>>(
    new Set()
  ); // Keep track of fetched survey IDs

  // FETCH ALL EXISTING QUESTIONS
  const fetchSurvey = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${server_url}/api/questions`);
      const data = await res.json();

      const formattedSurvey: SurveyData = {
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

  // FETCH QUESTIONS OF A PARTICULAR SURVEY
  const fetchSurveyQuestions = useCallback(
    async (surveyId: string) => {
      if (fetchedSurveyIds.has(surveyId)) {
        // Skip fetching if the survey's questions have already been fetched
        console.log("Survey questions already fetched");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `${server_url}/api/survey/${surveyId}/questions`
        );
        const data = await res.json();

        if (res.status !== 200) {
          toast.error(data.error || "Failed to load survey questions.");
          return;
        }

        const formattedSurvey: SurveyData = {
          survey_title: data.survey_title || "Survey",
          survey_description: data.survey_description || "",
          questions: data.questions
            .map((q: any) => q.question)
            .sort((a: any, b: any) => a.id - b.id),
        };

        setSurvey(formattedSurvey);
        // Mark this survey as fetched
        setFetchedSurveyIds((prev) => new Set(prev).add(surveyId));
      } catch (err) {
        console.error("Error fetching survey questions:", err);
        toast.error("Failed to load survey questions.");
      } finally {
        setLoading(false);
      }
    },
    [fetchedSurveyIds]
  );

  // SUBMIT ANSWERS TO SURVEY
  const submitSurvey = async (
    answers: { [key: number]: any },
    files: File[],
    survey_id: string,
    onSuccess?: () => void // Add optional callback
  ) => {
    const formData = new FormData();
    formData.append("survey_id", survey_id);
  
    Object.entries(answers).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`q_${key}`, v));
      } else {
        formData.append(`q_${key}`, value);
      }
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
      if (onSuccess) onSuccess(); 
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Error submitting survey");
    }
  };
  

  return (
    <SurveyContext.Provider
      value={{ survey, loading, submitSurvey, fetchSurveyQuestions }}
    >
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
