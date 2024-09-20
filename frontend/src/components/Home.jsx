import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import About from "./About";
import HeroSection from "./HeroSection";

function Home() {
  return (
    <div className="home">
      <Navbar color={"#212429"} hamburgerMenu={"hamburger-menu"} />
      <HeroSection/>
      <div id="about-component">
      <About />
      </div>
      <Footer color={"#212429"}/>
    </div>
  );
}

export default Home;
