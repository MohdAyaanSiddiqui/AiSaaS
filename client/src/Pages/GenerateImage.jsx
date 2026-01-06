import { useAuth } from '@clerk/clerk-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FaImage } from 'react-icons/fa';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const GenerateImage = () => {

  const imageCategories = ['Realistic', 'Ghibli Style', 'Anime Style', 'Cartoon Style', 'Fantasy Style', 'Realistic Style', '3D Style', 'Portrait Style']
  
  const [selectedImage, setSelectedImage] = useState('Realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      const prompt = `Generate An Image of ${input} in the style ${selectedImage}`

      const token = await getToken();
      const { data } = await axios.post('/api/ai/generate-image', { prompt, 
        publish }, { headers: { Authorization: `Bearer ${token}` } })

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
      {/* left col */}
      <form onSubmit={submithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <FaImage className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>Ai Image Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
        
        <textarea 
        onChange={(e) => setInput(e.target.value)} 
        value={input} 
        rows={4} 
        className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
        placeholder='Describe What You want to see in image' 
        required />
        
        <p className='mt-4 text-sm font-medium'>Style</p>
        
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {imageCategories.map((item) => (
            <span 
            onClick={() => setSelectedImage(item)} 
            className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
              selectedImage === item ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'
            }`} 
            key={item}>
              {item}
            </span>
          ))}
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input 
            type='checkbox' 
            onChange={(e) => setPublish(e.target.checked)} 
            checked={publish} 
            className='sr-only peer'
            />
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4 '></span>
          </label>
          <p className='text-sm'>Make This Image Public </p>
        </div>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <FaImage className='w-5' />}
          Generate Image
        </button>
      </form>
      {/*Right Col*/}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        
        <div className='flex items-center gap-3'>
          <FaImage className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <FaImage className='w-15 h-15' />
              <p>Enter A Topic and click "Generate Image" to get Started</p>
            </div>
          </div>
        ) : (
          <div className=''>
            <img src={content} alt='image' className='w-full h-full' />
          </div>
        )
      }
      </div>
    </div>
  )
}

export default GenerateImage