import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from "@fortawesome/free-brands-svg-icons";

const BandCard = ({ band }) => {
    return (
        <>
        <div className="band-card">
            <img src={band.image} alt={band.name} className="band-image" />
           
            <div className="band-info">
                <h2>{band.name}</h2>
                <p>{band.genre}</p>
                <a href={band.spotify} target="_blank" rel="noopener noreferrer">
                    Link do Spotify
                </a>
            </div>
           <h2 style={{ color: "#fff", marginTop: "10px" }}>{band.name}</h2>
                                <p style={{ color: "#aaa" }}>{band.genre}</p>
        </div>
        

        
        </>
    );
};

export default BandCard;
