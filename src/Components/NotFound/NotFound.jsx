import { Link } from "react-router-dom";
import { HomeIcon } from "../Icons/Icons"

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
        <HomeIcon />
        Go to Homepage
      </Link>
    </div>
  );
}
export default NotFound;