import Link from "next/link";
import React from "react";

const LandingPage = () => {
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Link
          href="/login"
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
