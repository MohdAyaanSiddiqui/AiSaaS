import React, { useState } from 'react'
import { Outlet, useNavigate, Navigate } from 'react-router-dom'
import LogoSaaS from "../assets/logo.jpeg"
import { FaXmark } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import Sidebar from '../Components/Sidebar';
import { useSelector } from 'react-redux';

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user } = useSelector(state => state.app);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className='flex flex-col items-start justify-start h-screen overflow-hidden'>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200 bg-white'>
        <img src={LogoSaaS} alt='Logo' onClick={() => navigate('/')} className='h-18 w-18 rounded-full cursor-pointer ' />
        {
          sidebar ? <FaXmark onClick={() => setSidebar(false)} className='h-6 w-6 text-gray-600 sm:hidden' />
            : <IoIosMenu onClick={() => setSidebar(true)} className='h-6 w-6 text-gray-600 sm:hidden' />
        }
      </nav>
      <div className='flex-1 w-full h-[calc(100vh-64px)] flex overflow-hidden'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 bg-[#F4F7FB] overflow-y-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout;