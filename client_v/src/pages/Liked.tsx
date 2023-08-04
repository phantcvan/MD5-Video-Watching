import axios from "axios";
import { useSelector } from "react-redux";
import { getAllChannels, getCurrentChannel } from "../slices/channelSlice";
import { useEffect, useState } from "react";
import { VideoType } from "../static/type";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import '../index.css'


const Liked = () => {
  const currentChannel = useSelector(getCurrentChannel)
  const [videosLiked, setVideosLiked] = useState<VideoType[]>([]);
  const [finalVideo, setFinalVideo] = useState<VideoType | null>(null);



  const fetchLikedVideo = async () => {
    try {
      const [reactionResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/reaction/filterByChannelId/${currentChannel?.id}`),
      ]);
      // console.log(reactionResponse);
      setVideosLiked(reactionResponse?.data);
      if (reactionResponse?.data?.length > 0) {
        setFinalVideo(reactionResponse?.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchLikedVideo();
  }, []);
  const backgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.85) 30%, rgba(0, 0, 0, 1)),
     url(${finalVideo?.thumbnail})`,
  };


  return (
    <div className={`max-w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex z-0 flex-col ml-[18px]
    sm:px-6 md:px-7 lg:px-8 xl:px-9`}>
      {videosLiked.length > 0 ? (
        <div className="flex gap-3 mt-3">
          <div className="flex flex-col w-[40%] p-3 rounded-lg bg_like overflow-hidden" style={backgroundStyle}>
            <div className="w-full aspect-video p-3 rounded-lg">
              <Link to={`/video/${finalVideo?.videoCode}`}>
                <ReactPlayer
                  url={finalVideo?.videoUrl}
                  controls
                  width='100%'
                  height='100%'
                />
              </Link>
            </div>
            <span className="font-bold text-2xl text-yt-white my-4 px-3">
              Liked Videos
            </span>
            <span className=" text-yt-white px-3">{currentChannel?.channelName}</span>
            <span className=" text-yt-gray my-1 px-3">
              {videosLiked?.length} videos
            </span>
          </div>
          <div className="flex flex-1 overflow-y-auto">
          <div className="pt-3 ">
                {videosLiked?.map((video, i) => {
                  if (video?.id !== finalVideo?.id) {
                    return (
                      <Link key={i} to={`/video/${video.id}`}>
                        {/* <RecommendVideo
                          {...video}
                          allChannels={allChannels}
                          id={video?.id}
                        /> */}
                      </Link>
                    );
                  }
                })}
              </div>
          </div>
        </div>
      ) : currentChannel ? (
        <span className="text-center text-2xl mt-16 text-yt-white">
          {" "}
          You have not liked any video
        </span>
      ) : (
        <span className="text-center text-2xl mt-16 text-yt-white">
          {" "}
          Log in to like videos
        </span>
      )}
    </div>
  )
}

export default Liked