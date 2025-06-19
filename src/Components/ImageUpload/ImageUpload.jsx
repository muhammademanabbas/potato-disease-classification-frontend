import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link

const StartAnalysis = () => {
    // State variables for managing the component's UI and data
    const [selectedFile, setSelectedFile] = useState(null); // Stores the selected image file
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // Stores the URL for image preview
    const [prediction, setPrediction] = useState("No file selected."); // For classification result from backend
    const [accuracy, setAccuracy] = useState("N/A"); // For accuracy from backend
    const [isLoading, setIsLoading] = useState(false); // Controls the visibility of the loading spinner
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Controls the enabled/disabled state of the classify button
    const [apiResponseData, setApiResponseData] = useState(null); // State to store the full API response
    const [showModal, setShowModal] = useState(false); // State for custom alert modal
    const [modalMessage, setModalMessage] = useState(""); // Message for the custom alert modal
    const [isDraggingOver, setIsDraggingOver] = useState(false); // New state to track drag over

    const fileInputRef = useRef(null); // Create a ref for the file input

    // Function to show custom modal
    const showCustomModal = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    // Function to hide custom modal
    const hideCustomModal = () => {
        setShowModal(false);
        setModalMessage("");
    };

    // useEffect hook to handle file selection and generate preview URL
    useEffect(() => {
        if (selectedFile) {
            const reader = new FileReader(); // Create a new FileReader instance
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result); // Set the image preview URL
                setIsButtonDisabled(false); // Enable the classify button once an image is loaded
                setPrediction("Ready for prediction"); // Update status
                setAccuracy("N/A"); // Reset accuracy
                setApiResponseData(null); // Clear previous API response
            };
            reader.readAsDataURL(selectedFile); // Read the selected file as a data URL
        } else {
            setImagePreviewUrl(null); // Clear image preview if no file is selected
            setIsButtonDisabled(true); // Disable the button
            setPrediction("No file selected."); // Reset prediction text
            setAccuracy("N/A"); // Reset accuracy
            setApiResponseData(null); // Clear API response
        }
    }, [selectedFile]); // This effect runs whenever `selectedFile` changes

    // Saves a classification entry to localStorage
    const saveClassificationToHistory = (imageSrc, fileName, result, confidence) => {
        const newEntry = {
            id: Date.now().toString(), // Simple unique ID based on timestamp
            timestamp: new Date().toISOString(), // ISO string for easy sorting and display
            imageURL: imageSrc, // Base64 string of the image for preview
            originalFileName: fileName,
            classificationResult: result,
            confidence: confidence,
        };

        // Get existing history from localStorage, or initialize an empty array
        const existingHistory = JSON.parse(localStorage.getItem('potatoLeafHistory')) || [];

        // Add the new entry to the beginning of the array (most recent first)
        const updatedHistory = [newEntry, ...existingHistory];

        // Save updated history back to localStorage
        try {
            localStorage.setItem('potatoLeafHistory', JSON.stringify(updatedHistory));
        } catch (e) {
            // Handle potential localStorage full errors
            console.error("Error saving to localStorage:", e);
            showCustomModal("Could not save classification history. Storage might be full.");
        }
    };

    // Handler for when a file is selected via input or drag-and-drop
    const handleFileChange = (file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file); // Set the selected file
        } else {
            setSelectedFile(null); // Clear selected file if not an image
            showCustomModal("Please upload a valid image file (JPG, PNG, JPEG)."); // Use custom modal
        }
    };

    // Handler for the file input change event
    const onImageUploadChange = (event) => {
        handleFileChange(event.target.files[0]);
    };

    // Handlers for drag-and-drop functionality
    const handleDragOver = (event) => {
        event.preventDefault(); // Prevent default drag behavior
        setIsDraggingOver(true); // Set dragging state to true
    };

    const handleDragLeave = (event) => {
        event.preventDefault(); // Prevent default drag behavior
        setIsDraggingOver(false); // Set dragging state to false
    };

    const handleDrop = (event) => {
        event.preventDefault(); // Prevent default drop behavior
        setIsDraggingOver(false); // Set dragging state to false
        handleFileChange(event.dataTransfer.files[0]); // Handle the dropped file
        if (fileInputRef.current) {
            fileInputRef.current.files = event.dataTransfer.files;
        }
    };

    // Classification logic (integrated from user's provided predictHandler)
    const classifyImage = async () => {
        const file = selectedFile; // Get the selected file from the state

        if (file) {
            setIsLoading(true); // Set loading state to true
            setPrediction("Predicting..."); // Provide immediate feedback
            setAccuracy("...");
            setApiResponseData(null); // Clear previous API response

            let formData = new FormData();
            formData.append("file", file); // Append the file to FormData for API submission

            try {
                // IMPORTANT: For local development within Canvas, 'localhost' often won't work
                // due to iframe security. You'll typically need a deployed backend URL or a
                // mock API that is publicly accessible.
                // const apiUrl = "http://localhost:8000/predict"; // Your backend API URL
                const apiUrl = "https://potato-disease-classification-server.streamlit.app/"; // Your backend API URL


                const response = await fetch(apiUrl, {
                    method: "POST",
                    body: formData, // FormData automatically sets the correct 'Content-Type' header
                });

                if (response.ok) {
                    const result = await response.json(); // Parse the JSON response from the API
                    setApiResponseData(result); // Store the raw API response

                    const predictedDisease = result.prediction || "Unknown Disease";
                    const confidenceScore = result.accuracy ? (result.accuracy * 100).toFixed(2) : "N/A";

                    setPrediction(predictedDisease);
                    setAccuracy(confidenceScore);

                    console.log("API response:", result);

                    // --- Save to History after successful prediction ---
                    // Use imagePreviewUrl which is the Base64 representation of the image
                    saveClassificationToHistory(
                        imagePreviewUrl,
                        file.name,
                        predictedDisease,
                        confidenceScore
                    );
                    // --- End History Save ---

                } else {
                    const errorText = await response.text(); // Get error message from response
                    console.log("Catch")
                    console.error(`API Error: ${response.status} - ${errorText}`);
                    setPrediction("Prediction failed!");
                    setAccuracy(`Error: ${response.status}`);
                    showCustomModal(`Prediction failed: ${response.status} - ${errorText.substring(0, 100)}...`);
                }
            } catch (error) {
                console.error("Network or unexpected error during prediction:", error);
                setPrediction("Network/Unknown Error!");
                setAccuracy("Error");
                showCustomModal("A network error occurred. Please check your connection or try again later.");
            } finally {
                setIsLoading(false); // Reset loading state
            }
        } else {
            console.log("No file selected for prediction.");
            setPrediction("No file selected.");
            setAccuracy("N/A");
            setIsLoading(false);
            setApiResponseData(null);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen p-5 bg-green-100 sm:p-10 font-inter">
            <div className="container bg-white mt-[14vh] p-8 rounded-2xl shadow-xl max-w-xl w-full flex flex-col gap-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-gray-800 text-center flex-grow">
                        Potato Leaf Disease Classifier
                    </h1>
                    {/* History Link */}
                    <Link
                        to="/history"
                        className="flex items-center gap-1 text-green-700 transition-colors duration-200 px-3 py-1 rounded-md border border-green-700 hover:bg-green-700 hover:text-white hover:border-green-700"
                        title="View Classification History"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        <span className="text-sm font-semibold hidden sm:inline">History</span>
                    </Link>
                </div>

                {/* File Upload Section */}
                <div
                    className={`file-input-wrapper relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ease-in-out
                        ${isDraggingOver
                            ? 'animated-drag-border' // Apply custom animated class when dragging over
                            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()} // Use ref to click hidden input
                >
                    {/* Inline style block for animation, rendered conditionally */}
                    {isDraggingOver && (
                        <style>
                            {`
                            @keyframes border-dash-move {
                                to {
                                    background-position: 100% 0, -100% 100%, 0 -100%, 100% 100%;
                                }
                            }

                            .animated-drag-border {
                                border: none !important; /* Override default border to use background-image */
                                background-image: linear-gradient(90deg, #22c55e 50%, transparent 50%), /* Top border */
                                                  linear-gradient(90deg, #22c55e 50%, transparent 50%), /* Bottom border */
                                                  linear-gradient(0deg, #22c55e 50%, transparent 50%),  /* Left border */
                                                  linear-gradient(0deg, #22c55e 50%, transparent 50%); /* Right border */
                                background-size: 20px 2px, 20px 2px, 2px 20px, 2px 20px; /* Size of dashes and spacing */
                                background-repeat: repeat-x, repeat-x, repeat-y, repeat-y; /* Repeat across edges */
                                /* Initial positions for each background-image to form the border */
                                background-position: 0 0, 0 100%, 0 0, 100% 0;
                                animation: border-dash-move 3s linear infinite; /* Apply animation - CHANGED from 1s to 3s */
                                box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.5); /* Green glow effect */
                                border-radius: 0.75rem; /* Match parent rounded-xl */
                            }
                            `}
                        </style>
                    )}
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={onImageUploadChange}
                        ref={fileInputRef} // Attach ref here
                        className="hidden" // Hide the default input
                    />
                    <p className="text-gray-600">
                        Drag & drop an image or{' '}
                        <span className="text-green-600 font-medium">click to upload</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Supports JPG, PNG, JPEG</p>
                </div>

                {/* Image Preview Section */}
                {imagePreviewUrl && (
                    <div className="image-preview-container flex justify-center items-center bg-gray-50 rounded-lg p-2 shadow-sm border border-gray-200">
                        <img
                            src={imagePreviewUrl}
                            alt="Selected Leaf"
                            className="preview-image max-w-full max-h-72 object-contain rounded-md"
                        />
                    </div>
                )}

                {/* Prediction and Accuracy Display */}
                <div className="flex flex-wrap justify-center mt-2 mb-4 text-lg gap-4">
                    <p className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                        <span className="font-bold text-gray-700">Prediction: </span>
                        {prediction}
                    </p>
                    <p className="bg-white p-3 rounded-xl shadow-sm border border-gray-200">
                        <span className="font-bold text-gray-700">Accuracy: </span>
                        {accuracy}{apiResponseData?.accuracy ? "%" : ""}
                    </p>
                </div>

                {/* Classification Button */}
                <button
                    onClick={classifyImage}
                    disabled={isButtonDisabled || isLoading}
                    className="btn-primary bg-green-700 text-white py-3 px-6 rounded-xl font-semibold cursor-pointer transition-all duration-200 ease-in-out hover:bg-green-800 active:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                >
                    {isLoading ? 'Processing...' : 'Classify Image'}
                </button>

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="text-green-600 text-lg mb-2 text-center animate-pulse flex items-center justify-center">
                        <div className="loader border-4 border-t-4 border-green-500 rounded-full w-6 h-6 mr-2"></div>
                        Processing image...
                    </div>
                )}

                {/* Raw API Response Display (for debugging) */}
                {apiResponseData && (
                    <div className="mt-4 w-full bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                            Raw API Response:
                        </h3>
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-2 rounded overflow-x-auto border border-gray-100">
                            {JSON.stringify(apiResponseData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            {/* Custom Modal for Alerts */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Alert</h3>
                        <p className="text-gray-700 mb-6">{modalMessage}</p>
                        <button
                            onClick={hideCustomModal}
                            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StartAnalysis;
