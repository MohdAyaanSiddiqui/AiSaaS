import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useSelector(state => state.app);
  const [loading, setLoading] = useState(true)

  const fetchCreations = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/user/get-published-creations", {
        withCredentials: true
      })
      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCreations()
  }, [fetchCreations])

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post("http://localhost:3000/api/user/toggle-like-creation", { id }, {
        withCredentials: true
      })

      if (data.success) {
        toast.success(data.message)
        await fetchCreations()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <h1 className='text-2xl font-semibold text-gray-800'>Community Creations</h1>
      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll p-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {creations.map((creation, index) => (
            <div key={index} className='relative group rounded-lg overflow-hidden shadow-md'>
              <img src={creation.content} alt="" className='w-full h-64 object-cover' />
              <div className='absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity'>
                <p className='text-sm line-clamp-2 mb-2'>{creation.prompt}</p>
                <div className='flex justify-between items-center'>
                  <div className='flex gap-1 items-center'>
                    <FaHeart
                      onClick={() => imageLikeToggle(creation._id)}
                      className={`w-5 h-5 cursor-pointer transition ${user && creation.likes.includes(user._id) ? 'text-red-500' : 'text-white'}`}
                    />
                    <p className='text-sm'>{creation.likes.length}</p>
                  </div>
                  <span className='text-xs bg-white/20 px-2 py-1 rounded'>{creation.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <div className='w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin'></div>
    </div>
  )
}

export default Community
