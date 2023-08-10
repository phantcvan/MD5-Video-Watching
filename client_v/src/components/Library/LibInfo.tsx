import { useSelector } from "react-redux"
import { getCurrentChannel } from "../../slices/channelSlice"
import axios from "axios";
import { useEffect, useState } from "react";

interface LibInfoProp {
  uploadCount: number,
  likedCount: number
}

const LibInfo = ({uploadCount, likedCount}:LibInfoProp) => {
  const currentChannel = useSelector(getCurrentChannel);

  
  return (
    <div className='flex flex-1 flex-col items-center justify-center h-screen mt-[-50px] gap-2 mr-5'>
      <img src={currentChannel?.logoUrl} 
      className="w-20 h-20 rounded-full overflow-hidden object-cover" />
      <span className="mb-6">{currentChannel?.channelName}</span>
      <div className="flex w-full justify-between items-center border-t border-t-yt-light-3 text-sm
        text-yt-light-5">
        <span className="pt-1">Subscriptions</span>
        <span className="">2</span>
      </div>
      <div className="flex w-full justify-between items-center border-t border-t-yt-light-3 text-sm
        text-yt-light-5">
        <span className="pt-1">Uploads</span>
        <span className="">{uploadCount}</span>
      </div>
      <div className="flex w-full justify-between items-center border-y border-b-yt-light-3 text-sm
         border-t-yt-light-3 text-yt-light-5">
        <span className="pt-1 pb-2">Likes</span>
        <span className="">{likedCount}</span>
      </div>
    </div>
  )
}

export default LibInfo