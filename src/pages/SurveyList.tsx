import { useEffect, useState } from "react";
import { server_url } from "../../config.json";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

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
        console.error(data.message || "Failed to fetch surveys.");
      }
    } catch (error) {
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
        <p className="text-[#0190B0] font-semibold text-lg">
          There is currently no active survey available at the moment.
        </p>
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
    <div className="mt-10 grid md:grid-cols-3 gap-6 ">
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
            {survey.description.length > 100 ? (
              <p className="text-sm text-gray-600 mb-2">
                {survey.description.slice(0, 100)}...
                <span className="text-blue-600 cursor-pointer ml-1 hover:underline">
                  Read more
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-2">{survey.description}</p>
            )}
            <p className="text-xs text-gray-400 mb-1">
              Created: {new Date(survey.date_created).toLocaleDateString()}
            </p>
            <div className="flex justify-between items-center">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  survey.is_published
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {survey.is_published ? "Active" : "Closed"}
              </span>

              {survey.is_published ? (
                <Link to={`/survey/${survey.id}/questions/`}>
                  <button className="px-4 py-2 bg-[#0190B0] text-white text-sm rounded hover:bg-[#017a95] transition">
                    Start Survey
                  </button>
                </Link>
              ) : (
                <span className="text-sm text-gray-500 italic">
                  Not Available
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SurveyList;
