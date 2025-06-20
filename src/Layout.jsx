import { Outlet, useNavigation } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import LoadingBar from "react-top-loading-bar";
import { useState, useEffect } from "react";
import LocomotiveScroll from 'locomotive-scroll';

export default function Layout() {
  const [progress, setProgress] = useState(0); // react-top-loading-bar state
  
  const locomotiveScroll = new LocomotiveScroll();
  const navigation = useNavigation(); // React Router navigation hook

  useEffect(() => {
    console.log("Navigation State:", navigation.state);

    if (navigation.state === "loading") {
      setProgress(30); // Start the progress bar from an initial value
    } else if (navigation.state === "idle") {
      setProgress(100);
    }
  }, [navigation.state]);

  return (
    <>
      <LoadingBar
        color="darkgreen"
        progress={progress}
        height={4}
        onLoaderFinished={() => {
          setProgress(0);
        }}
      />
      <Header />
      <Outlet /> {/* Outlet is for Dynamically Changing Component */}
      <Footer />
    </>
  );
}