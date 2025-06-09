import React from "react";
import "./Footer.css"; 
import { HashLink } from 'react-router-hash-link';
import images from "./constants/data";
const Footer = () => {
  return (
    <section className="footer-container">
      <div className="footer-left">
        <div className="footer-nav-buttons">
          <HashLink className="footer-nav-link" smooth to="/#o_nas">O NAS</HashLink>
          <HashLink className="footer-nav-link" smooth to="/#zespoly">ARTYŚCI</HashLink>
          <HashLink className="footer-nav-link" smooth to="/#FAQ">FAQ</HashLink>
        </div>

        <HashLink className="footer-partner-link" smooth to="/#partnerzy">PARTNERZY</HashLink>

        <div className="footer-newsletter">
          <h3>ZAPISZ SIĘ DO NASZEGO NEWSLETTERA</h3>
          <div className="newsletter-input-container">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
            />
            <button className="newsletter-button">Sign up</button>
          </div>
        </div>

        <div className="footer-sponsors">
          <img src={images.InstagramBlack}  alt="instagram_logo" className="instagram_logo" />
          <img src={images.SpotifyBlack}  alt="spotify_logo" className="spotify_logo"/>
          <img src={images.YoutubeBlack}  alt="youtube_logo" className="youtube_logo" />
        </div>
      </div>

      <div className="footer-right">

        <h2>SKONTAKTUJ SIĘ Z NAMI</h2>
   
        <p className="footer-contact-text">
          MASZ PYTANIA? CHCESZ DOWIEDZIEĆ SIĘ WIĘCEJ O FESTIWALU, ZGŁOSZENIACH LUB BILETACH? JESTEŚMY TUTAJ, BY CI POMÓC!
        </p>


        <div className="footer-contact-info">
          <p>
            <strong>E-MAIL:</strong> KONTAKT@FESTIWALMLODTCH.PL
          </p>
          <p>
            <strong>TELEFON:</strong> +48 123 456 789
          </p>
          <p>
            <strong>ADRES:</strong> UL. MUZYCZNA 12, 00-001 WARSZAWA
          </p>
          <p>
            <strong>GODZINY PRACY:</strong><br />
            PONIEDZIAŁEK - PIĄTEK: 9:00 - 17:00
          </p>
        </div>

        <div className="footer-contact-form">
          <p>
            MOŻESZ TEŻ NAPISAĆ DO NAS PRZEZ FORMULARZ KONTAKTOWY PONIŻEJ:
          </p>
        </div>

        <p className="footer-copyright">
          Copyright © 2025
        </p>
      </div>
    </section>
  );
};

export default Footer;