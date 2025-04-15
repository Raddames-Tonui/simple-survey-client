import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NoPage = (): JSX.Element => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-[#0190B0] mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        The page you're looking for doesn't exist or the survey link is invalid.
      </p>
      {user ? (
        <>
          <Link
            to="/survey/user-surveys"
            className="px-6 py-2 bg-[#0190B0] text-white rounded hover:bg-[#017f9c] transition"
          >
            Go to Homepage
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/"
            className="px-6 py-2 bg-[#0190B0] text-white rounded hover:bg-[#017f9c] transition"
          >
            Go to Homepage
          </Link>
        </>
      )}
    </div>
  );
};

export default NoPage;
