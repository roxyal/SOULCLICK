import React from 'react'
import '../style/Testimonial.css'
import Testimonial_data from './Testimonial_data'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react'
import 'swiper/css'
import { sliderSetting } from './sliderSetting'

const Testimonial = () => {

    const SliderButtons = () => {
        const swiper = useSwiper();
        return (
            <div className="swiper-btn">
                <button onClick={() => swiper.slidePrev()}>&lt;</button>
                <button onClick={() => swiper.slideNext()}>&gt;</button>
            </div>
        )
    }

    return (
        <section id="testimonial">
            <div className="test-container">
                <Swiper {...sliderSetting}>
                    <SliderButtons />
                    {Testimonial_data.map((item, idx) => {
                        return (
                            <SwiperSlide key={item.id}>
                                <div className="each-test">
                                    <img src={item.img_src} alt=""/>
                                    <h5>{item.name}</h5>
                                    <p>{item.testimonial}</p>
                                </div>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            </div>
        </section>
    )
}
export default Testimonial