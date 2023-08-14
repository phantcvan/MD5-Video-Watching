import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllChannels, getCurrentChannel, setCurrentChannel } from "../slices/channelSlice";
import { useEffect, useState } from "react";
import { VideoType } from "../static/type";
import { Link, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import '../index.css'
import VideoCompInfo from "../components/VideoCompInfo";
import { setPickSidebar } from "../slices/appSlice";


const Liked = () => {
  const currentChannel = useSelector(getCurrentChannel)
  const [videosLiked, setVideosLiked] = useState<VideoType[]>([]);
  const [finalVideo, setFinalVideo] = useState<VideoType | null>(null);
  const [home, setHome] = useState(false);
  const [description, setDescription] = useState(false);
  const [editable, setEditable] = useState(false);
  const [edited, setEdited] = useState(false);
  const dispatch = useDispatch();
  const allCookies = document.cookie;
  const navigate = useNavigate();



  const fetchLikedVideo = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/auth', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setCurrentChannel(response?.data))
      try {
        const [reactionResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/reaction/filterByChannelId/${response?.data?.id}`),
        ]);
        setVideosLiked(reactionResponse?.data);
        if (reactionResponse?.data?.length > 0) {
          setFinalVideo(reactionResponse?.data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error('Error checking login:', error);
      return false;
    }
  };
  useEffect(() => {
    const cookieArray = allCookies.split(';');
    let accessToken = '';
    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        accessToken = value;
        dispatch(setPickSidebar("Liked"))
        fetchLikedVideo(accessToken);
        break;
      }
    }
    if (accessToken === '') {
      navigate('/')
    }

  }, []);
  const backgroundStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 1)), url(${finalVideo?.thumbnail})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '2500% auto', 
    backgroundPosition: 'center top', 
  };



  return (
    <div className={`max-w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex z-0 flex-col ml-[18px]
    sm:px-6 md:px-7 lg:px-8 xl:px-9`}>
      {videosLiked.length > 0 ? (
        <div className="flex gap-4 mt-3 relative">
          <div className="flex flex-col w-[40%] p-3 rounded-lg bg_like overflow-hidden fixed top-20"
            style={backgroundStyle}>
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
          <div className="flex flex-1 overflow-y-auto ml-[520px]">
            <div className="pt-3 ">
              {videosLiked?.slice(1).map((video, i) => (
                <div className="hover:bg-yt-light-3 px-3 py-[1px] rounded-md">
                  <Link key={i} to={`/video/${video.videoCode}`}>
                    <div className='flex justify-between items-start my-3 gap-1 hide-scrollbar-x' key={video?.id}>
                      <Link to={`/video/${video?.videoCode}`}>
                        <div className='w-[168px] aspect-video rounded-md cursor-pointer'>
                          <img src={video.thumbnail}
                            alt=""
                            className={`w-[100%] object-cover aspect-video rounded-md`} />
                        </div>
                      </Link>
                      <div className='flex flex-1 '>
                        <VideoCompInfo video={video} home={home} description={description}
                          editable={editable} setEdited={setEdited} />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
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