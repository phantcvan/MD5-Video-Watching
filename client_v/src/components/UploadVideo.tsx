import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

interface Upload {
  setOpenUpload: React.Dispatch<React.SetStateAction<boolean>>
}

const UploadVideo = ({ setOpenUpload }: Upload) => {
  return (
    <div
      className="w-[100%] absolute top-80 left-0 bg-overlay-40 flex items-center 
  justify-center z-20"
    >
      <div
        className="w-[100%] h-[100%] fixed top-0 left-0 bg-overlay-40 flex items-center 
    justify-center z-[21]"
        onClick={() => setOpenUpload(false)}
      >
      </div>
      <div
        className="wrap_img w-[800px] h-[600px] bg-yt-light-2 text-yt-white px-5 pt-4 flex flex-col gap-5 
      fixed rounded-md z-[25]"
      >
        <div
          className="absolute top-5 right-5 cursor-pointer "
          onClick={() => setOpenUpload(false)}
        >
          <AiOutlineClose />
        </div>
        UploadVideo
      </div>
    </div>
  )
}

export default UploadVideo