import React, { useState, useEffect } from "react";
import { server_url } from "../../config.json";
import Loader from "../components/Loader";
import { FaDownload, FaEye } from "react-icons/fa";

interface Certificate {
  id: number;
  file_url: string;
  file_name: string;
}

interface QuestionResponse {
  [key: string]: any;
  response_id: number;
  certificates: Certificate[];
  date_responded: string;
}

interface PaginatedResponse {
  question_responses: QuestionResponse[];
  current_page: number;
  last_page: number;
  page_size: number;
  total_count: number;
}

const SurveyResponses: React.FC = () => {
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [emailFilter, setEmailFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchResponses();
  }, [currentPage, emailFilter]);

  // Fetch responses from the server
  const fetchResponses = async () => {
    setLoading(true);
    try {
      const url = new URL(`${server_url}/api/questions/responses`);
      url.searchParams.append("page", currentPage.toString());
      if (emailFilter) url.searchParams.append("email_address", emailFilter);

      const response = await fetch(url.toString());
      const data: PaginatedResponse = await response.json();
      setResponses(data.question_responses);
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

  return (
    <div className="container mx-auto my-4 md:my-6">
      <h1 className="text-[#0190B0] font-semibold text-xl mb-2">
        Survey Responses
      </h1>

      <div className="mb-4 flex items-center">
        <p className="whitespace-nowrap w-fit pr-2 font-semibold text-md">Filter by Email:</p>
        <input
          type="text"
          placeholder="Enter Email"
          value={emailFilter}
          onChange={handleEmailFilterChange}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <Loader />
        </div>
      ) : (
        <div className="bg-white p-5 border border-gray-300 shadow-md">
          <div className="space-y-4">
            {responses.map((response) => (
              <div
                key={response.response_id}
                className="p-4 border border-gray-200 "
              >
                {Object.entries(response).map(([key, value]) => {
                  if (key === "certificates" || key === "response_id")
                    return null;
                  return (
                    <p key={key}>
                      <strong className="capitalize">
                        {key.replace(/_/g, " ")}:
                      </strong>{" "}
                      {value}
                    </p>
                  );
                })}

                <div className="mt-2">
                  <strong>Certificates:</strong>
                  <ul className="list-disc ml-6 space-y-1">
                    {response.certificates.map((cert: Certificate) => (
                      <li key={cert.id} className="flex  items-center gap-2">
                        <span>{cert.file_name}</span>
                        <a
                          href={cert.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaEye className="w-5 h-5 text-blue-600 hover:text-blue-800" />
                        </a>
                        <a
                          href={`${server_url}/api/questions/responses/certificates/${cert.id}`}
                          download={cert.file_name}
                          className="buttonDownload"
                        >
                          Download
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => handlePagination(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePagination(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponses;
