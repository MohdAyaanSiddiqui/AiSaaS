import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaEraser, FaHashtag, FaSquare, FaUser } from 'react-icons/fa';
import { FaHouse, FaScissors } from 'react-icons/fa6';
import { NavLink, useNavigate } from 'react-router-dom';
import { IoMdLogOut } from 'react-icons/io';
import { setUser } from '../redux/appSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const navItems = [
    { to: '/ai', label: 'Dashboard', Icon: FaHouse },
    { to: '/ai/write-article', label: 'Write Article', Icon: FaSquare },
    { to: '/ai/blog-titles', label: 'Blog Titles', Icon: FaHashtag },
    { to: '/ai/remove-background', label: 'Remove Background', Icon: FaEraser },
    { to: '/ai/remove-object', label: 'Remove Object', Icon: FaScissors },
    { to: '/ai/community', label: 'Community', Icon: FaUser },
]

const Sidebar = ({ sidebar, setSidebar }) => {
    const { user } = useSelector(state => state.app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/auth/logout", { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    }

    if (!user) return null;

    return (
        <div className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-8' : 'max-sm:translate-x-full'} transition-all duration-300 ease-in-out`}>
            <div className='my-7 w-full'>
                <div className='w-13 h-13 rounded-full mx-auto bg-primary flex items-center justify-center text-white text-xl font-bold'>
                    {user.name.charAt(0)}
                </div>
                <h1 className='mt-1 text-center font-medium text-gray-800'>{user.name}</h1>
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
                <div className='flex gap-2 items-center cursor-pointer'>
                    <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold'>
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className='text-sm font-medium'>{user.name}</h1>
                        <p className='text-xs text-gray-500'>Pro Plan</p>
                    </div>
                </div>
                <IoMdLogOut onClick={logoutHandler} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer' />
            </div>
        </div>
    )
}

export default Sidebar;
