import React from 'react'
import ContainerDiv from '../../Components/ContainerDiv/ContainerDiv.jsx'
import Home from '../../Components/Home/Home.jsx'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'


function HomePage() {
  return (
    <>
      <ContainerDiv>
        <Home/>
        <ToastContainer />
      </ContainerDiv>
    </>
  )
}

export default HomePage