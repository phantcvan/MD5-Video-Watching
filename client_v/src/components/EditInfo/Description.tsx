import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getCurrentChannel } from '../../slices/channelSlice';

interface DesProp {
  setDesInput: React.Dispatch<React.SetStateAction<string>>,
  canceled: boolean
}
const Description = ({ setDesInput, canceled }: DesProp) => {
  const currentChannel = useSelector(getCurrentChannel);
  const [channelDes, setChannelDes] = useState('');
  console.log("canceled", canceled);

  useEffect(() => {
    setChannelDes(currentChannel?.about)
    if (canceled) {
      setChannelDes("")
    }
  }, [canceled])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    setChannelDes(e.target.value);
    if (input.replace(/\s+/g, ' ').trim()) {
      setDesInput(input.replace(/\s+/g, ' ').trim())
    }
  }

  return (
    <div className="flex flex-col my-3">
      <span className="text-yt-white font-semibold mb-2">Description</span>
      {channelDes
        ? <textarea onChange={handleInput} rows={5} value={channelDes}
          className='p-2 bg-yt-black border border-yt-light-5 text-yt-light-4 rounded-md 
        focus:outline-none resize-none' />
        : <textarea onChange={handleInput} rows={5}
          placeholder='Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places.'
          className='p-2 bg-yt-black border border-yt-light-5 text-yt-light-4 rounded-md 
          focus:outline-none resize-none' />}

    </div>
  )
}

export default Description