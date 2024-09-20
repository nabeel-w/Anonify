import React, { useState } from "react";
import { Link } from "react-router-dom";
import img from "../assets/anonify.png";

function Navbar({ color, notHome,hamburgerMenu }) {
  const [isMenuOpen, setIsMenuOpen] = useState("closed");

  const smoothScrollTo = (targetPosition) => {
    const currentPosition = window.pageYOffset;
    const distance = targetPosition - currentPosition;
    const duration = 800; // Time in ms for the scroll
    let startTime = null;

    function animationScroll(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, currentPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animationScroll);
    }

    function ease(t, b, c, d) {
      // Easing function for smooth animation (ease-in-out)
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animationScroll);
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-component");
    if (aboutSection) {
      const targetPosition = aboutSection.offsetTop;
      smoothScrollTo(targetPosition);
    }
  };

  const scrollToTeam = () => {
    const teamSection = document.getElementById("team");
    if (teamSection) {
      const targetPosition = teamSection.offsetTop;
      smoothScrollTo(targetPosition);
    }
  };

  const toggleMenu = () => {
    if(isMenuOpen=="closed"){
      setIsMenuOpen("open");
    }
    else{
      setIsMenuOpen("closed");
    }
  };

  return (
    <div className="navbar" style={{ backgroundColor: color }}>
      <div className="logo-section">
        <Link to="/" className="logo">
          <img src={img} alt="Logo" />
        </Link>

        <div className="logo-name">Anonify</div>
      </div>
      {/* Correcting the class name logic */}
      <div className={`navbar-links hide ${notHome}`}>
        <div onClick={scrollToAbout} className="about-link">
          Tutorial
        </div>
        <div onClick={scrollToTeam} className="about-link">
          Team
        </div>
      </div>

      <div className={`${hamburgerMenu} ${notHome}`}>
        <div className="list" onClick={toggleMenu}>
          <i className="bi bi-list"></i>
        </div>
        <div className={`mobile-menu ${isMenuOpen}`}>
          <div onClick={scrollToAbout} className="about-link">
            Tutorial
          </div>
          <div onClick={scrollToTeam} className="about-link">
            Team
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
