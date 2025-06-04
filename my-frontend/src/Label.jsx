import React from "react";
import "./label.css";

const LabelSoundon = () => {
    return (
        <div className="sticky-label">
            <div className="custom-label">
                <div className="label-pin">
                    <div className="leftright"></div>
                    <div className="rightleft"></div>
                </div>
                <div className="label-text">
                    <h2><span className="soundon">#SOUNDON</span><br />2025</h2>
                    <p><span className="underline">PRZEŻYJ NAJLEPSZY FESTIWAL SWOJEGO ŻYCIA!<br /></span></p>
                    <p><span className="month">MARCH 10</span></p>
                </div>
            </div>
        </div>
    );
};

export default LabelSoundon;