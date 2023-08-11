import React, { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import UploadStep1 from './UploadStep1'
import UploadStep2 from './UploadStep2'

interface Upload {
  setOpenUpload: React.Dispatch<React.SetStateAction<boolean>>
}

const UploadVideo = ({ setOpenUpload }: Upload) => {
  const [videoUrl, setVideoUrl] = useState("")
  const [step, setStep] = useState(1)
  return (
    <div
      className="w-[100%] absolute top-80 left-0 bg-overlay-40 flex items-center 
  justify-center z-20 overflow-y-auto"
    >
      <div
        className="w-[100%] h-[100%] fixed top-0 left-0 bg-overlay-40 flex items-center 
    justify-center z-[21]"
        onClick={() => setOpenUpload(false)}
      >
      </div>
      <div
        className="wrap_img w-[800px] h-[500px] bg-yt-light-2 text-yt-white px-5 pt-4 flex flex-col gap-5 
      fixed rounded-md z-[25]"
      >
        <div
          className="absolute top-5 right-5 cursor-pointer "
          onClick={() => setOpenUpload(false)}
        >
          <AiOutlineClose />
        </div>
        <span className="text-center text-2xl font-semibold mt-2">Upload a new Video</span>
        {step === 1
          ? <UploadStep1 setVideoUrl={setVideoUrl} setStep={setStep} />
          : <UploadStep2 videoUrl={videoUrl} setOpenUpload={setOpenUpload} />
        }
      </div>
    </div>
  )
}

export default UploadVideo