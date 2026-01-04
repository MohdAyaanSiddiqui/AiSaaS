import React from 'react'
import { useNavigate } from 'react-router-dom'
import Back from '../assets/Back.png'
const Hero = () => {
    const navigate = useNavigate();
    return (
        <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-no-repeat' >
            <div className='text-center mb-6'>
                <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2] mt-10'> <br />Create Amazing Content With <span className='text-primary'>AI SaaS App</span></h1>
                <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque, dignissimos?</p>
            </div>
            <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
                <button
                    onClick={() => navigate('/ai')}
                    className='bg-primary text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer'>Start Creating Now...</button>
                <button
                    className='bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer'>Watch Demo of Ai SaaS</button>
            </div>
        </div>
    )
}

export default Hero;
