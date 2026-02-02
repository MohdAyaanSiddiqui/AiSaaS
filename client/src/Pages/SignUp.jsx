import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { setUser } from "../redux/appSlice.js"
import toast from 'react-hot-toast';
const SignUp = () => {
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
    })
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const submithandler = async (e) => {
        e.preventDefault();
        console.log(input);
        try {
            const res = await axios.post("http://localhost:3000/api/auth/signup", input, {
                headers: {
                    'Content-Type': "application/json"
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                navigate("/login");
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message)
        }
    }
    return (
        <section className='min-h-screen w-full bg-gradient-to-br from-black via-[#0b1a12] to-black flex items-center justify-center relative'>
            <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mb-10 size-140 pointer-events-none bg-green-500/35 rounded-full blur-[200px]'></div>

            <div className='text-center md:text-left mt-12'>
                <div className="flex items-center  p-1.5 rounded-full border border-green-900 text-xs w-fit mx-auto md:mx-0">
                    <div className="flex items-center">
                        <img className="size-7 rounded-full border border-green-900" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1" />
                        <img className="size-7 rounded-full border border-green-900 -translate-x-2" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" />
                        <img className="size-7 rounded-full border border-green-900 -translate-x-4" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop" alt="userImage3" />
                    </div>

                    <p className="-translate-x-2 text-xs text-slate-200">Join our DocuBrain Community</p>
                </div>
                <h1 className='font-medium text-3xl md:text-5xl/15 bg-linear-to-r from-white to-green-300 bg-clip-text text-transparent max-w-[470px] mt-4'>Ready to experience our DocuBrain?</h1>
                <p className='text-sm/6 text-white max-w-[345px] mt-4 mx-auto md:mx-0'>SignUp & Turn your PDFs into clear summaries and answer with AI-powered DocuBrain</p>
                <div className='mt-6 text-center relative z-20'>
                    <button type='button' onClick={() => navigate("/login")} className='text-sm text-indigo-400 hover:text-indigo-300 underline'>Already have an account? Login</button>
                </div>
            </div>
            <div className='w-full max-w-lg bg-[#00A63E]/0 backdrop-blur-sm border border-white/10 rounded-xl p-8'>
                <form onSubmit={submithandler} className='space-y-6'>
                    <div>
                        <label className='block text-white text-sm mb-2'>Name</label>
                        <input
                            onChange={changeHandler}
                            value={input.name}
                            type="text"
                            name="name"
                            required
                            placeholder="Eden Johnson"
                            className='w-full bg-[#00A63E]/5 border border-white/20 rounded-lg px-4 py-3 text-white/40 placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:border-green-600 transition'
                        />
                    </div>

                    <div>
                        <label className='block text-white text-sm mb-2'>Email</label>
                        <input
                            onChange={changeHandler}
                            value={input.email}
                            type="email"
                            name="email"
                            required
                            placeholder="Eden@example.com"
                            className='w-full bg-[#00A63E]/5 border border-white/20 rounded-lg px-4 py-3 text-white/40 placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:border-green-600 transition'
                        />
                    </div>
                    <div>
                        <label className='block text-white text-sm mb-2'>Password</label>
                        <input
                            onChange={changeHandler}
                            value={input.password}
                            type="password"
                            name="password"
                            required
                            placeholder="Eden123"
                            className='w-full bg-[#00A63E]/5 border border-white/20 rounded-lg px-4 py-3 text-white/40 placeholder:text-white/40 placeholder:text-sm focus:outline-none focus:border-green-600 transition'
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <p className='text-xs md:text-sm text-white/60 max-w-3xs'>
                            By submitting, you agree to our <span className='text-white'>Terms</span> and <span className='text-white'>Privacy Policy</span>.
                        </p>
                        <button type="submit" className='bg-linear-to-r from-green-950 to-green-600 hover:from-green-600 hover:to-green-950 text-white text-sm px-8 md:px-16 py-3 rounded-full transition duration-300 cursor-pointer'>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default SignUp