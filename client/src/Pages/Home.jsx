import React from 'react'
import Navbar from '../Components/Navbar.jsx'
import Hero from '../Components/Hero.jsx'
import AiTool from '../Components/AiTool.jsx'
import Plan from '../Components/Plan.jsx'
import Testimonial from '../Components/Testimonial.jsx'
import Footer from '../Components/Footer.jsx'

const Home = () => {
  return (
    <>
    <Navbar />
    <Hero/>
    <AiTool/>
    <Testimonial/>
    <Plan/>
    <Footer/>
    </>
  )
}

export default Home