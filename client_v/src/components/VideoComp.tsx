import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { incrementView } from '../slices/videoSlice';
import { VideoType } from '../static/type';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player'
import VideoCompInfo from './VideoCompInfo';
interface VideoComp {
  video: VideoType,
  home: boolean,
  editable: boolean,
  setEdited: React.Dispatch<React.SetStateAction<boolean>>
}
const VideoComp = ({ video, home, editable, setEdited }: VideoComp) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [description, setDescription] = useState(false);
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(-1);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // hiển thị video khi hover
  useEffect(() => {
    if (isHovered && videoLoaded) {
      setShowVideo(true);
    }
  }, [isHovered, videoLoaded]);
  console.log("showVideo", showVideo);
  console.log("isHovered", isHovered);
  console.log("videoLoaded", videoLoaded);

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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {showVideo ? (
            <ReactPlayer
              url={video.videoUrl}
              playing={true}
              muted
              width='100%'
              height='100%'
            />
          ) : isHovered
            ? <div className='relative'>
              <div className='absolute top-0 z-20'>
                <ReactPlayer
                  url={video.videoUrl}
                  playing={true}
                  muted
                  width='100%'
                  height='100%'
                  // style={{aspectRatio: "4/3"}}
                  onReady={() => setVideoLoaded(true)}
                />
              </div>
              <img
                src={video.thumbnail}
                alt=""
                className={`w-[100%] object-cover aspect-video absolute top-0 z-30`}
              />
            </div>
            : (
              <img
                src={video.thumbnail}
                alt=""
                className={`w-[100%] object-cover z-10 aspect-video`}
              />
            )}
        </div>
      </Link>
      <VideoCompInfo video={video} home={home} description={description} editable={editable}
        setEdited={setEdited} />

    </div>
  )
}

export default VideoComp