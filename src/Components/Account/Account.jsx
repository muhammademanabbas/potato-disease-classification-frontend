import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  User,
  TrashIcon,
  LogoutIcon,
  KeyIcon,
} from "../Icons/Icons";
import { clearToken } from "../../Token/token";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUserHistory } from "../../Features/history/historySlice";
import { handleError, handleSuccess } from "../../utils";
import { checkToken } from "..//../Token/token";
import {
  fetchUserProfileManually,
  logout,
  deleteUserAccount,
} from "../../Features/auth/authSlice";

function Account() {
  // userData from Redux store
  const UserInfo = useSelector((state) => state.auth.user);
  const authStatus = useSelector((state) => state.auth.status); // Get the status for better control
  const authError = useSelector((state) => state.auth.error); // Get the status for better control
  const authDeletingUserError = useSelector(
    (state) => state.auth.deleteAccountError
  ); // Get the status for better control
  const authDeleteAccountStatus = useSelector(
    (state) => state.auth.deleteAccountStatus
  ); // Get the status for better control

  // State for user details, initialized to empty strings
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // State for managing confirmation modals
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  // State for password fields in the change password modal
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("UserInfo from Redux:", UserInfo);
  console.log("Auth Status from Redux:", authStatus);

  useEffect(() => {
    // Fetch user profile when the component mounts or when dispatch changes
    // This ensures the data fetching process starts.
    if (authStatus === "idle" || authStatus === "failed") {
      fetchUserProfileManually(dispatch);
    }
  }, []);

  useEffect(() => {
    if (authStatus === "succeeded" && UserInfo) {
      console.log("Setting userName and userEmail from UserInfo:", UserInfo);
      setUserName(UserInfo.name.toUpperCase() || ""); // Use empty string fallback
      setUserEmail(UserInfo.email || ""); // Use empty string fallback
    } else if (authStatus === "failed" || authStatus === "idle") {
      setUserName("");
      setUserEmail("");
      console.error(
        "Failed to load user profile. UserInfo might be null or incomplete."
      );
    }
  }, [UserInfo, authStatus]);

  if (authStatus === "loading" || authDeleteAccountStatus === "loading") {
    return (
      <div class="loader">
        <div class="panWrapper">
          <div class="pan">
            <div class="food"></div>
            <div class="panBase"></div>
            <div class="panHandle"></div>
          </div>
          <div class="panShadow"></div>
        </div>
      </div>
    );
  }

  if (authStatus === "failed" || authDeleteAccountStatus === "failed") {
    return (
      <div className="flex flex-col gap-2">
        <strong className="text-red-600 text-lg">Error: ${authError}</strong>
      </div>
    );
  }

  // Handlers to open modals
  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
    // Reset password fields and messages when opening the modal
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleDeleteAccount = () => {
    setShowDeleteAccountModal(true);
  };

  // Actions for Logout Modal
  const confirmLogout = () => {
    console.log("Logout confirmed");
    setShowLogoutModal(false);
    clearToken();
    dispatch(clearUserHistory());
    dispatch(logout());
    handleSuccess("Logged out successfully!");
    setTimeout(() => {
      navigate("/");
    }, 700);
  };

  // Actions for Delete Account Modal
  const confirmDeleteAccount = () => {
    deleteUserAccount(dispatch);
    setShowDeleteAccountModal(false);
    console.log("Account deletion succeeded! Clearing history and navigating.");
    dispatch(clearUserHistory());
    handleSuccess("Your account Has been deleted!");
    navigate("/");
  };

  const cancelLogout = () => {
    console.log("Logout cancelled");
    setShowLogoutModal(false);
  };

  // Actions for Change Password Modal
  const confirmChangePassword = async () => {
    // Basic validation
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("All fields are required.");
      setPasswordSuccess("");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New password and confirm new password do not match.");
      handleError('"New password" and "confirm new password" do not match.');
      setPasswordSuccess("");
      return;
    }
    if (newPassword.length < 4) {
      setPasswordError("New password must be at least 4 characters long.");
      handleError("New password must be at least 4 characters long.");
      setPasswordSuccess("");
      return;
    }

    const bearerToken = checkToken();

    if (!bearerToken) {
      console.error("No bearer token found for fetching user profile.");
      return;
    }

    const apiUrl = import.meta.env.VITE_USER_PROFILE_PASSWORD;
    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      if (!response.ok) {
        // Check if the actual fetch response was not OK
        const errorData = await response.json();
        handleError(errorData.error);
        console.error(
          `Failed to update user password. HTTP Status: ${response.status}`,
          `Error details:`,
          errorData
        );

        return;
      }

      const result = await response.json(); // This would be the actual API response

      if (result.success) {
        console.log("User password updated successfully!", result.response);
        setShowChangePasswordModal(false);
        handleSuccess("Your password has been updated!");
      } else {
        console.error("Failed to update user password:", result);
      }
    } catch (error) {
      console.error("Error while updating user password:", error);
    }
  };

  const cancelChangePassword = () => {
    console.log("Change Password cancelled");
    setShowChangePasswordModal(false);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const cancelDeleteAccount = () => {
    setShowDeleteAccountModal(false);
    console.log("Delete Account cancelled");
  };

  

  return (
    <div className="bg-white p-6 sm:p-8 mt-[14vh] rounded-xl shadow-lg w-full max-w-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Account Settings
      </h2>

      <div className="flex flex-col space-y-8">
        <div className="space-y-4 w-full">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={userName}
                readOnly
                className="mt-1 block w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 cursor-not-allowed"
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User />
              </span>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={userEmail}
                readOnly
                className="mt-1 block w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 cursor-not-allowed"
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail />
              </span>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value="********" // Password is hidden and not visible
                readOnly
                className="mt-1 block w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 cursor-not-allowed"
              />
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock />
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Your password is hidden for security. Use the "Change Password"
              button to update it.
            </p>
          </div>
        </div>

        {/* Action Buttons Section */}
        {/* Removed md:w-1/2 from here */}
        <div className="space-y-4 w-full flex flex-col justify-center">
          <button
            onClick={handleLogout}
            className="w-full text-gray-700 hover:text-gray-900 hover:underline transition duration-150 ease-in-out font-semibold text-lg flex items-center justify-start"
          >
            <LogoutIcon className="mr-2" /> {/* Added mr-2 for spacing */}
            Logout
          </button>
          <button
            onClick={handleChangePassword}
            className="w-full text-green-700 hover:text-green-900 hover:underline transition duration-150 ease-in-out font-semibold text-lg flex items-center justify-start"
          >
            <KeyIcon className="mr-2" /> {/* Added mr-2 for spacing */}
            Change Password
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full text-red-700 hover:text-red-900 hover:underline transition duration-150 ease-in-out font-semibold text-lg flex items-center justify-start"
          >
            <TrashIcon className="mr-2" /> {/* Added mr-2 for spacing */}
            Delete Account
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Confirm Logout
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmLogout}
                className="bg-red-600 text-white py-2 px-5 rounded-lg hover:bg-red-700 transition duration-150 ease-in-out font-medium"
              >
                Confirm
              </button>
              <button
                onClick={cancelLogout}
                className="bg-gray-300 text-gray-800 py-2 px-5 rounded-lg hover:bg-gray-400 transition duration-150 ease-in-out font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Confirmation Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
              Change Password
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock />
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock />
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirm-new-password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="mt-1 block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock />
                  </span>
                </div>
              </div>
            </div>

            {passwordError && (
              <p className="text-red-600 text-sm mt-4 text-center">
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="text-green-600 text-sm mt-4 text-center">
                {passwordSuccess}
              </p>
            )}

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={confirmChangePassword}
                className="bg-[#15803D] text-white py-2 px-5 rounded-lg hover:bg-[#106B30] transition duration-150 ease-in-out font-medium"
              >
                Update Password
              </button>
              <button
                onClick={cancelChangePassword}
                className="bg-gray-300 text-gray-800 py-2 px-5 rounded-lg hover:bg-gray-400 transition duration-150 ease-in-out font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              Delete Account
            </h3>
            <p className="text-gray-700">
              Are you sure you want to delete your account?
            </p>
            <p className="text-gray-700 mb-6">This action cannotbe undone.</p>
            <p className="text-gray-700 mb-6">
              Your entire history will be permanently removed!
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDeleteAccount}
                className="bg-red-600 text-white py-2 px-5 rounded-lg hover:bg-red-700 transition duration-150 ease-in-out font-medium"
              >
                Delete
              </button>
              <button
                onClick={cancelDeleteAccount}
                className="bg-gray-300 text-gray-800 py-2 px-5 rounded-lg hover:bg-gray-400 transition duration-150 ease-in-out font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Account;