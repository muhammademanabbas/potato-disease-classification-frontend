import {Navigate } from 'react-router-dom';
import { checkToken } from '../Token/token';


function PrivateRoute({element}) {
  const isUserLoggedIn = checkToken()
    return isUserLoggedIn ? element :  <Navigate to="/login"/>
}

export default PrivateRoute