import React from 'react'
import './style/Hero.css'
import { useNavigate } from 'react-router-dom'
import flying_castle from '../features/img/illustration/flying_castle.png'
/*
    Hero - The html template for Hero section in the home page
*/
const Hero = () => {

    // Using useNavigate to navigate to another page 
    const navigate = useNavigate()
    const onJoinNowClicked = () => navigate('/signup')

    return (
        <section id="hero">
            <div className="hero-container">
                <div className="hero-left">
                    <h1>What are you waiting FOR!</h1>
                    <h5>Find your truly here with SOULCLICK</h5>
                    <button onClick={onJoinNowClicked}><span>JOIN NOW </span></button>
                </div>
                <div className="hero-right">
                    <img src = {flying_castle} alt=""/>
                </div>
            </div>
        </section>
    )
}
export default Hero