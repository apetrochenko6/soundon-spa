import React, { useState } from 'react';
import images from './constants/data';
import './JoinUs.css'
const JoinUs = () => {
    return(<div className="section-wrapper" style={{backgroundColor: "black"}}>
  <section className="banner-container" aria-label="Performance opportunity announcement">
    <div className="banner-top">
      <h1>MASZ ZESPÓŁ? CHCESZ WYSTĄPIĆ? ZGŁOŚ SIĘ JUŻ DZIŚ</h1>
      <div className="highlight-bar" aria-hidden="true">I ZAWALCZ OSCENĘ MARZEŃ!</div>
    </div>
    
    <div className='mini-wrap'>
      <div className="cta-container">
        <div className="join-bar" role="heading" aria-level="2">DOŁĄCZ DO NAS!</div>
      </div>

      <div className="content">
        <article className="text-box">
         JESTEŚMY EKIPĄ, KTÓRA KOCHA MUZYKĘ I MŁODZIEŃCZĄ ENERGIĘ. TWORZYMY PRZESTRZEŃ DLA MŁODYCH ARTYSTÓW, KTÓRZY CHCĄ POKAZAĆ SWÓJ TALENT NA DUŻEJ SCENIE. NIEWAŻNE, CZY GRASZ SOLO, W DUECIE CZY W ZESPOLE – U NAS KAŻDY MA SZANSĘ ZABŁYSNĄĆ.
        </article>
        
        <figure className="image-box">
          <img 
            src={images.jumpCrowd} 
            alt="Enthusiastic crowd at a concert with people enjoying music" 
            loading="lazy"
          />
        </figure>
      </div>
    </div>
  </section>
</div>)
    
}
export default JoinUs;