import React, { useState } from 'react'
import { FaEdit } from 'react-icons/fa';
import { FaHandSparkles } from 'react-icons/fa6'
import axios from 'axios'
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

// Fallback to localhost if VITE_BASE_URL is missing
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

const WriteArticle = () => {

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const submithandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `
      Write a detailed, well-structured article on "${input}". 
      Include:
      - Introduction
      - Multiple headings and subheadings
      - Examples where applicable
      - Conclusion
      - Flowing transitions between sections
      - Comprehensive coverage of the topic`;

      const { data } = await axios.post("http://localhost:3000/api/ai/generate-article", { prompt }, {
        withCredentials: true
      })

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='min-h-[calc(100vh-64px)] p-6 flex items-start gap-6 text-slate-700 flex-wrap md:flex-nowrap'>
      {/*left col*/}
      <form onSubmit={submithandler} className='w-full md:w-1/2 p-6 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <FaHandSparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Article Configuration</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Article Topic</p>

        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Future Is Here...'
          required
        />
        <br />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {
            loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
              : <FaEdit className='w-5' />
          }
          Generate Article Here
        </button>
      </form>
      {/*Right Col*/}
      <div className='w-full md:w-1/2 p-6 bg-white rounded-lg flex flex-col border border-gray-200 min-h-[300px] max-h-[600px] overflow-hidden'>

        <div className='flex items-center gap-3'>
          <FaEdit className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Article</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <FaEdit className='w-9 h-9' />
              <p>Enter A Topic and click "Generate Article" to get Started</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 overflow-y-auto text-sm text-slate-600 max-h-[520px]'>
            <div className='reset-tw'>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default WriteArticle