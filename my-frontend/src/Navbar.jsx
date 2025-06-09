import React from "react";
import { useState } from "react";
import images from "./constants/data";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <div className="navbar">
                <div className="navbar-title-mobile">SOUND ON</div>

                <div
                    className={`burger ${isMenuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>


                <div className="navbar-left">
                    <a href="#o_nas">O NAS</a>
                    <a href="#">PARTNERZY</a>
                    <a href="#zespoly">ARTYŚCI</a>
                    <a href="#FAQ">FAQ</a>
                </div>


                <div className="navbar-right">
                    <a href="#"><img src={images.YoutubeYellow} style={{ width: '55px', height: '55px' }} alt="YouTube" /></a>
                    <a href="#"><img src={images.InstagramYellow} style={{ width: '50px', height: '50px' }} alt="Instagram" /></a>
                    <a href="#"><img src={images.SpotifyYellow} style={{ width: '43px', height: '43px' }} alt="Spotify" /></a>
                </div>

                <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                    <a href="#section" onClick={toggleMenu}>O NAS</a>
                    <a href="#" onClick={toggleMenu}>PARTNERZY</a>
                    <a href="#zespoly" onClick={toggleMenu}>ARTYŚCI</a>
                    <a href="#FAQ" onClick={toggleMenu}>FAQ</a>
                    
                </div>
            </div>
        </header>
    );
};

export default Navbar;