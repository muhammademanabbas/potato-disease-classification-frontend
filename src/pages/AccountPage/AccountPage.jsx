import { ToastContainer } from 'react-toastify'
import Account from '../../Components/Account/Account'
import ContainerDiv from '../../Components/ContainerDiv/ContainerDiv'

function AccountPage() {
  return (
    <ContainerDiv>
        <ToastContainer />
        <Account />
    </ContainerDiv>
  )
}

export default AccountPage