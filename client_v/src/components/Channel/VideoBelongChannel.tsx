import React, { useState } from 'react'
import { VideoType } from '../../static/type'
import { useNavigate } from 'react-router';
import VideoComp from '../VideoComp';
import { useSelector } from 'react-redux';
import { getCurrentChannel } from '../../slices/channelSlice';

interface VideoProp {
  videos: VideoType[],
  editable: boolean,
  setEdited: React.Dispatch<React.SetStateAction<boolean>>
}
const VideoBelongChannel = ({ videos, editable, setEdited }: VideoProp) => {
  const [pick, setPick] = useState(1);
  const [videosPick, setVideosPick] = useState<VideoType[]>(videos);
  const navigate = useNavigate();
  const [home, setHome] = useState(false);

  const handleSetVideo = (num: number) => {
    setPick(num);
    if (num === 1) {
      const videoSort = videos.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
      setVideosPick(videoSort)
    } else if (num === 2) {
      const videoSort = videos.sort((a, b) => b.views - a.views);
      setVideosPick(videoSort)
    } else if (num === 3) {
      const videoSort = videos.sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime());
      setVideosPick(videoSort)
    }
  }
  return (
    <div>
      <div className='flex gap-3'>
        <span onClick={() => handleSetVideo(1)}
          className={`py-1 px-3 rounded-md cursor-pointer ${pick === 1 ? 'text-yt-black bg-yt-light-7'
            : 'text-yt-light-4 bg-yt-light-1 hover:bg-yt-light-3'}`}>
          Latest
        </span>
        <span onClick={() => handleSetVideo(2)}
          className={`py-1 px-3 rounded-md cursor-pointer ${pick === 2 ? 'text-yt-black bg-yt-light-7'
            : 'text-yt-light-4 bg-yt-light-1 hover:bg-yt-light-3'}`}>
          Popular
        </span>
        <span onClick={() => handleSetVideo(3)}
          className={`py-1 px-3 rounded-md cursor-pointer ${pick === 3 ? 'text-yt-black bg-yt-light-7'
            : 'text-yt-light-4 bg-yt-light-1 hover:bg-yt-light-3'}`}>
          Oldest
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-3">
        {videosPick?.map((video) => (
          <div
            className={``}
            key={video?.id}
          >
            <VideoComp
              video={video} home={home} editable={editable} setEdited={setEdited}
            />
          </div>
        ))}
      </div>
    </div >
  )
}

export default VideoBelongChannel