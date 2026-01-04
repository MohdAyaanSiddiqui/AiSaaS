import React, { useState } from 'react'
import { FaScissors } from 'react-icons/fa6';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const RemoveObject = () => {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (object.split(' ').length > 1) {
        return toast('Please Enter One Object Name')
      }
      const formData = new FormData();
      formData.append('image', input)
      formData.append('object', object)

      const token = getToken ? await getToken() : null;
      const { data } = await axios.post('/api/ai/generate-remove-object', formData, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
        toast.error(error.message)
    }
    setLoading(false);
  }
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-center flex-wrap gap-4 text-slate-700'>
      <form onSubmit={submithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <FaScissors className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>
        <input onChange={(e) => setInput(e.target.files[0])} type='file' accept='image/*' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' required />
        <p className='mt-6 text-sm font-medium'>Describe Your Name To Remove</p>
        <textarea onChange={(e) => setObject(e.target.value)} value={input} rows={4} className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='e.g., watch or spoon, Only Single Object Name' required />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <FaScissors className='w-5' />
          }
          Remove Object
        </button>
      </form>
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <FaScissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>
        {
          !content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <FaScissors className='w-9 h-9' />
                <p>Upload an image and click "Remove Object" to get started</p>
              </div>
            </div>
          ) : (
            <img src={content} alt='image' className='mt-3 w-full h-full' />
          )
        }
      </div>
    </div>
  )
}

export default RemoveObject