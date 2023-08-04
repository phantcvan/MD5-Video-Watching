import React from 'react'
import { useParams } from 'react-router'

const Hashtag = () => {
  const {id:tag}=useParams()
  console.log(tag);
  
  return (
    <div className={`max-w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex z-0 flex-col ml-[18px]
    sm:px-6 md:px-7 lg:px-8 xl:px-9`}>
      Hashtag
    </div>
  )
}

export default Hashtag