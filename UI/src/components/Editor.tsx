import React, { useState } from "react";
import "../styles/CardWithWings.scss";

const CardWithWings: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`card-container ${hovered ? "hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="left-wing">
        <div className="wing-card">.....WE</div>
        <div className="wing-card">Are</div>
      </div>
      <div className="card">Our Services</div>
      <div className="right-wing">
        <div className="wing-card">Coming</div>
        <div className="wing-card">Soon...</div>
      </div>
    </div>
  );
};

export default CardWithWings;
