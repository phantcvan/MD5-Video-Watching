import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../slices/userSlice'
import { getCurrentChannel, setCurrentChannel } from '../slices/channelSlice'
import axios from 'axios'

interface PauseProp {
  setOpenPauseModal: React.Dispatch<React.SetStateAction<boolean>>
}
const ModalPauseHistory = ({ setOpenPauseModal }: PauseProp) => {
  const currentChannel = useSelector(getCurrentChannel);
  const dispatch = useDispatch();
  // console.log("currentChannel", currentChannel);

  if (!currentChannel) {
    setOpenPauseModal(false)
  }
  const handleChange = async () => {
    try {
      const [changeResponse] = await Promise.all([
        axios.put(`http://localhost:5000/api/v1/channel/record/${currentChannel?.id}`)
      ])
      let newRecord
      if (currentChannel?.recordHistory === 1) {
        newRecord = 0
      } else {
        newRecord = 1
      }
      const updatedChannel = { ...currentChannel, recordHistory: newRecord };
      dispatch(setCurrentChannel(updatedChannel))
      setOpenPauseModal(false)
    } catch (error) {

    }
  }

  return (
    <div className="w-[100%] absolute top-80 h-fit left-0 bg-overlay-40 flex items-center 
  justify-center z-30">
      <div className="w-[100%] h-[100%] fixed left-0 bg-overlay-40 flex items-center 
    justify-center z-[31]" onClick={() => setOpenPauseModal(false)}>
      </div>
      <div className="w-[800px] h-fit bg-yt-light-2 text-yt-white px-5 pt-4 flex flex-col
       gap-5 fixed top-40 rounded-md z-[35]">
        <div className="absolute top-5 right-5 cursor-pointer "
          onClick={() => setOpenPauseModal(false)}>
          <AiOutlineClose />
        </div>
        <div className='flex flex-col'>
          <span className='ml-2 my-2 text-lg'>
            {currentChannel?.recordHistory === 1 ? "Pause watch history?" : "Turn on watch history?"}
          </span>
          <span className='ml-2 my-2 text-yt-light-5'>
            {currentChannel?.channelName} ({currentChannel?.email})
          </span>
          <span className='ml-2 my-2 text-yt-light-5'>
            {currentChannel?.recordHistory === 1
              ? `Pausing YouTube watch history can make it harder to find videos you watched, and you may
               see fewer recommendations for new videos in YouTube and other Google products.`
              : `Your private YouTube watch history makes your recently watched videos on YouTube easy to
               find and improves recommendations in YouTube and other Google products.`}
          </span>
          <span className='ml-2 my-2 text-yt-light-5'>
            {currentChannel?.recordHistory === 1
              ? `Remember, pausing this setting doesn't delete any previous activity, but you can view,
               edit and delete your private YouTube watch history data anytime.`
              : `When YouTube watch history is on, this data may be saved from any of your signed-in
               devices. You can always control and review your activity at My Account.`}

          </span>
          <div className='flex justify-end mb-5 gap-2'>
            <span className='text-yt-white px-5 py-2 hover:bg-yt-light-6 cursor-pointer rounded-l-full
             rounded-r-full' onClick={() => setOpenPauseModal(false)}>
              Cancel
            </span>
            <span className='text-yt-blue-2 px-5 py-2 hover:bg-yt-blue-1 cursor-pointer rounded-l-full
             rounded-r-full' onClick={handleChange}>
              {currentChannel?.recordHistory === 1
                ? "Pause"
                : "Turn on"}
            </span>
          </div>

        </div>


      </div>
    </div>
  )
}

export default ModalPauseHistory