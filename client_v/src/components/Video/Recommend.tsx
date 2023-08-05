import { useEffect, useState } from 'react'
import { AllTags, VideoType } from '../../static/type';
import Tag from '../Tag';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos, setVideos } from '../../slices/videoSlice';
import { setShowLogIn, setShowMenu } from '../../slices/appSlice';
import VideoComp from '../VideoComp';
import ReactPlayer from 'react-player';
import VideoCompInfo from '../VideoCompInfo';
import { Link, useParams } from 'react-router-dom';
import '../../index.css'

interface RecommendProp {
  tags: AllTags[]
}
const Recommend = ({ tags }: RecommendProp) => {
  const [isChoice, setIsChoice] = useState("All");
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [home, setHome] = useState(false);
  const [description, setDescription] = useState(false);
  const [start, setStart] = useState(1);
  const [videosTag, setVideosTag] = useState<VideoType[]>([]);
  const dispatch = useDispatch();
  const allVideos = useSelector(getVideos);
  const { id: videoCode } = useParams();
  // console.log(videoCode);



  const allTags = [{ tag: "All" }, ...tags, { tag: "Recently uploaded" }, { tag: "Watched" }]

  // console.log(isChoice);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [videosResponse] =
        await Promise.all([
          axios.get(`http://localhost:5000/api/v1/videos/all/${start}`),
        ]);
      const newVideos = [...allVideos, ...videosResponse.data.videos]
      dispatch(setVideos(newVideos));
      dispatch(setShowMenu(false));
      dispatch(setShowLogIn(false));
      setLastPage(videosResponse?.data?.lastPage)
      if (!videosResponse?.data?.lastPage) {
        setStart(prev => prev + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  const fetchVideoBelongTag = async () => {
    try {
      const [videosResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/tag/${isChoice}`),
      ]);
      setVideosTag(videosResponse?.data)
    } catch (error) {
      console.error(error);
    }
  };
  // Khi tag là Recently uploaded
  const fetchNewestVideo = async () => {
    try {
      const [videosResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/videos/new`),
      ]);
      setVideosTag(videosResponse?.data)
    } catch (error) {
      console.error(error);
    }
  };
  // Khi tag là Watched
  const fetchWatchedVideo = async () => {
    try {
      const [videosResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/history/9`),
      ]);
      const watchedVideos = videosResponse?.data.map((item: any) => ({
        id: item.id,
        videoUrl: item.videoUrl,
        title: item.title,
        thumbnail: item.thumbnail,
        upload_date: item.upload_date,
        videoCode: item.videoCode,
        description: item.description,
        views: item.views,
        channel: {
          id: item.channelId,
          email: item.email,
          channelCode: item.channelCode,
          channelName: item.channelName,
          logoUrl: item.logoUrl,
        },
      }));
      setVideosTag(watchedVideos)
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, lastPage]);
  useEffect(() => {
    const videoFilter = allVideos.filter((video: VideoType) => video.videoCode !== videoCode)
    if (isChoice === "All") {
      setVideosTag(videoFilter);
    } else if (isChoice === "Recently uploaded") {
      fetchNewestVideo()
    } else if (isChoice === "Watched") {
      fetchWatchedVideo()
    } else {
      fetchVideoBelongTag()
    }
  }, [isChoice, allVideos, videoCode]);

  console.log(isChoice);
  const handleScroll = () => {
    const scrollTop = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop
    );
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight - 200 && !loading && !lastPage) {
      // setStart(prev => prev + 1);
      fetchData();
    }
  };


  return (
    <div className="right basis-[40%] px-3 overflow-y-hidden hide-scrollbar-x">
      {/* <div className='max-w-full hide-scrollbar-x'> */}
      <Tag allTags={allTags} isChoice={isChoice} setIsChoice={setIsChoice} />
      {/* </div> */}
      {videosTag?.map((video) => (
        <div className='flex justify-between items-start my-3 gap-2 hide-scrollbar-x' key={video?.id}>
          <Link to={`/video/${video?.videoCode}`}>
            <div className='w-[168px] aspect-video rounded-md cursor-pointer'>
              <img src={video.thumbnail}
                alt=""
                className={`w-[100%] object-cover aspect-video rounded-md`} />
            </div>
          </Link>
          <div className='flex flex-1 '>
            <VideoCompInfo video={video} home={home} description={description}/>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Recommend