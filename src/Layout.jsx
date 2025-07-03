import { Outlet, useNavigation } from "react-router-dom";
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import LoadingBar from "react-top-loading-bar";
import { useState, useEffect } from "react";
import LocomotiveScroll from 'locomotive-scroll';
import ChatBot from "./Components/ChatBot/ChatBot.jsx";


export default function Layout() {
  const [progress, setProgress] = useState(0);
  
  // const locomotiveScroll = new LocomotiveScroll();
  const navigation = useNavigation();

  useEffect(() => {

    if (navigation.state === "loading") {
      setProgress(30);
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
      <ChatBot />
    </>
  );
}