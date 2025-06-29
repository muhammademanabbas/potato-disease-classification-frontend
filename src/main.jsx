import React from "react";
import ReactDOM from "react-dom/client";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./pages/HomePage/HomePage.jsx";
import ImageUpload from "./pages/ImageUpload/ImageUpload.jsx";
import About from "./pages/AboutPAge/AboutPage.jsx";
import PageNotFound from "./pages/NotFoundPage/NotFoundPage.jsx";
import History from "./pages/HistoryPage/HistoryPage.jsx";

import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import SignupPage from "./pages/SignupPage/SignupPage.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import LoginPrivateRoute from "./Components/LoginPrivateRoute.jsx";
import "./index.css";


const simulateLoad = async (ms) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  return null; // Loaders should return something, even if it's null
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route
        path=""
        element={<Home />}
        loader={async () => {
          console.log("Fetching Home Component!");
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
        path="/predict/history"
        element={<PrivateRoute element={<History />} />}
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
      <Route
        path="/login"
        element={<LoginPrivateRoute element={<LoginPage />} />}
        loader={async () => {
          return simulateLoad(400);
        }}
      />
      <Route
        path="/signin"
        element={<LoginPrivateRoute element={<LoginPage />} />}
        loader={async () => {
          return simulateLoad(400);
        }}
      />
      <Route
        path="/signup"
        element={<LoginPrivateRoute element={<SignupPage />} />}
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);