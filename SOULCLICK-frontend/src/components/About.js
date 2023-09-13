import React from 'react'
import './style/About.css'
import CEO_kelvin from '../features/img/illustration/CEO_kelvin.png'
import CTO_kelly from '../features/img/illustration/CTO_kelly.png'

/*
    About - The html template for About section in the home page
*/
const About = () => {
    return (
        <section id="about">
            <div className="about-container"> 
                <div className="about-left">
                    <img src={CEO_kelvin} />
                    <h1>Kelvin Wong</h1>
                    <h4>Founder & CEO</h4>
                    <p>Kelvin is a Software Engineer. During the course of his Bachelor's degree in Computer Science at Nanyang Technological University (NTU). He specialized in Artificial Intelligence at NTU, focusing on areas such as Computer Vision and Natural Language Processing. However, he found his passion in software development since his first small mini game creation.</p>
                </div>
                <div className="about-right">
                    <img src={CTO_kelly} />
                    <h1>Kelly Wong</h1>
                    <h4>Co-founder & CTO</h4>
                    <p>Dummy Kelly is a Software Engineer. While pursuing his Bachelor's in Computer Science at Nanyang Technological University (NTU). During his time in NTU, he specialized in Artifical Intelligence focusing in areas such as Computer Vision and NLP. However, he found his passion in software development ever since his first small mini game creation. </p>
                </div>
            </div>
        </section>
    )
}
export default About