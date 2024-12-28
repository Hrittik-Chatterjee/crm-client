import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500">403 - Unauthorized</h1>
      <p className="mt-4 text-gray-700">
        You do not have permission to access this page.
      </p>
      <Link to="/" className="mt-6 text-blue-500 underline">
        Return to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
