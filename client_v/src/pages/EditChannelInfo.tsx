import React from 'react'
import { useSelector } from 'react-redux'
import { getCurrentChannel } from '../slices/channelSlice'
import { useNavigate, useParams } from 'react-router';

const EditChannelInfo = () => {
  const currentChannel = useSelector(getCurrentChannel);
  const { id: channelCode } = useParams();
  const navigate = useNavigate()
  if (currentChannel?.channelCode !== channelCode) {
    navigate('/')
  }
  return (
    <div className={`max-w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex z-0 flex-col
    sm:px-6 md:px-7 lg:px-8 xl:px-9 ml-7`}>
      EditChannelInfo
    </div>
  )
}

export default EditChannelInfo