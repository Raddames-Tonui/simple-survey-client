import React, { useState, useEffect } from "react";
import { server_url } from "../../config.json";
import Loader from "../components/Loader";
import { FaDownload, FaEye } from "react-icons/fa";
import { useCookies } from "react-cookie";

interface Certificate {
  id: number;
  file_url: string;
  file_name: string;
}

interface SurveyResponse {
  response_id: number;
  certificates: Certificate[];
  date_responded: string;
  [key: string]: any;
}

interface PaginatedResponse {
  survey_responses: SurveyResponse[];
  current_page: number;
  last_page: number;
  page_size: number;
  total_count: number;
}

const SurveyResponses: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [cookies] = useCookies(["accessToken"]);
  const token = cookies.accessToken;

  useEffect(() => {
    fetchResponses();
  }, [currentPage, emailFilter]);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const url = new URL(`${server_url}/api/questions/responses`);
      url.searchParams.append("page", currentPage.toString());
      if (emailFilter) url.searchParams.append("email_address", emailFilter);

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch responses");
      }

      const data: PaginatedResponse = await response.json();
      setResponses(data.survey_responses);
      setCurrentPage(data.current_page);
      setTotalPages(data.last_page);
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };
  // console.log(responses)

  return (
    <div className="md:mb-5 h-auto md:w-[80vw] lg:w-[70vw]">
      <div className="">
        <h1 className="px-3 md:px-0 text-xl font-bold mb-4  mt-6 text-[#0190B0]">
          Survey Responses
        </h1>
        <hr className="text-[#0190B0] mb-4" />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <p className="px-3 md:px-0  whitespace-nowrap w-fit  font-semibold text-md">
          Filter by Email:
        </p>
        <input
          type="text"
          placeholder="Enter Email"
          value={emailFilter}
          onChange={handleEmailFilterChange}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Loader />
        </div>
      ) : (
        <div className="min-h-screen  bg-white p-5 border border-gray-300 ">
          <div className="space-y-4">
            {responses.map((response) => (
              <div
                key={response.response_id}
                className="p-4 border border-gray-200 hover:bg-gray-100"
              >
                {Object.entries(response).map(([key, value]) => {
                  if (key === "certificates" || key === "response_id")
                    return null;

                  return (
                    <p key={key}>
                      <strong className="capitalize">
                        {key.replace(/_/g, " ")}:{" "}
                        {/* replaces underscores with spaces in keys */}
                      </strong>{" "}
                      {key === "date_responded"
                        ? new Date(value).toLocaleString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : value?.toString()}
                    </p>
                  );
                })}

                {response.certificates?.length > 0 && (
                  <div className="mt-2">
                    <strong>Certificates:</strong>
                    <ul className="list-disc ml-6 space-y-1">
                      {response.certificates.map((cert) => (
                        <li
                          key={cert.id}
                          className="flex items-center gap-2 md:gap-4 font-semibold"
                        >
                          <span>{cert.file_name}</span>
                          <a
                            href={cert.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            <FaEye className="inline mr-1" />
                            View
                          </a>
                          <a
                            href={`${server_url}/api/questions/responses/certificates/${cert.id}`}
                            download={cert.file_name}
                            // className="buttonDownload"
                            className="text-green-600 hover:underline"
                          >
                            <FaDownload className="inline mr-1" />
                            Download
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handlePagination(currentPage - 1)}
                disabled={currentPage <= 1}
                className=" py-2 px-5 text-white  w-32 bg-[#00A5CB] hover:bg-[#0190B0] font-semibold   disabled:bg-gray-400"
              >
                Previous
              </button>
              <span className="font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePagination(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className=" py-2 px-5 text-white  w-32 bg-[#00A5CB] hover:bg-[#0190B0] font-semibold   disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponses;
