import React from "react";
import { useState } from "react";
import images from "./constants/data";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

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
                    <HashLink smooth to="/#o_nas">O NAS</HashLink>
                    <HashLink smooth to="/#partnerzy">PARTNERZY</HashLink>
                    <HashLink smooth to="/#zespoly">ARTYŚCI</HashLink>
                    <HashLink smooth to="/#FAQ">FAQ</HashLink>
                </div>


                <div className="navbar-right">
                    <a href="#"><img src={images.YoutubeYellow} style={{ width: '55px', height: '55px' }} alt="YouTube" /></a>
                    <a href="#"><img src={images.InstagramYellow} style={{ width: '50px', height: '50px' }} alt="Instagram" /></a>
                    <a href="#"><img src={images.SpotifyYellow} style={{ width: '43px', height: '43px' }} alt="Spotify" /></a>
                </div>

                <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                    <HashLink smooth to="/#o_nas" onClick={toggleMenu}>O NAS</HashLink>
                    <HashLink smooth to="/#partnerzy" onClick={toggleMenu}>PARTNERZY</HashLink>
                    <HashLink smooth to="/#zespoly" onClick={toggleMenu}>ARTYŚCI</HashLink>
                    <HashLink smooth to="/#FAQ" onClick={toggleMenu}>FAQ</HashLink>

                </div>
            </div>
        </header>
    );
};

export default Navbar;