import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { server_url } from "../../config.json";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

// Define the Survey type based on the data you expect from the API
type Survey = {
  id: number;
  title: string;
  description: string;
  creator_id: number;
  date_created: string;
  date_modified: string;
  is_published: boolean;
};

const SurveyList = (): JSX.Element => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch surveys from the API
  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${server_url}/api/surveys`);
      const data = await response.json();

      if (response.ok) {
        setSurveys(data.surveys);
      } else {
        toast.error(data.message || "Failed to fetch surveys.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching surveys.");
      console.error("Error fetching surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  if (surveys.length === 0) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p>No surveys found.</p>
      </div>
    );
  }

  const surveyImages = [
    "/images/survey1.png",
    "/images/survey2.png",
    "/images/survey3.png",
    "/images/survey4.png",
    "/images/survey5.png",
    "/images/survey6.png",
  ];

  return (
    <div className="mt-10 grid md:grid-cols-3 gap-6">
      {surveys.map((survey, index) => (
        <div
          key={survey.id}
          className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white"
        >
          <img
            src={surveyImages[index % surveyImages.length]}
            alt="Survey"
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-1">{survey.title}</h2>
            <p className="text-sm text-gray-600 mb-2">{survey.description}</p>
            <p className="text-xs text-gray-400 mb-1">
              Created: {new Date(survey.date_created).toLocaleDateString()}
            </p>
            <span
              className={`text-xs font-semibold ${
                survey.is_published ? "text-green-600" : "text-red-500"
              }`}
            >
              {survey.is_published ? "Active" : "Inactive"}
            </span>
            <Link to={`/survey/${survey.id}/questions/`}>
              <button className="mt-3 px-4 py-2 bg-[#0190B0] text-white text-sm rounded hover:bg-[#017a95] transition">
                Start Survey
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SurveyList;
