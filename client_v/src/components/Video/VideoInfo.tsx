import { Link } from 'react-router-dom';
import { VideoType } from '../../static/type'
import { useSelector } from 'react-redux';
import { getUser } from '../../slices/userSlice';
import VideoAction from './VideoAction';
import { MdVerified } from 'react-icons/md';
import { FaRegBell } from "react-icons/fa";
import { useState } from 'react';
import { getCurrentChannel } from '../../slices/channelSlice';


interface VideoComp {
  video: VideoType | null
}
const VideoInfo = ({ video }: VideoComp) => {
  const currentChannel = useSelector(getCurrentChannel);
  const [isSubscribe, setIsSubscribe] = useState(false);
  let userEmail = ""
  if (currentChannel) userEmail = currentChannel.email
  const handleAddSubscribe = () => {

  }

  return (
    <div className="flex items-center justify-between w-[100%] mt-1">
      <div className="flex gap-3 justify-between items-center basis-2/3">
        <div className='flex gap-3 items-center'>
          <div className='h-9 w-9'>
            <Link to={`/channel/${video?.channel?.id}`}>
              <img src={video?.channel?.logoUrl} alt="" className="h-9 w-9 rounded-full" />
            </Link>
          </div>
          <Link to={`/channel/${video?.channel?.id}`}>
            <div className='flex flex-col'>
              <div className='flex'>
                <h3 className="text-yt-white font-medium text-base">
                  {video?.channel?.channelName && video?.channel?.channelName.length <= 25
                    ? video?.channel?.channelName
                    : `${video?.channel?.channelName && video?.channel?.channelName.substr(0, 20)}...`}
                </h3>
                <span className="p-1 text-yt-light-4">
                  <MdVerified />
                </span>
              </div>
              <span className='text-yt-light-5 text-sm'>
                subscribers
              </span>
            </div>
          </Link>
        </div>
        {video?.channel?.email !== userEmail
          ? isSubscribe
            ? <button className="bg-yt-light-2 text-yt-white flex px-3 py-2 rounded-lg text-sm font-medium"
              onClick={handleAddSubscribe}>
              <span className='flex items-center gap-2'><FaRegBell size={18} /> Subscribed</span>
            </button>
            : <button className="bg-yt-white px-3 py-2 rounded-lg text-sm font-medium"
              onClick={handleAddSubscribe}>
              Subscribe
            </button>
          : <></>}

      </div>
      <div className='flex flex-1'>
        <VideoAction video={video} />
      </div>
    </div>


  )
}

export default VideoInfo