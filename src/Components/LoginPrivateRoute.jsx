import {Navigate, useLocation } from 'react-router-dom';
import { checkToken } from '../Token/token';


function LoginPrivateRoute({element}) {
    const location = useLocation();
    const currentPath  =  location.pathname
    console.log(currentPath)
  const isUserLoggedIn = checkToken()
    return isUserLoggedIn ? <Navigate to={`${currentPath}`} />  : element   
}


export default LoginPrivateRoute