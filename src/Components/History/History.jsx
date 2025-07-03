import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserHistoryManually,
  deleteHistoryEntryManually, // Import new action for single delete
  clearAllHistoryManually, // Import new action for clear all
} from "../../Features/history/historySlice"; // Adjust path as needed

function History() {
  const dispatch = useDispatch();
  const userHistory = useSelector((state) => state.history.userHistory);
  const status = useSelector((state) => state.history.status); // 'idle', 'loading', 'succeeded', 'failed', 'needs-refresh', 'deleting', 'clearing'
  const error = useSelector((state) => state.history.error);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false); // State for clear all confirmation modal

  // Fetch history on component mount or when it needs refresh
  useEffect(() => {
    fetchUserHistoryManually(dispatch);
  }, []);

  if (status === "loading" || status === "deleting" || status === "clearing") {
    if (status === "clearing") {
      return (
        <div className="loader flex justify-center flex-col items-center">
          <div className="panWrapper">
            <div className="pan">
              <div className="food"></div>
              <div className="panBase"></div>
              <div className="panHandle"></div>
            </div>
            <div className="panShadow"></div>
          </div>
          <div className="mt-6">Clearing History...</div>
        </div>
      );
    }
    return (
      <div className="loader">
          <div className="panWrapper">
            <div className="pan">
              <div className="food"></div>
              <div className="panBase"></div>
              <div className="panHandle"></div>
            </div>
            <div className="panShadow"></div>
          </div>
        </div>
    );
  }

  if (status === "failed") {
    return (
      <strong className="text-center text-red-600 text-lg py-10">
        Error: {error}
      </strong>
    );
  }

  // Handles deleting a single entry from history
  const handleDeleteEntry = (idToDelete) => {
    dispatch(deleteHistoryEntryManually(dispatch, idToDelete));
  };

  // Prepares to show the clear all confirmation modal
  const handleClearAllHistoryClick = () => {
    setShowClearAllConfirm(true);
  };

  // Confirms and clears all history
  const confirmClearAllHistory = () => {
    setShowClearAllConfirm(false);
    // Dispatch the async action to clear all from backend and update Redux state
    dispatch(clearAllHistoryManually(dispatch));
  };

  // Cancels clearing all history
  const cancelClearAllHistory = () => {
    setShowClearAllConfirm(false);
  };

  return (
    <>
      <div className="container bg-white mt-[14vh] p-8 rounded-2xl shadow-xl max-w-4xl w-full flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Classification History
        </h1>

        {userHistory.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No classification history available yet. Start analyzing some
            images!
          </p>
        ) : (
          <>
            <button
              className="clear-history-button bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors self-center mb-6"
              onClick={handleClearAllHistoryClick}
              disabled={status === "deleting" || status === "clearing"} // Disable while operations are ongoing
            >
              {status === "clearing" ? "Clearing..." : "Clear All History"}
            </button>
            <div className="history-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userHistory.map((entry) => {
                const classificationText = String(entry.diseaseDetected || "");
                const isHealthy = classificationText
                  .toLowerCase()
                  .includes("healthy");
                const imageDataUrl = `data:image/jpeg;base64,${entry.base64Image}`; // Use imageUrl from backend response
                return (
                  <div
                    key={entry._id}
                    className="history-item bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col relative overflow-hidden"
                  >
                    <div className="history-item-details mb-3">
                      <p className="text-gray-700 text-sm mb-1">
                        <strong className="text-gray-900">Date:</strong>{" "}
                        {new Date(
                          entry.classificationDate
                        ).toLocaleDateString()}{" "}
                        {/* Format date */}
                      </p>
                      <p className="text-gray-700 text-sm mb-1">
                        <strong className="text-gray-900">
                          Original File:
                        </strong>{" "}
                        {entry.originalFileName}
                      </p>
                      <p className="text-gray-700 text-sm mb-1">
                        <strong className="text-gray-900">Result:</strong>{" "}
                        <span
                          className={`font-semibold ${
                            isHealthy ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {entry.diseaseDetected} 🥔
                        </span>
                      </p>
                      {entry.confidence && (
                        <p className="text-gray-700 text-sm">
                          <strong className="text-gray-900">Confidence:</strong>{" "}
                          {entry.confidence.toFixed(2)} %{" "}
                        </p>
                      )}
                    </div>
                    {entry.base64Image && ( // Use imageUrl from backend
                      <div className="history-item-image flex justify-center items-center mb-3 min-h-[150px] bg-white rounded-md overflow-hidden border border-gray-100">
                        <img
                          src={imageDataUrl} // Key part for displaying Base64
                          alt={`Classified: ${entry.diseaseDetected}`}
                          className="max-w-full max-h-[150px] object-contain rounded-md"
                        />
                      </div>
                    )}
                    <button
                      className="delete-button absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center text-xs font-bold hover:bg-red-600 transition-colors"
                      onClick={() => handleDeleteEntry(entry._id)} // Use entry._id
                      aria-label="Delete history entry"
                      disabled={status === "deleting" || status === "clearing"} // Disable during operations
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Clear All History Confirmation Modal */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Clear History
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to clear all classification history?{" "}
              <br></br> <strong>This action cannot be undone.</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelClearAllHistory}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={status === "clearing"}
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAllHistory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                disabled={status === "clearing"}
              >
                {status === "clearing" ? "Clearing..." : "Clear All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default History;