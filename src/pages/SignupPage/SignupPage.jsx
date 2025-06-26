import { ToastContainer } from 'react-toastify'
import ContainerDiv from '../../Components/ContainerDiv/ContainerDiv'
import Signup from '../../Components/Signup/Signup'

function SignupPage() {
  return (
    <ContainerDiv>
        <Signup />
        <ToastContainer />
    </ContainerDiv>
  )
}

export default SignupPage