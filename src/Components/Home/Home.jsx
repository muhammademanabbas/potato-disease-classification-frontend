import { Link } from "react-router-dom";

const Home = () => {


  return (
    <>
      {/* Main container for the content */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-[90vw] lg:w-full lg:max-w-[70vw] text-center border border-gray-200 mt-[20vh]">
        {/* Header Section */}
        <h1 className="text-4xl font-extrabold text-green-700 mb-4 rounded-md">
          🥔 Potato Disease Classification 🥔
        </h1>
        

        {/* Description Section */}
        <p className="text-gray-700 text-lg mb-6 leading-relaxed font-semibold">
          Welcome to the home page of the Potato Disease Classification! This
          system is designed to leverage advanced machine learning models to
          accurately identify and classify various diseases affecting potato
          crops.
        </p>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed font-semibold">
          Quickly and accurately identify common potato leaf diseases:{" "}
          <span className="font-semibold text-red-600">Early Blight</span>,{" "}
          <span className="font-semibold text-red-800">Late Blight</span>, and{" "}
          <span className="font-semibold text-green-600">Healthy</span> leaves.
          Simply upload an image of a potato leaf to get started.
        </p>

        {/* Key Features Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Key Features:
          </h2>
          <ul className="list-disc list-inside text-left mx-auto max-w-md text-gray-600 space-y-2">
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>
                <strong>Accurate Disease Detection:</strong> Utilizes trained
                models for precise identification.
              </span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>
                <strong>Scalable Architecture:</strong> Built to handle varying
                loads efficiently.
              </span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>
                <strong>Easy Integration:</strong> Provides a robust API for
                seamless integration with frontend applications.
              </span>
            </li>
            <li className="flex items-center">
              <svg
                className="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>
                <strong>Continuous Improvement:</strong> Models are regularly
                updated with new data for enhanced performance.
              </span>
            </li>
          </ul>
        </div>

        {/* Getting Started Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Getting Started:
          </h2>
          <p className="text-gray-600 mb-4">
            To utilize this backend, your frontend application can send image
            data to the designated API endpoint. The backend will then process
            the image and return the predicted disease label and confidence
            score{" "}
            <Link
              to="/predict"
              className="text-green-600 hover:underline font-semibold"
            >
              Try it now.
            </Link>
          </p>
          <p className="text-gray-600">
            For API documentation and integration details, please refer to our
            comprehensive{" "}
            <Link
              to="https://github.com/muhammademanabbas?tab=repositories"
              className="text-green-600 hover:underline font-semibold"
            >
              documentation portal
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;