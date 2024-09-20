import React from "react";
import img from "../assets/anonify.png";

function Loading() {
  return (
    <>
      <section>
        <div>
          <img src={img} alt="" />
        </div>
        <h1>
          <span>A</span>
          <span>n</span>
          <span>o</span>
          <span>n</span>
          <span>i</span>
          <span>f</span>
          <span>y</span>
        </h1>
      </section>
    </>
  );
}

export default Loading;
