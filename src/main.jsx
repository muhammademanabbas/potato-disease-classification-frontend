import React from 'react'
import ReactDOM from 'react-dom/client';
import { Route , RouterProvider ,  createBrowserRouter, createRoutesFromElements }  from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './Components/Home/Home.jsx'
import ImageUpload from './Components/ImageUpload/ImageUpload.jsx'
import Contact from './Components/Contact/Contact.jsx'
import About from './Components/About/About.jsx'
import PageNotFound from './Components/PageNotFound/PageNotFound.jsx'
import History from './Components/History/History.jsx'
import './index.css';

/* Second Method to make a router */
const router  =   createBrowserRouter(createRoutesFromElements(
  <Route path = "/" element = {<Layout/>}>
    <Route path="" element = {<Home/>} />
    <Route path="predict" element = {<ImageUpload/>} />
    <Route path="about" element = {<About/>} />
    <Route path="contact" element = {<Contact/>} /> 
    <Route path="history" element = {<History/>} /> 
    <Route path="*" element={<PageNotFound/>} />
  </Route>
))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)