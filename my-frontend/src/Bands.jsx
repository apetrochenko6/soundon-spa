import React from "react";
import images_p from "./constants/data";
import Slider from "react-slick";
import BandCard from "./BandCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const data = [
    {
        name: "Neon Jungl",
        image: images_p.Zespol1,
        genre: "Indie / Rock Alternatywny",
        spotify: "https://open.spotify.com/artist/...",
    },
    {
        name: "The Dazed",
        image: images_p.Zespol2,
        genre: "Alternative Pop / Darkwave",
        spotify: "https://open.spotify.com/artist/...",
    },
    {
        name: "Velvet Riot",
        image: images_p.Zespol3,
        genre: "Garage Rock",
        spotify: "https://open.spotify.com/artist/...",
    },


];

const sliderSettings = {
    arrows: false,

    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1400,
            settings: {
                slidesToShow: 2,
            },

        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
            },
        },
    ],
};

const Bands = () => {

    return (
        <div style={{ backgroundColor: "#000", padding: "30px 0 60px 0" }}>
            <h1
                className="zespol-lable"
            >
                NASZE ZESPOŁY
            </h1>
            <div
                style={{
                    maxWidth: "1800px",
                    margin: "0 auto",
                }}
            >
                    <div style={{justifyContent: "center" }}>


                    <Slider {...sliderSettings}>
                        {data.map((band, index) => (
                            <div key={index} style={{ display: "flex", justifyContent: "center" }}>
                                <BandCard band={band}>
                                
                                </BandCard>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default Bands;
