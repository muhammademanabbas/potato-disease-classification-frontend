import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "../Icons/Icons";
import Button from "../Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { handleError, handleSuccess } from "../../utils";
import { setToken } from "../../Token/token";
import { login } from "../../Features/auth/authSlice";

const Login = () => {
  // State variables for form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);
  // State for showing success/error messages
  const [message, setMessage] = useState({ text: "", type: "" }); // type: 'success' or 'error'
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage({ text: "", type: "" }); // Clear previous messages
  setIsLoading(true); // Show loading indicator

  // Basic validation
  if (!email || !password) {
    setMessage({
      text: "Please enter both email and password.",
      type: "error",
    });
    setIsLoading(false);
    return;
  }
  try {
    const url = import.meta.env.VITE_AUTH_USER_LOG_IN;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response) {
      const result = await response.json();
      console.log("handleSubmit (API Response Result):", result);
      const { success, message, error, Token, name } = result;

      if (success) {
        setToken(Token, name);
        handleSuccess(message);
        dispatch(login({name: result.name, email: result.email }))
        setTimeout(() => {
          navigate("/");
          setIsLoading(false);
        }, 1000);
      } else if (error) {
        console.log("handleSubmit (API Error Object):", error);
        const details = error?.details[0].message;
        handleError(details);
        setIsLoading(false);
      } else if (!success) {
        handleError(message);
        setIsLoading(false);
      }
    } else {
      console.error("handleSubmit (Network Error): No response received from API.");
      handleError("Network error: Could not connect to the server.");
      setIsLoading(false);
    }
  } catch (err) {
    // Improved error handling for network or unexpected issues
    console.error("handleSubmit (Catch Block Error):", err);
    handleError("An unexpected error occurred. Please try again.");
    setIsLoading(false);
  }
};

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border mt-[14vh] border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
      <div className="text-xl font-bold text-gray-800 text-start mb-6">
        Sign in to your account to continue
      </div>
      <p className="text-start text-gray-600 mb-8 mt-[-4vh]">
        Don't have an account?
        <Link
          className="text-green-700 hover:text-green-800 active:text-green-900 hover:underline"
          to={"/signup"}
        >
          Join Here!
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              type={showPassword ? "text" : "password"} // Toggle type based on showPassword state
              autoComplete="current-password"
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
                {showPassword ? <EyeOff /> : <Eye />}{" "}
                {/* Toggle Eye/EyeOff Icon */}
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
            text="Log In"
            loadingText="Logging in..."
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
            isLoading={isLoading}
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;