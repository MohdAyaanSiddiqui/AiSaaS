import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import LogoSaaS from "../assets/logo.svg"
import { FaXmark } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import Sidebar from '../Components/Sidebar';
import { SignIn, useUser } from '@clerk/clerk-react';

const Layout = () => {
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);
  const { user} = useUser();
  return user ? (
    <div className='flex flex-col items-start justify-start h-screen'>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
        <img src={LogoSaaS} alt='Logo' onClick={() => navigate('/')} className='h-18 w-18 rounded-full cursor-pointer ' />
        {
          sidebar ? <FaXmark onClick={() => setSidebar(false)} className='h-6 w-6 text-gray-600 sm:hidden' />
            : <IoIosMenu onClick={() => setSidebar(true)} className='h-6 w-6 text-gray-600 sm:hidden' />
        }
      </nav>
      <div className='flex-1 w-full h-[calc(100vh-64px)] flex'>
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className='flex-1 bg-[#F4F7FB]'>
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center h-screen'>
      <SignIn />
    </div>
  )
}

export default Layout