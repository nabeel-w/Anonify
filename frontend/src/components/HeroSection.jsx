import React from "react";
import Button from "./Button";
import heroImage from "../assets/heroImageBg.png";

function HeroSection() {
  return (
    <div className="heroSection background">
      <div className="hero-content">
        <h2>Secure Documents, Protect Privacy</h2>
        <p>
          Ensure your information stays private with Anonify’s secure,
          easy-to-use platform, featuring fast encryption and redaction
          capabilities.
        </p>
        <Button content="Click here to Anonymize" to="/document" />
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="" />
      </div>
    </div>
  );
}

export default HeroSection;
