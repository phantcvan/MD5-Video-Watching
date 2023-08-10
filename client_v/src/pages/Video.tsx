import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AllTags, VideoType } from '../static/type';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentWidth } from '../slices/appSlice';
import ReactPlayer from 'react-player';
import VideoInfo from '../components/Video/VideoInfo';
import "../index.css"
import VideoDescribe from '../components/Video/VideoDescribe';
import VideoCmt from '../components/Video/VideoCmt';
import Recommend from '../components/Video/Recommend';
import { getCurrentChannel, setCurrentChannel } from '../slices/channelSlice';
import { getCurrentDate } from '../static/fn';


const Video = () => {
  const { id: videoCode } = useParams();
  const [video, setVideo] = useState<VideoType | null>(null);
  const curWid = useSelector(getCurrentWidth)
  const [tags, setTags] = useState<AllTags[]>([])
  const [forKid, setForKid] = useState(false);
  const currentChannel = useSelector(getCurrentChannel)
  const allCookies = document.cookie;
  const navigate = useNavigate();
  const dispatch = useDispatch()



  const fetchDataChangeId = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/auth', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setCurrentChannel(response?.data))
      try {
        const [
          videoResponse,
        ] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/videos/${videoCode}`),
        ]);

        setVideo(videoResponse?.data);
        // updateView(videoResponse?.data.views, videoResponse?.data?.id);
        const updatedViews = videoResponse?.data.views + 1;
        const formattedDate = getCurrentDate();
        // console.log(formattedDate);
        const newHistory = {
          channelId: response?.data?.id,
          videoId: videoResponse?.data?.id,
          view_date: formattedDate
        }
        try {
          const [tagsResponse, viewResponse, historyResponse,] = await Promise.all([
            axios.get(`http://localhost:5000/api/v1/tag/tagForVideo/${videoResponse?.data?.id}`),
            axios.put(`http://localhost:5000/api/v1/videos/view/${videoCode}`,
              { views: updatedViews }
            ),
            axios.post(`http://localhost:5000/api/v1/history`, newHistory),


          ]);
          const isForKid = tagsResponse?.data.find((tag: AllTags) => tag.tag === 'kid')
          console.log("tagsResponse", isForKid);
          if (isForKid) setForKid(true)
          else setForKid(false)
          setTags(tagsResponse?.data);
        } catch (error) {

        }
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const cookieArray = allCookies.split(';');
    let accessToken = '';
    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      console.log(name, value);
      if (name === 'access_token') {
        accessToken = value;
        fetchDataChangeId(accessToken);
        break;
      }
    }
    if (accessToken === '') {
      navigate('/')
    }

  }, [videoCode]);


  return (
    <div className={`bg-yt-black relative flex flex-row min-h-screen w-[100%] gap-3
      sm:pl-6 md:pl-7 lg:pl-8 xl:pl-9 ml-5 mt-[76px] hide-scrollbar hide-scrollbar-x max-w-full `}>
      <div className={`md:w-[95%] lg:w-[640px]`}>
        <div className='w-[100%] aspect-video mb-2'>
          <ReactPlayer
            url={video?.videoUrl}
            controls
            playing={true}
            width={`${curWid <= 786 ? "95%" : "640px"}`}
          />
        </div>
        <span className="text-yt-white font-semibold my-2 text-lg">
          {video?.title}
        </span>
        <div className="flex w-full">
          <VideoInfo video={video} />
        </div>
        <VideoDescribe video={video} tags={tags} />
        <VideoCmt video={video} forKid={forKid} />
      </div>
      <Recommend tags={tags} />
    </div >
  )
}

export default Video