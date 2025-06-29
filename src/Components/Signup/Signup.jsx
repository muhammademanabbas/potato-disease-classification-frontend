import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Assuming react-router-dom is set up for routing
import { Mail, Lock, Eye, EyeOff, User } from "../Icons/Icons";
import Button from "../Button/Button";
import { login } from "../../Features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleError, handleSuccess } from "../../utils";
import { setToken } from "../../Token/token";

const Signup = () => {
  // Renamed from Login to App for standalone preview
  // State variables for form fields
  const [name, setName] = useState(""); // New state for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility
  // State for showing success/error messages
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'success' or 'error'
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedInReduxState = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    console.log("Redux isLoggedIn state changed to:", isLoggedInReduxState);
  }, [isLoggedInReduxState]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessage({ text: "", type: "" }); // Clear previous messages
    setIsLoading(true); // Show loading indicator

    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      // Added confirmPassword to initial check
      setMessage({ text: "Please fill in all fields.", type: "error" });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: "error" });
      setIsLoading(false);
      return;
    }

    try {
      const url = import.meta.env.VITE_AUTH_USER_SIGN_UP;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      console.log(response)

      const result = await response.json();
      console.log("API Response:", result); // More descriptive console log

      const { success, message, error, Token } = result; // Removed `name` from destructuring as it's already a state variable

      if (success) {
        setToken(Token); // If setToken only takes the token

        localStorage.setItem("isLoggedIn", "true"); // Directly set localStorage based on successful login
        dispatch(login(true)); // Dispatch login action with true, indicating user is logged in
        handleSuccess(message || "Registration successful!"); // Provide a default message if API message is missing

        setTimeout(() => {
          navigate("/");
           setIsLoading(false);

        }, 1000);
      } else if (error) {
        console.error("API Error:", error); // Use console.error for errors
        // Improved error handling based on typical API error structures
        const errorMessage =
          error.details && error.details.length > 0
            ? error.details[0].message
            : error.message || "An unknown error occurred during registration.";
        handleError(errorMessage);
         setIsLoading(false);
      } else {
        // This covers cases where success is false but no explicit error object is present
        handleError(message || "Registration failed. Please try again.");
         setIsLoading(false);
      }
    } catch (err) {
      console.error("Network or unexpected error:", err); // Log the full error object
      handleError("A network error occurred. Please try again later."); // Generic error message for network issues
      setIsLoading(false);
    } finally {
      setIsLoading(false); // Ensure loading indicator is hidden after API call completes (success or failure)
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border mt-[14vh] border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
      <div className="text-3xl font-extrabold text-gray-800 text-start mb-6">
        Create Your Account
      </div>
      <p className="text-start text-gray-600 mb-8 mt-[-4vh]">
        Sign up to get started!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="sr-only">
            Full Name
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User /> {/* User Icon */}
            </div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail /> {/* Email Icon */}
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock /> {/* Lock Icon */}
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 -mr-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock /> {/* Lock Icon */}
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1 -mr-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`p-3 text-sm rounded-lg ${
              message.type === "error"
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
            role={message.type === "error" ? "alert" : "status"}
          >
            {message.text}
          </div>
        )}

        {/* Submit Button */}
        <div>
          <Button
            text="Sign Up"
            loadingText="Signing Up..."
            isLoading={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleSubmit}
          />
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-green-700 hover:text-green-800 transition-colors duration-200"
          >
            Log In Here!
          </Link>
        </p>
      </div>
      
    </div>
  );
};

export default Signup;