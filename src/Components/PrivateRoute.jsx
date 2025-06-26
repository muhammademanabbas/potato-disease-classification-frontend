import {Navigate } from 'react-router-dom';
import { checkToken } from '../Token/token';


function PrivateRoute({element}) {
  const isUserLoggedIn = checkToken()
  console.log(isUserLoggedIn)
    return isUserLoggedIn ? element :  <Navigate to="/login"/>
}


export default PrivateRoute