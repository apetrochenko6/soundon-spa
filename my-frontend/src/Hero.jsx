import React, { useState, useEffect } from "react";
import images_p from "./constants/data";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const images = [
    images_p.Hero,
    images_p.heroImage2,
    images_p.Zespol1,
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const deltaX = touchStartX - touchEndX;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) handleNext();
      else handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <div className="carousel-wrapper">
        <div className="carousel-controls">
          <button onClick={handlePrev} aria-label="Previous Slide">❮</button>
          <button onClick={handleNext} aria-label="Next Slide">❯</button>
        </div>
        <div
          className="carousel"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="carousel-images"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {images.map((src, index) => (
              <img key={index} src={src} alt={`Slide ${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="indicators-container">
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={index === currentSlide ? 'active' : ''}
            />
          ))}
        </div>
      </div>

      
      <div className="divider"></div>
      <div className="buttons">
        <a href="/buy_ticket" className="button">KUP<br />BILET</a>
        <p style={{ fontSize: 45, fontWeight: 900 }}>lub</p>
        <a href="#" className="button">ZGŁOŚ<br />ZESPÓŁ</a>
      </div>
      <div className="yellow-divider"></div>
    </>
  );
};

export default Hero;
