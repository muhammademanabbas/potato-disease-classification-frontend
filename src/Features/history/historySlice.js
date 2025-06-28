// import { createSlice } from '@reduxjs/toolkit';
// import { checkToken } from '../../Token/token'; // Assuming checkToken gets the token synchronously

// // Define the async function to fetch user history.
// // This function will now be called from your component or a custom middleware/thunk,
// // and it will manually dispatch Redux actions.
// const fetchUserHistoryManually = async (dispatch) => {
//   // Dispatch the pending action to set loading state
//   dispatch(historySlice.actions.fetchHistoryStart());

//   // Get the bearer token at the time of the request.
//   const bearerToken = checkToken();

//   if (!bearerToken) {
//     // If no token is found, dispatch a failure action immediately.
//     console.error("No bearer token found for fetching user history.");
//     dispatch(historySlice.actions.fetchHistoryFailure("Authentication token not found."));
//     return; // Exit the function
//   }

//   const apiUrl = import.meta.env.VITE_GET_USER_HISTORY_URL;

//   try {
//     const response = await fetch(apiUrl, {
//       method: "GET", // Or POST if your API requires a body for fetching history
//       headers: {
//         'Content-Type': 'application/json', // Typically for GET, though not strictly needed if no body
//         Authorization: `Bearer ${bearerToken}`,
//       },
//       // If your GET request needs a body, you would add it here:
//       // body: JSON.stringify({ /* your data */ }),
//     });

//     if (!response.ok) {
//       // If the response is not OK (e.g., 4xx or 5xx status codes)
//       const errorData = await response.json(); // Attempt to parse error details
//       console.error(
//         `Failed to fetch history. HTTP Status: ${response.status}`,
//         `Error details:`, errorData
//       );
//       // Dispatch the failure action with the error message
//       dispatch(historySlice.actions.fetchHistoryFailure(errorData.message || `Server error: ${response.status} ${response.statusText}`));
//       return; // Exit the function
//     }

//     const result = await response.json(); // Parse the successful response
//     console.log("History fetched successfully:", result);
//     // Dispatch the success action with the fetched data
//     dispatch(historySlice.actions.fetchHistorySuccess(result.history));
//   } catch (error) {
//     console.error("Error while fetching user history:", error);
//     // Dispatch the failure action for network errors or other exceptions
//     dispatch(historySlice.actions.fetchHistoryFailure(error.message || 'Network error occurred.'));
//   }
// };


// const historySlice = createSlice({
//   name: 'history',
//   initialState: {
//     userHistory: [], // Initialize as null or an empty array
//     status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' | 'needs-refresh'
//     error: null,
//   },
//   reducers: {
//     // Action to initiate fetching history
//     fetchHistoryStart: (state) => {
//       state.status = 'loading';
//       state.error = null; // Clear previous errors
//     },
//     // Action when history fetching is successful
//     fetchHistorySuccess: (state, action) => {
//       state.status = 'succeeded';
//       state.userHistory = action.payload; // The fetched data
//     },
//     // Action when history fetching fails
//     fetchHistoryFailure: (state, action) => {
//       state.status = 'failed';
//       state.error = action.payload; // The error message
//       state.userHistory = null; // Clear history on error if desired
//     },
//     // NEW ACTION: To explicitly mark history as needing a refresh
//     markHistoryForRefresh: (state) => {
//       state.status = 'needs-refresh';
//     },
//     // Synchronous reducers go here if needed, e.g., to clear history
//     clearUserHistory: (state) => {
//       state.userHistory = [];
//       state.status = 'idle';
//       state.error = null;
//     }
//   },
//   // extraReducers are not needed when not using createAsyncThunk
// });

// export const {
//   fetchHistoryStart,
//   fetchHistorySuccess,
//   fetchHistoryFailure,
//   markHistoryForRefresh, // Export the new action
//   clearUserHistory
// } = historySlice.actions; // Export all actions

// export { fetchUserHistoryManually }; // Export the async function

// export default historySlice.reducer;


import { createSlice } from '@reduxjs/toolkit';
import { checkToken } from '../../Token/token'; // Assuming checkToken gets the token synchronously

// Define the async function to fetch user history.
const fetchUserHistoryManually = async (dispatch) => {
    dispatch(historySlice.actions.fetchHistoryStart());
    const bearerToken = checkToken();

    if (!bearerToken) {
        console.error("No bearer token found for fetching user history.");
        dispatch(historySlice.actions.fetchHistoryFailure("Authentication token not found."));
        return;
    }

    const apiUrl = import.meta.env.VITE_GET_USER_HISTORY_URL; // Ensure this points to your backend route to get history

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                `Failed to fetch history. HTTP Status: ${response.status}`,
                `Error details:`, errorData
            );
            dispatch(historySlice.actions.fetchHistoryFailure(errorData.message || `Server error: ${response.status} ${response.statusText}`));
            return;
        }

        const result = await response.json();
        console.log("History fetched successfully:", result);
        dispatch(historySlice.actions.fetchHistorySuccess(result.history));
    } catch (error) {
        console.error("Error while fetching user history:", error);
        dispatch(historySlice.actions.fetchHistoryFailure(error.message || 'Network error occurred.'));
    }
};

// NEW ASYNC FUNCTION: Delete a single history entry
const deleteHistoryEntryManually = async (dispatch, historyId) => {
    dispatch(historySlice.actions.deleteEntryStart()); // Optional: Add a 'deleting' status if needed
    const bearerToken = checkToken();

    if (!bearerToken) {
        console.error("No bearer token found for deleting history entry.");
        dispatch(historySlice.actions.deleteEntryFailure("Authentication token not found.")); // Optional: specific failure action
        return;
    }

    // Assuming your backend delete endpoint is something like /api/history/:id
    const apiUrl = `${import.meta.env.VITE_CLEAR_ONE_HISTORY_ENTRY_URL}/${historyId}`; // <-- Define VITE_DELETE_HISTORY_URL in your .env

    try {
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                `Failed to delete history entry. HTTP Status: ${response.status}`,
                `Error details:`, errorData
            );
            dispatch(historySlice.actions.deleteEntryFailure(errorData.message || `Server error: ${response.status} ${response.statusText}`));
            return;
        }

        // If deletion is successful on backend, update the Redux state
        dispatch(historySlice.actions.deleteEntrySuccess(historyId));
        // You might want to also trigger a refresh to ensure data consistency
        dispatch(historySlice.actions.markHistoryForRefresh());

    } catch (error) {
        console.error("Error while deleting history entry:", error);
        dispatch(historySlice.actions.deleteEntryFailure(error.message || 'Network error occurred.'));
    }
};


// NEW ASYNC FUNCTION: Clear all history entries
const clearAllHistoryManually = async (dispatch) => {
    dispatch(historySlice.actions.clearAllHistoryStart()); // Optional: Add a 'clearing' status if needed
    const bearerToken = checkToken();

    if (!bearerToken) {
        console.error("No bearer token found for clearing all history.");
        dispatch(historySlice.actions.clearAllHistoryFailure("Authentication token not found.")); // Optional: specific failure action
        return;
    }

    // Assuming your backend clear all endpoint is something like /api/history/clear-all
    const apiUrl = import.meta.env.VITE_CLEAR_ALL_HISTORY_URL; // <-- Define VITE_CLEAR_ALL_HISTORY_URL in your .env

    try {
        const response = await fetch(apiUrl, {
            method: "DELETE", // Or POST, depending on your backend
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${bearerToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                `Failed to clear all history. HTTP Status: ${response.status}`,
                `Error details:`, errorData
            );
            dispatch(historySlice.actions.clearAllHistoryFailure(errorData.message || `Server error: ${response.status} ${response.statusText}`));
            return;
        }

        // If clearing is successful on backend, clear the Redux state
        dispatch(historySlice.actions.clearUserHistory()); // This clears the local state
        dispatch(historySlice.actions.markHistoryForRefresh()); // Mark for refresh to ensure consistent state

    } catch (error) {
        console.error("Error while clearing all history:", error);
        dispatch(historySlice.actions.clearAllHistoryFailure(error.message || 'Network error occurred.'));
    }
};


const historySlice = createSlice({
    name: 'history',
    initialState: {
        userHistory: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' | 'needs-refresh' | 'deleting' | 'clearing'
        error: null,
    },
    reducers: {
        fetchHistoryStart: (state) => {
            state.status = 'loading';
            state.error = null;
        },
        fetchHistorySuccess: (state, action) => {
            state.status = 'succeeded';
            state.userHistory = action.payload;
        },
        fetchHistoryFailure: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
            state.userHistory = []; // Clear history on error if desired
        },
        markHistoryForRefresh: (state) => {
            state.status = 'needs-refresh';
        },
        // Synchronous reducer to clear history from the Redux store
        clearUserHistory: (state) => {
            state.userHistory = [];
            state.status = 'succeeded'; // Set to succeeded after local clear (assuming API call was successful)
            state.error = null;
        },

        // NEW REDUCERS FOR DELETE SINGLE ENTRY
        deleteEntryStart: (state) => {
            state.status = 'deleting'; // Add a specific status for deleting
            state.error = null;
        },
        deleteEntrySuccess: (state, action) => {
            const idToDelete = action.payload;
            state.userHistory = state.userHistory.filter(entry => entry._id !== idToDelete); // Use _id from backend
            state.status = 'succeeded';
            state.error = null;
        },
        deleteEntryFailure: (state, action) => {
            state.status = 'failed'; // Or a more specific 'deleteFailed'
            state.error = action.payload;
        },

        // NEW REDUCERS FOR CLEAR ALL HISTORY
        clearAllHistoryStart: (state) => {
            state.status = 'clearing'; // Add a specific status for clearing
            state.error = null;
        },
        clearAllHistoryFailure: (state, action) => {
            state.status = 'failed'; // Or a more specific 'clearAllFailed'
            state.error = action.payload;
        },
    },
});

export const {
    fetchHistoryStart,
    fetchHistorySuccess,
    fetchHistoryFailure,
    markHistoryForRefresh,
    clearUserHistory,
    deleteEntryStart,
    deleteEntrySuccess,
    deleteEntryFailure,
    clearAllHistoryStart,
    clearAllHistoryFailure,
} = historySlice.actions;

export {
    fetchUserHistoryManually,
    deleteHistoryEntryManually, // Export the new async delete function
    clearAllHistoryManually,    // Export the new async clear all function
};

export default historySlice.reducer;