import React from 'react'
import GoogleIcon from '@mui/icons-material/Google';
const OAuth = () => {
  return (
    <button className='w-full flex items-center justify-center bg-red-700
     text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 
     active:shadow-lg hover:shadow-lg transition duration-150 ease-out rounded '>
     Continue with Google  <GoogleIcon className='ml-2 border border-white  rounded-full text-2xl'/>
    </button>
  )
}

export default OAuth
