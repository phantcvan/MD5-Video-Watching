import React from 'react'
import { BiSolidHome } from 'react-icons/bi'
import { MdOutlineSubscriptions, MdVideoLibrary } from 'react-icons/md'
import { Link } from 'react-router-dom';
import { GoHistory } from "react-icons/go";

const MiniSidebar = () => {
  return (
    <div className='flex flex-col gap-6 items-center text-yt-white mx-4 text-xs mt-16 fixed top-0'>
      <Link to="/">
        <div className='flex flex-col items-center justify-center gap-1 cursor-pointer'>
          <BiSolidHome size={24} />
          Home
        </div>
      </Link>

      <Link to="/subscription">
        <div className='flex flex-col items-center justify-center gap-1 cursor-pointer'>
          <MdOutlineSubscriptions size={21} />
          Subscription
        </div>
      </Link>

      <Link to="/library">
        <div className='flex flex-col items-center justify-center gap-1 cursor-pointer'>
          <MdVideoLibrary size={21} />
          Library
        </div>
      </Link>

      <Link to="/history">
        <div className='flex flex-col items-center justify-center gap-1 cursor-pointer'>
          <GoHistory size={21} />
          History
        </div>
      </Link>

    </div>
  )
}

export default MiniSidebar