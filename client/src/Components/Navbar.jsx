import React from 'react'
import { useNavigate } from 'react-router-dom'
import LogoSaaS from "../assets/logo.jpeg"
import { FaArrowRight } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../redux/appSlice'
import toast from 'react-hot-toast'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.app);

  const logoutHandler = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
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

  return (
    <div className='fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32'>
      <img src={LogoSaaS} alt='Logo' className='w-12 sm:w-18 cursor-pointer rounded-full' onClick={() => navigate('/')} />

      {
        user ? (
          <div className='flex items-center gap-4'>
            <span className='text-black text-sm hidden sm:block'>Hi, {user.name}</span>
            <button onClick={logoutHandler} className='bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm px-6 py-2 rounded-full cursor-pointer transition'>Logout</button>
          </div>
        )
          :
          (
            <button onClick={() => navigate('/login')} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'>Get Started<FaArrowRight className='w-4 h-4' /></button>
          )
      }
    </div>
  )
}

export default Navbar
