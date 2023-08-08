import { getShowMenu, setShowLogIn, setShowMenu } from '../slices/appSlice';
import { useDispatch, useSelector } from "react-redux";
import "../index.css";
import axios from 'axios';
import { getAllTags, getVideos, setAllTags, setVideos } from '../slices/videoSlice';
import { getAllChannels, getCurrentChannel, setAllChannels, setChannelsSub } from '../slices/channelSlice';
import { useEffect, useState } from 'react';
import { getUser } from '../slices/userSlice';
import { AllTags, ChannelType, VideoType } from '../static/type';
import VideoComp from '../components/VideoComp';
import MiniSidebar from '../components/MiniSidebar';
import Tag from '../components/Tag';

const Home = () => {
  const dispatch = useDispatch();
  const [tags, setTags] = useState([]);
  const showMenu = useSelector(getShowMenu);
  const currentChannel = useSelector(getCurrentChannel);
  // const allChannels = useSelector(getAllChannels);
  const allVideos: VideoType[] = useSelector(getVideos);
  const [videosTag, setVideosTag] = useState<VideoType[]>([]);
  const [pickTag, setPickTag] = useState("All");
  const [start, setStart] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [isChoice, setIsChoice] = useState("All");
  const allTags = useSelector(getAllTags);
  const [home, setHome] = useState(true);
  const [editable, setEditable] = useState(false);


  // Khi không có user
  const fetchData = async () => {
    setLoading(true);
    try {
      const [allTagsResponse, videosResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/v1/tag"),
        axios.get(`http://localhost:5000/api/v1/videos/all/${start}`),
      ]);
      const tags = allTagsResponse?.data
      const tagsWithAll = [{ tag: "All" }, ...tags, { tag: "Recently uploaded" }, { tag: "Watched" }]
      dispatch(setAllTags(tagsWithAll));
      const newVideos: VideoType[] = [...allVideos, ...videosResponse.data.videos];
      // console.log("newVideos", newVideos);

      const uniqueVideos: VideoType[] = [];
      newVideos.forEach((newVideo) => {
        if (!uniqueVideos.some((uniqueVideo) => uniqueVideo.id === newVideo.id)) {
          uniqueVideos.push(newVideo);
        }
      });
      // console.log("uniqueVideos", uniqueVideos);

      dispatch(setVideos(uniqueVideos));
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



  // khi có user
  // const fetchDataSubs = async () => {
  //   try {
  //     const [subscribesResponse] = await Promise.all([
  //       axios.get(`http://localhost:5000/api/v1/subscribes/all/${currentChannel?.email}`),
  //     ]);

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // khi chọn tag
  const fetchVideoBelongTag = async () => {
    try {
      const [videosResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/tag/withTag/${isChoice}/${start}`),
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
        axios.get(`http://localhost:5000/api/v1/history/${currentChannel?.id}`),
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
    if (isChoice === "All") {
      setVideosTag(allVideos);
    } else if (isChoice === "Recently uploaded") {
      fetchNewestVideo()
    } else if (isChoice === "Watched") {
      fetchWatchedVideo()
    } else {
      fetchVideoBelongTag()
    }
  }, [isChoice, allVideos]);

  useEffect(() => {
    //chuyển lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchData();
    // if (!lastPage) setStart(prev => prev + 1);
    dispatch(setShowMenu(showMenu));
    // if (currentChannel != null) {
    //   // fetchDataSubs();
    // }
  }, []);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, lastPage]);

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
      fetchData();
    }
  };
  // console.log(allVideos);
  // console.log("loading", loading);
  // console.log("lastPage", lastPage);
  // console.log("start", start);
  // console.log("allTags", allTags);



  // lọc video theo tag
  // const loadVideoBelongTag = (videos, tags, pickTag) => {
  //   const result = videos.filter((video) => {
  //     const hasMatchingTag = tags.some(
  //       (tag) =>
  //         tag.video_id === video.video_id &&
  //         tag.tag.toLowerCase() === pickTag.toLowerCase()
  //     );
  //     return hasMatchingTag;
  //   });

  //   return result;
  // };



  return (
    <div className={`max-w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex z-0 flex-col
    sm:px-6 md:px-7 lg:px-8 xl:px-9 ml-7`}>
      <Tag allTags={allTags} isChoice={isChoice} setIsChoice={setIsChoice} />
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videosTag?.map((video) => (
          <div
            className={``}
            key={video.id}
          >
            <VideoComp
              video={video} home={home} editable={editable}
            />
          </div>
        ))}

      </div>

    </div>
  )
}

export default Home