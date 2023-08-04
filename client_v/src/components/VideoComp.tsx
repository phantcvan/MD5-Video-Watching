import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { incrementView } from '../slices/videoSlice';
import { VideoType } from '../static/type';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'
import VideoCompInfo from './VideoCompInfo';
interface VideoComp {
  video: VideoType,
  home: boolean
}
const VideoComp = ({ video, home }: VideoComp) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [description, setDescription] = useState(false);
  const dispatch = useDispatch();

  // hiển thị video khi hover
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(() => {
        setShowVideo(true);
      }, 500);
    }
    return () => clearTimeout(timer);
  }, [isHovered]);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowVideo(false);
  };

  // Khi click thì tăng view
  const handleVideoClick = () => {
    dispatch(incrementView(video.id));
  };

  return (
    <div className={`flex flex-col cursor-pointer mt-2 object-cover w-full`}>
      <Link to={`/video/${video.videoCode}`} onClick={handleVideoClick}>
        <div className={`overflow-hidden rounded-2xl w-full aspect-video`}
        >
          {showVideo ? (
            <ReactPlayer
              url={video.videoUrl}
              playing={true}
              muted
              width='100%'
              height='100%'
              // style={{aspectRatio: "4/3"}}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ) : (
            <img
              src={video.thumbnail}
              alt=""
              className={`w-[100%] object-cover z-10 aspect-video`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          )}
        </div>
      </Link>
      <VideoCompInfo video={video} home={home} description={description} />

    </div>
  )
}

export default VideoComp