import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { server_url } from "../../config.json";
import { useCookies } from "react-cookie";

type Survey = {
  id: number;
  title: string;
  description: string;
  creator_id: number;
  date_created: string;
  date_modified: string;
  is_published: boolean;
};

const UserSurveysList = (): React.JSX.Element => {
  const [userSurveys, setUserSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;

  const fetchUserSurveys = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${server_url}/api/surveys/user-surveys`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUserSurveys(data.surveys);
      } else {
        console.error(data.message || "Failed to fetch user surveys.");
      }
    } catch (error) {
      console.error("Error fetching user surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSurveys();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader />
      </div>
    );
  }

  if (userSurveys.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center">
          <p className="text-[#0190B0] font-semibold text-lg">
            You haven’t created any surveys yet.
          </p>
          <button className="mt-5">
            <Link
              to="/survey/create"
              className="px-6 py-2 bg-[#0190B0] text-white rounded hover:bg-[#017f9c] transition"
            >
              Create Survey
            </Link>
          </button>
        </div>
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
    <div className="md:mb-5 h-auto md:w-[80vw] lg:w-[70vw]">
      <div className="">
        <h1 className="px-3 md:px-0 text-xl font-bold mb-4  mt-6 text-[#0190B0]">
          Your Surveys
        </h1>
        <hr className="text-[#0190B0] mb-4" />
      </div>

      <div className="bg-white p-6 min-h-[90vh] border border-gray-300">
        <div className=" grid md:grid-cols-3 gap-6 ">
          {userSurveys.map((survey, index) => (
            <div
              key={survey.id}
              className="rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-white"
            >
              <img
                src={surveyImages[index % surveyImages.length]}
                alt="Survey"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-1">{survey.title}</h2>
                {survey.description && survey.description.length > 100 ? (
                  <p className="text-sm text-gray-600 mb-2">
                    {survey.description.slice(0, 100)}...
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 mb-2">
                    {survey.description}
                  </p>
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
                  {/* Removed "Start Survey" button */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSurveysList;
