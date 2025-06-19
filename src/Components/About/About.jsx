import { Link } from "react-router-dom";
// Lucide React icons via CDN. We'll simulate their usage since direct npm import isn't possible here.
// For a real React project, you would 'npm install lucide-react' and import normally.
// For this environment, we'll use inline SVGs or conceptual icons.

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      <div
        className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full mx-auto
                      transform transition-all duration-300 hover:scale-[1.01] mt-[20vh]"
      >
        {/* Left Section: Image/Visual */}
        <div className="relative h-64 lg:h-auto bg-green-500 flex items-center justify-center p-8 overflow-hidden rounded-l-2xl">
          {/* Placeholder image for a potato leaf */}
          <img
            src="https://placehold.co/600x400/9ade7b/ffffff?text=Healthy%20Leaf"
            alt="Healthy potato leaf"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400/9ade7b/ffffff?text=Image%20Not%20Found";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-700 via-green-600 to-transparent opacity-70 rounded-l-2xl"></div>
          <div className="relative z-10 text-white text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
              LeafScan AI
            </h2>
            <p className="mt-2 text-xl sm:text-2xl font-light opacity-90 drop-shadow">
              Empowering Farmers with Early Detection
            </p>
          </div>
        </div>

        {/* Right Section: Content */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          {/* About the Project */}
          <section className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 flex items-center">
              {/* Using inline SVG for icon as lucide-react direct import isn't feasible in this setup */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3 text-green-600"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2l4-4"></path>
              </svg>
              About the Project
            </h3>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              Our Potato Leaf Disease Classification project leverages the power
              of artificial intelligence to accurately identify common diseases
              affecting potato plants based on images of their leaves. This tool
              is designed to assist farmers and agricultural enthusiasts in
              early disease detection, enabling timely intervention and
              preventing significant crop losses.
            </p>
          </section>

          {/* Our Mission */}
          <section className="mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3 text-green-600"
              >
                <path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7.5c0 1.6.4 2.1 1.2 2.7l2.4 1.9c.7.6 1.7 1 2.8 1h5.8c1.1 0 2.1-.4 2.8-1l2.4-1.9c.8-.6 1.2-1.1 1.2-2.7V8Z"></path>
                <path d="M10 16a6 6 0 0 0 0-12v12Z"></path>
              </svg>
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
              Our mission is to provide an accessible, efficient, and reliable
              tool for diagnosing potato leaf diseases. By offering quick
              insights, we aim to contribute to sustainable agriculture, reduce
              pesticide usage, and ensure food security by protecting vital
              potato crops globally.
            </p>
          </section>

          {/* Technologies Used */}
          <section>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3 text-green-600"
              >
                <path d="M12 2v20"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.0 0 0 1 0 7H6"></path>
              </svg>
              Technologies Used
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-base sm:text-lg">
              <li>
                <span className="font-semibold">Frontend:</span> React.js for a
                dynamic and interactive user interface.
              </li>
              <li>
                <span className="font-semibold">Styling:</span> Tailwind CSS for
                responsive and utility-first styling.
              </li>
              <li>
                <span className="font-semibold">Machine Learning:</span>{" "}
                Utilizing a deep learning model (e.g., Convolutional Neural
                Networks built with TensorFlow/Keras) for image classification.
              </li>
              <li>
                <span className="font-semibold">Backend:</span> Python (<span className="font-semibold">FastAPI</span>) for serving the ML model and API endpoints.
              </li>
            </ul>
          </section>

          {/* Optional Call to Action */}
          <div className="mt-8 text-center">
            <Link
            to='/predict'
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full
                               shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out
                               focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:-translate-y-1"
            >
              Start Classification
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
                className="ml-2 inline-block"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7l-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
