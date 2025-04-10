import React, { useState, useEffect } from 'react';
import { server_url } from '../../config.json';

interface Certificate {
  id: number;
  name: string;
}

interface QuestionResponse {
  response_id: number;
  full_name: string;
  email_address: string;
  description: string;
  gender: string;
  programming_stack: string;
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
  const [emailFilter, setEmailFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchResponses();
  }, [currentPage, emailFilter]);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${server_url}/api/questions/responses`);
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

  const handleEmailFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailFilter(event.target.value);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Survey Responses</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by Email"
          value={emailFilter}
          onChange={handleEmailFilterChange}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="space-y-4">
            {responses.map((response) => (
              <div key={response.response_id} className="p-4 border border-gray-200 rounded-lg shadow-md">
                <h2 className="font-semibold text-xl">{response.full_name}</h2>
                <p><strong>Email:</strong> {response.email_address}</p>
                <p><strong>Description:</strong> {response.description}</p>
                <p><strong>Gender:</strong> {response.gender}</p>
                <p><strong>Programming Stack:</strong> {response.programming_stack}</p>

                <div className="mt-2">
                  <strong>Certificates:</strong>
                  <ul>
                    {response.certificates.map((cert) => (
                      <li key={cert.id}>{cert.name}</li>
                    ))}
                  </ul>
                </div>

                <p className="mt-2"><strong>Date Responded:</strong> {response.date_responded}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePagination(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResponses;
