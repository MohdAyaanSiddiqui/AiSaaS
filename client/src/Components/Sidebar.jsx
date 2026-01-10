import React from 'react';
import { useClerk, useUser } from '@clerk/clerk-react'
import { FaEraser, FaHashtag, FaSquare, FaUser } from 'react-icons/fa';
import { FaHouse, FaScissors } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { IoMdLogOut } from 'react-icons/io';

const navItems = [
    { to: '/ai', label: 'Dashboard', Icon: FaHouse },
    { to: '/ai/write-article', label: 'Write Article', Icon: FaSquare },
    { to: '/ai/blog-titles', label: 'Blog Titles', Icon: FaHashtag },
    { to: '/ai/remove-background', label: 'Remove Background', Icon: FaEraser },
    { to: '/ai/remove-object', label: 'Remove Object', Icon: FaScissors },
    { to: '/ai/community', label: 'Community', Icon: FaUser },
]
const Sidebar = ({ sidebar, setSidebar }) => {
    const { user } = useUser();
    const { signOut, openUserProfile } = useClerk();

    return (
        <div className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-8' : 'max-sm:translate-x-full'} transition-all duration-300 ease-in-out`}>
            <div className='my-7 w-full'>
                <img src={user.imageUrl} alt='Avatar' className='w-13 rounded-full mx-auto' />
                <h1 className='mt-1 text-center'>{user.fullName}</h1>
                <div className='px-6 mt-5 text-sm text-gray-600 font-medium'>
                    {navItems.map((item) => (
                        <NavLink key={item.to} to={item.to} end={item.to === '/ai'} onClick={() => setSidebar(false)} className={({ isActive }) => `px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white' : ''}`}>
                            {({ isActive }) => (
                                <>
                                    <item.Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`} />
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
            <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between gap-2'>
                <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
                    <img src={user.imageUrl} className='w-8 rounded-full' alt="" />
                    <div>
                        <h1 className='text-sm font-medium'>{user.fullName}</h1>
                        <p className='text-xs text-gray-500'>All features unlocked</p>
                    </div>
                </div>
                <IoMdLogOut onClick={signOut} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer' />
            </div>
        </div>
    )
}

export default Sidebar;