import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCurrentChannel } from '../../slices/channelSlice'

interface NameProp {
  setNameInput: React.Dispatch<React.SetStateAction<string>>,
  canceled: boolean
}
const Name = ({ setNameInput, canceled }: NameProp) => {
  const currentChannel = useSelector(getCurrentChannel);
  const [channelName, setChannelName] = useState('');
  useEffect(() => {
    setChannelName(currentChannel?.channelName)
    if (canceled) {
      setChannelName("")
    }
  }, [canceled])

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setChannelName(e.target.value);
    if (input.replace(/\s+/g, ' ').trim()) {
      setNameInput(input.replace(/\s+/g, ' ').trim())
    }
  }
  return (
    <div className="flex flex-col my-3">
      <span className="text-yt-white font-semibold">Name</span>
      <span className="text-yt-light-5 my-2">
        Choose a channel name that represents you and your content.
      </span>
      <input type="text" value={channelName} onChange={handleInput}
        className='p-2 bg-yt-black border border-yt-light-5 text-yt-light-4 rounded-md focus:outline-none' />
    </div>
  )
}

export default Name