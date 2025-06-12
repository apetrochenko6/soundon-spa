import React, { useState } from 'react';
import images from './constants/data';
import './SponsorSection.css'
const SponsorSection = () => {
   return (
    <section className="sponsors-section">
        <div className="sponsors-container">
            <h1 className="sponsors-title">SPONSORS</h1>
            
            <div className="sponsors-logos">
                <div><img src={images.Ayeya} alt="Ayeya" /></div>
                <div><img src={images.X} alt="X" /></div>
                <div><img src={images.Deay} alt="Deay" /></div>
                <div><img src={images.pr} alt="PR" /></div>
                <div><img src={images.drag} alt="Dragbunk" /></div>
                <div><img src={images.love} alt="Love" /></div>
                <div><img src={images.moda} alt="Moda" /></div>
                <div><img src={images.musicF} alt="Music Festival" /></div>
            </div>
        </div>
    </section>
);
}
export default SponsorSection;