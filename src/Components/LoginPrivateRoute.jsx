import { useLocation, Navigate, useNavigate } from "react-router-dom"; // Import useNavigate
import { checkToken } from "../Token/token";

function LoginPrivateRoute({ element }) {
  const isUserLoggedIn = checkToken();
  console.log("LoginPrivateRoute: isUserLoggedIn:", isUserLoggedIn);
  const navigate = useNavigate(); // Get the navigate function
  {
    return isUserLoggedIn ? <Navigate to="/" /> : element;
  }
}
export default LoginPrivateRoute;