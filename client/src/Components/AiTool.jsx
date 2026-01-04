import React from 'react';
import { useUser } from '@clerk/clerk-react'
import AiToolsData from '../assets/asset';
import { useNavigate } from 'react-router-dom';
import { FaEraser, FaFile, FaHandScissors, FaHashtag, FaImage, FaPenNib } from 'react-icons/fa';
const AiTool = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const IconMap = {
        FaPenNib: FaPenNib,
        FaHashtag: FaHashtag,
        FaImage: FaImage,
        FaEraser: FaEraser,
        FaFile: FaFile,
        FaHandScissors: FaHandScissors
    }
    return (
        <div className='px-4 sm:px-20 xl:px-32 my-24'>
            <div className='text-center'>
                <h2 className='text-slate-700 text=[42px] font-semibold'>Power Ai</h2>
                <p className='text-slate-700 max-w-lg mx-auto'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi quis, ad voluptate dolorem ratione inventore!</p>
            </div>
            <div className='flex flex-wrap mt-10 justify-between'>
                {AiToolsData.map((tool, index) => {
                    const Icon = IconMap[tool.icon];
                    return (
                        <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer' onClick={() => user && navigate(tool.path)}>
                            <Icon className='mb-4 p-3 rounded-md text-white'
                                style={{ background: `linear-gradient(to bottom , ${tool.bg.from} ${tool.bg.to})` }} />
                            <h3 className='mt-6 mb-3 text-lg font-semibold'>{tool.title}</h3>
                            <p className='text-gray-400 text-sm max-w-[95%]'>{tool.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AiTool