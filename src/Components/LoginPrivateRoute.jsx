import { Navigate } from "react-router-dom"; // Import useNavigate
import { checkToken } from "../Token/token";

function LoginPrivateRoute({ element }) {
  const isUserLoggedIn = checkToken();

  {
    return isUserLoggedIn ? <Navigate to="/" /> : element;
  }
}

export default LoginPrivateRoute;