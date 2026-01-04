import React, { useState } from 'react'
import { FaHashtag } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const BlogTitle = () => {
  const blogCategories = ['General', 'Technology', 'Business', 'Health', 'Lifestyle', 'Education', 'Travel', 'Food']
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a blog title for the keyword ${input} in the category ${selectedCategory}`

      const token = getToken ? await getToken() : null;
      const { data } = await axios.post('/api/ai/generate-blog-title', { prompt }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form onSubmit={submithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <FaHashtag className='w-6 text-[#8E37EB]' />
          <h1 className='text-xl font-semibold'>Ai Title Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Keyword</p>
        <input onChange={(e) => setInput(e.target.value)} value={input} type='text' className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' placeholder='Future Is Here...' required />
        <p className='mt-4 text-sm font-medium'>Category</p>
        <div className='mt-3 flex gap-3 flex-wrap'>
          {blogCategories.map((item, index) => (
            <span onClick={() => setSelectedCategory(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedCategory === item ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'}`} key={index}>{item}</span>
          ))}
        </div>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <FaHashtag className='w-5' />}
          Generate Title
        </button>
      </form>
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <FaHashtag className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Title</h1>
        </div>
        {
          !content ? (
            <div className='flex justify-center items-center mt-6 h-40'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <FaHashtag className='w-9 h-9' />
                <p>Enter A Topic and click "Generate Title" to get Started</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 overflow-y-auto text-sm text-slate-600 max-h-[520px]'>
              <div className='reset-tw'>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default BlogTitle