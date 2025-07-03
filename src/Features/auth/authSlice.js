import { createSlice } from '@reduxjs/toolkit';
import { checkToken, clearToken } from "../../Token/token"; // Assuming setToken is also available

// Define the async function to fetch user profile manually
const fetchUserProfileManually = async (dispatch) => {
    dispatch(authSlice.actions.fetchUserProfileStart());
    const bearerToken = checkToken();
    console.log("Bearer Token for User Profile:", bearerToken);

    if (!bearerToken) {
        console.error("No bearer token found for fetching user profile.");
        dispatch(
            authSlice.actions.fetchUserProfileFailure(
                "Authentication token not found."
            )
        );
        return;
    }

    const apiUrl = import.meta.env.VITE_USER_PROFILE;

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bearerToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                `Failed to fetch user profile. HTTP Status: ${response.status}`,
                `Error details:`,
                errorData
            );
            dispatch(
                authSlice.actions.fetchUserProfileFailure(
                    errorData.message || `Server error: ${response.status} ${response.statusText}`
                )
            );
            return;
        }

        const result = await response.json();

        if (result.success) {
            console.log("User profile fetched successfully:", result.response);
            setTimeout(()=>{
                dispatch(authSlice.actions.fetchUserProfileSuccess(result.response));
            },700)
        } else {
            console.error("Failed to fetch user profile:", result);
            dispatch(
                authSlice.actions.fetchUserProfileFailure(result.message || 'Failed to fetch user profile')
            );
        }
    } catch (error) {
        console.error("Error while fetching user profile:", error);
        dispatch(
            authSlice.actions.fetchUserProfileFailure(
                error.message || "Network error occurred."
            )
        );
    }
};

// Define the async function to delete user account
const deleteUserAccount = async (dispatch) => {
    dispatch(authSlice.actions.deleteAccountStart());
    const bearerToken = checkToken();
    const apiUrl = import.meta.env.VITE_USER_PROFILE_DELETE;

    if (!bearerToken) {
        console.error("No bearer token found for deleting user account.");
        dispatch(
            authSlice.actions.deleteAccountFailure(
                "Authentication token not found. Please log in again."
            )
        );
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${bearerToken}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                `Failed to delete account. HTTP Status: ${response.status}`,
                `Error details:`,
                errorData
            );
            dispatch(
                authSlice.actions.deleteAccountFailure(
                    errorData|| `Server error: ${response.status} ${response.statusText}`
                )
            );
            return;
        }

        // For account deletion, typically you'd clear the token and user data on success
        clearToken(); // Clear token from local storage
        dispatch(authSlice.actions.deleteAccountSuccess());
        dispatch(authSlice.actions.logout()); // Also trigger the logout state cleanup
    } catch (error) {
        console.error("Error while deleting user account:", error);
        dispatch(
            authSlice.actions.deleteAccountFailure(
                error.message || "Network error occurred during account deletion."
            )
        );
    }
};


// Create the auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null, // Stores user profile data
        isLoading: false, // Tracks overall loading state of API calls
        error: null, // Stores any general error messages
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' for profile fetch/general auth state

        // New state for login specific operations
        loginStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        loginError: null,

        // Existing state for delete account operations
        deleteAccountStatus: 'idle', // loading | succeeded | failed
        deleteAccountError: null,
    },
    reducers: {
        // Reducer for when the user profile fetch starts
        fetchUserProfileStart: (state) => {
            state.isLoading = true;
            state.error = null;
            state.status = 'loading';
        },
        // Reducer for when the user profile fetch is successful
        fetchUserProfileSuccess: (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.error = null;
            state.status = 'succeeded';
            // Also reset login status on successful profile fetch (implies logged in)
            state.loginStatus = 'succeeded';
            state.loginError = null;
        },
        // Reducer for when the user profile fetch fails
        fetchUserProfileFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.user = null;
            state.status = 'failed';
            // Also reset login status on failed profile fetch (implies not logged in)
            state.loginStatus = 'failed';
        },

        // New reducers for login operation (triggered by async loginUser)
        loginStart: (state) => {
            state.isLoading = true; // Overall loading
            state.loginStatus = 'loading';
            state.loginError = null; // Clear previous login errors
            state.error = null; // Clear general errors
        },
        loginSuccess: (state, action) => {
            state.isLoading = false; // Overall loading
            state.loginStatus = 'succeeded';
            state.loginError = null;
            state.user = action.payload; // Store the logged-in user's data
            state.status = 'succeeded'; // Update general auth status
        },
        loginFailure: (state, action) => {
            state.isLoading = false; // Overall loading
            state.loginStatus = 'failed';
            state.loginError = action.payload; // Store the login error
            state.user = null; // Clear user data on login failure
            state.status = 'failed'; // Update general auth status
        },

        // New synchronous reducer to directly set logged-in user data
        login: (state, action) => {
            state.user = action.payload; // Set the user data from the payload
            state.isLoading = false;
            state.error = null;
            state.status = 'succeeded'; // Indicate a successful authentication state
            state.loginStatus = 'succeeded'; // Indicate successful login
            state.loginError = null;
        },

        // Reducers for delete account operation
        deleteAccountStart: (state) => {
            state.deleteAccountStatus = 'loading';
            state.deleteAccountError = null;
            state.isLoading = true;
        },
        deleteAccountSuccess: (state) => {
            state.deleteAccountStatus = 'succeeded';
            state.deleteAccountError = null;
            state.isLoading = false;
             state.user = null; // Clear user data on successful deletion
            state.status = 'idle'; // Reset main status
            state.loginStatus = 'idle'; // Reset login status as user is deleted
            
        },
        deleteAccountFailure: (state, action) => {
            state.deleteAccountStatus = 'failed';
            state.deleteAccountError = action.payload;
            state.isLoading = false;
        },
        deleteAccountFailureToidle: (state, action) => {
            state.deleteAccountStatus = 'idle';
            state.deleteAccountError = null;
            state.isLoading = false;
        },
        
        // Synchronous reducer for logout
        logout: (state) => {
            state.user = null;
            state.isLoading = false;
            state.error = null;
            state.status = 'idle';
            state.loginStatus = 'idle'; // Reset login status on logout
            state.loginError = null;
            state.deleteAccountStatus = 'idle';
            state.deleteAccountError = null;
        },
    },
});

// Export the actions and the manual async functions
export const {
    fetchUserProfileStart,
    fetchUserProfileSuccess,
    fetchUserProfileFailure,
    loginStart,
    loginSuccess,
    loginFailure,
    login,
    deleteAccountStart,
    deleteAccountSuccess,
    deleteAccountFailure,
    logout,
} = authSlice.actions;

export { fetchUserProfileManually, deleteUserAccount,  }; // functions
export default authSlice.reducer;