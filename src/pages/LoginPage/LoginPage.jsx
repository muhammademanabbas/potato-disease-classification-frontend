import { ToastContainer } from 'react-toastify'
import ContainerDiv from '../../Components/ContainerDiv/ContainerDiv'
import Login from '../../Components/Login/Login'

function LoginPage() {
  return (
    <ContainerDiv>
        <Login />
         <ToastContainer />
    </ContainerDiv>
  )
}

export default LoginPage