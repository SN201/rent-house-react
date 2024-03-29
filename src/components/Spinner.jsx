import React from 'react'
import Loading from '../assets/svg/loading.svg'
const Spinner = () => {
  return (
    <div className='flex justify-center items-center
     bg-black bg-opacity-50 fixed left-0 
     right-0 bottom-0 top-0 z-50'>
        <div>
            <img src={Loading} alt='Spinner' className='h-24'/>
        </div>
    </div>
  )
}

export default Spinner
