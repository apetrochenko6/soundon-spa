import React from "react";
import images from "./constants/data";
const Navbar = () => {
    return (
        <>
            <header className="header">
                <div className="navbar">
                    <div className="navbar-left">
                        <a href="#">O NAS</a>
                        <a href="#">PARTNERZY</a>
                        <a href="#">ARTYŚCI</a>
                        <a href="#">FAQ</a>
                    </div>
                    <div className="navbar-right">
                        <a href="#"><img src={images.YoutubeYellow} style={{ width: '55px', height: '55px' }}alt="YouTube" /></a>
                        <a href="#"><img src={images.InstagramYellow}  style={{ width: '50px', height: '50px' }}  alt="Instagram" /></a>
                        <a href="#"><img src={images.SpotifyYellow}style={{ width: '43px', height: '43px' }}  alt="Spotify" /></a>
                    </div>
                </div>
            </header>

        </>

    )
}
export default Navbar