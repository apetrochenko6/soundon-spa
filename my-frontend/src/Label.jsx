import React, { useState } from "react";
import "./Label.css";

const LabelSoundon = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleClick = (e) => {
    e.stopPropagation();
    setCollapsed(true);
  };

  const handleLabelClick = () => {
    if (collapsed) {
      setCollapsed(false);
    }
  };

  return (
    <div className="sticky-label">
      <div
        className={`custom-label ${collapsed ? "collapsed" : ""}`}
        onClick={handleLabelClick}
      >
        <div className="label-pin" onClick={handleToggleClick}>
          <div className="leftright"></div>
          <div className="rightleft"></div>
        </div>
        <div className="label-text">
          <h2>
            <span className="soundon">#SOUNDON</span>
            <br />
            2025
          </h2>
          <p>
            <span className="underline">
              PRZEŻYJ NAJLEPSZY FESTIWAL SWOJEGO ŻYCIA!
              <br />
            </span>
          </p>
          <p>
            <span className="month">MARCH 10</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LabelSoundon;
