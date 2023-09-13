import React, { useState } from 'react'
import './Slider.css'
import dataSlider from './dataSlider'
import BtnSlider from './BtnSlider'

export default function Slider() {
    const [slideIndex, setSlideIndex] = useState(1)

    const nextSlide = () => {
        // Check if the slides exceeds the number of Slider image
        if (slideIndex !== dataSlider.length) {
            setSlideIndex(slideIndex + 1)
        }
        else if (slideIndex === dataSlider.length) {
            setSlideIndex(1) // Force it back to 1st picture
        }
    }

    const prevSlide = () => {
        // Check if the slides exceeds the number of Slider image
        if (slideIndex !== 1) {
            setSlideIndex(slideIndex - 1)
        }
        else if (slideIndex === 1) {
            setSlideIndex(dataSlider.length) // Force it back to 1st picture
        }
    }

    const moveDot = index => {
        setSlideIndex(index)
    }

    console.log(slideIndex)
    return (
        <div className="container-slider">
            {dataSlider.map((item, idx) => {
                return (
                    <div key={item.id} className={slideIndex === idx+1 ? "slide active-anim" : "slide"}>
                        <img src={process.env.PUBLIC_URL + `/Imgs/img${idx + 1}.jpg`} alt="" />
                    </div>
                )
            })}
            <BtnSlider moveSlide={nextSlide} direction={"next"}/>
            <BtnSlider moveSlide={prevSlide} direction={"prev"}/>

            {/* This will helps us to draw the 5 dots that can allow user to control the slider section */}
            <div className="container-dots">
                {Array.from({length: dataSlider.length}).map((item, idx) => (
                    <div key={idx}
                        onClick={() => moveDot(idx + 1)}
                        className={slideIndex === idx + 1 ? "dot active" : "dot"}
                    >
                    </div>
                ))}
            </div>
        </div>
    )
}