import { Link, useNavigate } from 'react-router-dom';
import { VideoType } from '../../static/type'
import VideoCompInfo from '../VideoCompInfo';
import { useState } from 'react';
import "../../index.css"

interface SubsProp {
  subscribe: VideoType,
}
const SubsItem = ({ subscribe }: SubsProp) => {
  const [home, setHome] = useState(false);
  const [description, setDescription] = useState(true);
  const navigate = useNavigate()

  return (
    <div>
      <div className='flex items-center my-3 gap-3 hide-scrollbar-y'
        onClick={() => navigate(`/channel/${subscribe?.channel.channelCode}`)}>
        <img src={subscribe?.channel.logoUrl} className='w-8 h-8 rounded-full cursor-pointer' />
        <span className='text-yt-white font-semibold cursor-pointer'>{subscribe?.channel.channelName}</span>
      </div>
      <div className='flex justify-between items-start my-3 gap-2 hide-scrollbar-x'>
        <Link to={`/video/${subscribe?.videoCode}`}>
          <div className='w-[246px] aspect-video rounded-md cursor-pointer'>
            <img src={subscribe?.thumbnail}
              alt=""
              className={`w-[100%] object-cover aspect-video rounded-md`} />
          </div>
        </Link>
        <div className='flex flex-1 '>
          <VideoCompInfo video={subscribe} home={home} description={description} />
        </div>
      </div>
    </div>
  )
}

export default SubsItem