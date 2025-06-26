import { useState, useEffect } from 'react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showClearAllConfirm, setShowClearAllConfirm] = useState(false); // State for clear all confirmation modal

    useEffect(() => {
        // Load history from localStorage when the component mounts
        try {
            const storedHistory = JSON.parse(localStorage.getItem('potatoLeafHistory'));
            if (storedHistory) {
                setHistory(storedHistory);
            }
        } catch (e) {
            console.error("Error loading history from localStorage:", e);
            // Optionally display an error to the user
        }
        setLoading(false);
    }, []); // Empty dependency array means this runs once on mount

    // Handles deleting a single entry from history
    const handleDeleteEntry = (idToDelete) => {
        const updatedHistory = history.filter(entry => entry.id !== idToDelete);
        setHistory(updatedHistory);
        localStorage.setItem('potatoLeafHistory', JSON.stringify(updatedHistory));
    };

    // Prepares to show the clear all confirmation modal
    const handleClearAllHistoryClick = () => {
        setShowClearAllConfirm(true);
    };

    // Confirms and clears all history
    const confirmClearAllHistory = () => {
        setHistory([]);
        localStorage.removeItem('potatoLeafHistory');
        setShowClearAllConfirm(false);
    };

    // Cancels clearing all history
    const cancelClearAllHistory = () => {
        setShowClearAllConfirm(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen p-5 bg-green-100 font-inter">
                <div className="text-lg text-gray-700">Loading history...</div>
            </div>
        );
    }

    return (
        <>
            <div className="container bg-white mt-[14vh] p-8 rounded-2xl shadow-xl max-w-4xl w-full flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
                    Classification History
                </h1>

                {history.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No classification history available yet. Start analyzing some images!</p>
                ) : (
                    <>
                        <button
                            className="clear-history-button bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors self-center mb-6"
                            onClick={handleClearAllHistoryClick}
                        >
                            Clear All History
                        </button>
                        <div className="history-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map((entry) => (
                                <div key={entry.id} className="history-item bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col relative overflow-hidden">
                                    <div className="history-item-details mb-3">
                                        <p className="text-gray-700 text-sm mb-1">
                                            <strong className="text-gray-900">Date:</strong> {new Date(entry.timestamp).toLocaleString()}
                                        </p>
                                        <p className="text-gray-700 text-sm mb-1">
                                            <strong className="text-gray-900">Original File:</strong> {entry.originalFileName}
                                        </p>
                                        <p className="text-gray-700 text-sm mb-1">
                                            <strong className="text-gray-900">Result:</strong>{' '}
                                            <span className={`font-semibold ${entry.classificationResult.toLowerCase().includes('healthy') ? 'text-green-600' : 'text-red-600'}`}>
                                                {entry.classificationResult} 🥔
                                            </span>
                                        </p>
                                        {entry.confidence && (
                                            <p className="text-gray-700 text-sm">
                                                <strong className="text-gray-900">Confidence:</strong> {entry.confidence} %
                                            </p>
                                        )}
                                    </div>
                                    {entry.imageURL && (
                                        <div className="history-item-image flex justify-center items-center mb-3 min-h-[150px] bg-white rounded-md overflow-hidden border border-gray-100">
                                            <img
                                                src={entry.imageURL}
                                                alt={`Classified: ${entry.classificationResult}`}
                                                className="max-w-full max-h-[150px] object-contain rounded-md"
                                            />
                                        </div>
                                    )}
                                    <button
                                        className="delete-button absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center text-xs font-bold hover:bg-red-600 transition-colors"
                                        onClick={() => handleDeleteEntry(entry.id)}
                                        aria-label="Delete history entry"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Clear All History Confirmation Modal */}
            {showClearAllConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Clear History</h3>
                        <p className="text-gray-700 mb-6">Are you sure you want to clear all classification history? This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelClearAllHistory}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmClearAllHistory}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default History;