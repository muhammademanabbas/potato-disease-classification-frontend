import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl w-full mx-auto
                      transform transition-all duration-300
                      p-8 sm:p-10 text-center hover:scale-105"
    >
      <h1 className="text-6xl sm:text-7xl font-extrabold text-green-600 mb-4 animate-bounce">
        404
      </h1>

      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
        Page Not Found
      </h2>

      <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-8">
        Oops! It looks like the page you're looking for doesn't exist. It might
        have been moved or removed.
      </p>

      <Link
        to="/"
        className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full
                     shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
                     focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:-translate-y-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Go to Homepage
      </Link>
    </div>
  );
}

export default NotFound;