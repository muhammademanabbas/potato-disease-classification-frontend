import { createSlice } from "@reduxjs/toolkit";
import { checkToken } from "../../Token/token";

// Define the async function to fetch user history.
const fetchUserHistoryManually = async (dispatch) => {
  dispatch(historySlice.actions.fetchHistoryStart());
  const bearerToken = checkToken();
  console.log(bearerToken)

  if (!bearerToken) {
    console.error("No bearer token found for fetching user history.");
    dispatch(
      historySlice.actions.fetchHistoryFailure(
        "Authentication token not found."
      )
    );
    return;
  }

  const apiUrl = import.meta.env.VITE_GET_USER_HISTORY_URL;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Failed to fetch history. HTTP Status: ${response.status}`,
        `Error details:`,
        errorData
      );
      dispatch(
        historySlice.actions.fetchHistoryFailure(
          errorData.message ||
            `Server error: ${response.status} ${response.statusText}`
        )
      );
      return;
    }

    const result = await response.json();
    console.log("History fetched successfully:", result);
    setTimeout(() => {
      dispatch(historySlice.actions.fetchHistorySuccess(result.history));
    }, 1500);
  } catch (error) {
    console.error("Error while fetching user history:", error);
    dispatch(
      historySlice.actions.fetchHistoryFailure(
        error.message || "Network error occurred."
      )
    );
  }
};

// NEW ASYNC FUNCTION: Delete a single history entry
const deleteHistoryEntryManually = async (dispatch, historyId) => {
  dispatch(historySlice.actions.deleteEntryStart()); // Optional: Add a 'deleting' status if needed
  const bearerToken = checkToken();

  if (!bearerToken) {
    console.error("No bearer token found for deleting history entry.");
    dispatch(
      historySlice.actions.deleteEntryFailure("Authentication token not found.")
    );
    return;
  }

  const apiUrl = `${
    import.meta.env.VITE_CLEAR_ONE_HISTORY_ENTRY_URL
  }/${historyId}`; // <-- Define VITE_DELETE_HISTORY_URL in your .env

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Failed to delete history entry. HTTP Status: ${response.status}`,
        `Error details:`,
        errorData
      );
      dispatch(
        historySlice.actions.deleteEntryFailure(
          errorData.message ||
            `Server error: ${response.status} ${response.statusText}`
        )
      );
      return;
    }

    // If deletion is successful on backend, update the Redux state
    dispatch(historySlice.actions.deleteEntrySuccess(historyId));
    dispatch(historySlice.actions.markHistoryForRefresh());
  } catch (error) {
    console.error("Error while deleting history entry:", error);
    dispatch(
      historySlice.actions.deleteEntryFailure(
        error.message || "Network error occurred."
      )
    );
  }
};

// NEW ASYNC FUNCTION: Clear all history entries
const clearAllHistoryManually = async (dispatch) => {
  dispatch(historySlice.actions.clearAllHistoryStart()); 
  const bearerToken = checkToken();

  if (!bearerToken) {
    console.error("No bearer token found for clearing all history.");
    dispatch(
      historySlice.actions.clearAllHistoryFailure(
        "Authentication token not found."
      )
    );
    return;
  }

  const apiUrl = import.meta.env.VITE_CLEAR_ALL_HISTORY_URL; // <-- Define VITE_CLEAR_ALL_HISTORY_URL in your .env

  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        `Failed to clear all history. HTTP Status: ${response.status}`,
        `Error details:`,
        errorData
      );
      dispatch(
        historySlice.actions.clearAllHistoryFailure(
          errorData.message ||
            `Server error: ${response.status} ${response.statusText}`
        )
      );
      return;
    }

    setTimeout(() => {
      // If clearing is successful on backend, clear the Redux state
      dispatch(historySlice.actions.clearUserHistory());
      dispatch(historySlice.actions.markHistoryForRefresh());
    }, 1500); // Mark for refresh to ensure consistent state
  } catch (error) {
    console.error("Error while clearing all history:", error);
    dispatch(
      historySlice.actions.clearAllHistoryFailure(
        error.message || "Network error occurred."
      )
    );
  }
};

const historySlice = createSlice({
  name: "history",
  initialState: {
    userHistory: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed' | 'needs-refresh' | 'deleting' | 'clearing'
    error: null,
  },
  reducers: {
    fetchHistoryStart: (state) => {
      state.status = "loading";
      state.error = null;
    },
    fetchHistorySuccess: (state, action) => {
      state.status = "succeeded";
      state.userHistory = action.payload;
    },
    fetchHistoryFailure: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
      state.userHistory = []; // Clear history on error if desired
    },
    markHistoryForRefresh: (state) => {
      state.status = "needs-refresh";
    },
    // Synchronous reducer to clear history from the Redux store
    clearUserHistory: (state) => {
      state.userHistory = [];
      state.status = "succeeded"; // Set to succeeded after local clear (assuming API call was successful)
      state.error = null;
    },

    // NEW REDUCERS FOR DELETE SINGLE ENTRY
    deleteEntryStart: (state) => {
      state.status = "deleting"; // Add a specific status for deleting
      state.error = null;
    },
    deleteEntrySuccess: (state, action) => {
      const idToDelete = action.payload;
      state.userHistory = state.userHistory.filter(
        (entry) => entry._id !== idToDelete
      ); // Use _id from backend
      state.status = "succeeded";
      state.error = null;
    },
    deleteEntryFailure: (state, action) => {
      state.status = "failed"; // Or a more specific 'deleteFailed'
      state.error = action.payload;
    },

    // NEW REDUCERS FOR CLEAR ALL HISTORY
    clearAllHistoryStart: (state) => {
      state.status = "clearing"; // Add a specific status for clearing
      state.error = null;
    },
    clearAllHistoryFailure: (state, action) => {
      state.status = "failed"; // Or a more specific 'clearAllFailed'
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
  deleteHistoryEntryManually,
  clearAllHistoryManually,
};

export default historySlice.reducer;