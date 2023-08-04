import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../slices/userSlice'
import { getCurrentChannel, setCurrentChannel } from '../slices/channelSlice'
import axios from 'axios'

interface DeleteProp {
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalDeleteHistory = ({ setOpenDeleteModal }: DeleteProp) => {
  const currentChannel = useSelector(getCurrentChannel);
  const dispatch = useDispatch();
  // console.log("currentChannel", currentChannel);

  if (!currentChannel) {
    setOpenDeleteModal(false)
  }
  const handleChange = async () => {
    try {
      const [changeResponse] = await Promise.all([
        axios.put(`http://localhost:5000/api/v1/channel/record/${currentChannel?.id}`)
      ])
      // let newRecord
      // if (currentChannel?.recordHistory === 1) {
      //   newRecord = 0
      // } else {
      //   newRecord = 1
      // }
      // const updatedChannel = { ...currentChannel, recordHistory: newRecord };
      // dispatch(setCurrentChannel(updatedChannel))
      // setOpenPauseModal(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-[100%] absolute top-80 h-fit left-0 bg-overlay-40 flex items-center 
  justify-center z-30">
      <div className="w-[100%] h-[100%] fixed left-0 bg-overlay-40 flex items-center 
    justify-center z-[31]" onClick={() => setOpenDeleteModal(false)}>
      </div>
      <div className="w-[800px] h-fit bg-yt-light-2 text-yt-white px-5 pt-4 flex flex-col
       gap-5 fixed top-40 rounded-md z-[35]">
        <div className="absolute top-5 right-5 cursor-pointer "
          onClick={() => setOpenDeleteModal(false)}>
          <AiOutlineClose />
        </div>
        <div className='flex flex-col'>
          <span className='ml-2 my-2 text-lg'>
            Clear watch history?
          </span>
          <span className='ml-2 my-2 text-yt-light-5'>
            {currentChannel?.channelName} ({currentChannel?.email})
          </span>
          <span className='ml-2 my-2 text-yt-light-5'>
            Your YouTube watch history will be cleared from all YouTube apps on all devices.
          </span>
          <span className='ml-2 my-2 text-yt-light-5'>
            Your video recommendations will be reset, but may still be influenced by activity on other Google
            products. To learn more, visit My Activity.
          </span>
          <div className='flex justify-end mb-5 gap-2'>
            <span className='text-yt-white px-5 py-2 hover:bg-yt-light-6 cursor-pointer rounded-l-full
             rounded-r-full' onClick={() => setOpenDeleteModal(false)}>
              Cancel
            </span>
            <span className='text-yt-blue-2 px-5 py-2 hover:bg-yt-blue-1 cursor-pointer rounded-l-full
             rounded-r-full' onClick={handleChange}>
              Clear watch history
            </span>
          </div>

        </div>


      </div>
    </div>
  )
}

export default ModalDeleteHistory