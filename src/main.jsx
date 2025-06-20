import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import ImageUpload from "./pages/ImageUpload/ImageUpload.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import About from "./pages/About/About.jsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx";
import History from "./pages/History/History.jsx";
import "./index.css";

const simulateLoad = async (ms) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return null; // Loaders should return something, even if it's null
};

/* Second Method to make a router */
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route
        path=""
        element={<Home />}
        loader={async () => {
          console.log("Fetching Home Component!")
          return simulateLoad(400); // Simulate an 800ms load for Home
        }}
      />
      <Route
        path="predict"
        element={<ImageUpload />}
        loader={async () => {
          return simulateLoad(400);
        }}
      />
      <Route
        path="about"
        element={<About />}
        loader={async () => {
          return simulateLoad(400);
        }}
      />
       {/* <Route
        path="contact"
        element={<Contact />}
        loader={async () => {
          return simulateLoad(400);
        }}
      />  */}
      <Route
        path="history"
        element={<History />}
        loader={async () => {
          return simulateLoad(400);
        }}
      />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
