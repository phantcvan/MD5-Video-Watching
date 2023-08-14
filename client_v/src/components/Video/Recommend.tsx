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
import { getCurrentChannel } from '../../slices/channelSlice';

interface RecommendProp {
  tags: AllTags[]
}
const Recommend = ({ tags }: RecommendProp) => {
  const [isChoice, setIsChoice] = useState("All");
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [home, setHome] = useState(false);
  const [editable, setEditable] = useState(false);
  const [edited, setEdited] = useState(false);
  const [description, setDescription] = useState(false);
  const [start, setStart] = useState(1);
  const [videosTag, setVideosTag] = useState<VideoType[]>([]);
  const dispatch = useDispatch();
  const allVideos = useSelector(getVideos);
  const { id: videoCode } = useParams();
  const currentChannel = useSelector(getCurrentChannel)
  // console.log("tags", tags);

  const allTags = [{ tag: "All" }, ...tags, { tag: "Recently uploaded" }, { tag: "Watched" }]

  const fetchData = async () => {
    setLoading(true);
    try {
      const tagsJson = JSON.stringify(tags);
      const videosWithTagResponses = [];
      const uniqueVideosTag: VideoType[] = [];
      if (tags && tags.length > 0) {
        const promises1 = tags.map(async (tag) => {
          const withTagResponse = await axios.get(`http://localhost:5000/api/v1/tag/withTag/${tag.tag}`);
          console.log("withTagResponse", withTagResponse);
          return withTagResponse?.data;
        });

        videosWithTagResponses.push(...(await Promise.all(promises1)));
        const flattenedVideos = videosWithTagResponses.flat();

        flattenedVideos.forEach((video) => {
          if (!uniqueVideosTag.some((uniqueVideo) => uniqueVideo.id === video.id)) {
            uniqueVideosTag.push(video);
          }
        });
        // console.log("videosWithTagResponses", uniqueVideosTag);
      }
      const videosWithoutTagResponses = [];
      const promises2 = tags.map(async (tag) => {
        const response = await axios.get(`http://localhost:5000/api/v1/tag/withoutTag/${tag.tag}`);
        return response?.data;
      });

      videosWithoutTagResponses.push(...(await Promise.all(promises2)));
      const flattenedVideos2 = videosWithoutTagResponses.flat();
      const uniqueVideosWithoutTag: VideoType[] = [];
      flattenedVideos2.forEach((video) => {
        if (!uniqueVideosWithoutTag.some((uniqueVideo) => uniqueVideo.id === video.id)) {
          uniqueVideosWithoutTag.push(video);
        }
      });
      const recommend = uniqueVideosTag.concat(uniqueVideosWithoutTag);
      const uniqueRecommend: VideoType[] = [];
      recommend.forEach((video) => {
        if (!uniqueRecommend.some((uniqueVideo) => uniqueVideo.id === video.id)) {
          uniqueRecommend.push(video);
        }
      });
      dispatch(setVideos(uniqueRecommend));
      dispatch(setShowMenu(false));
      dispatch(setShowLogIn(false));
      // setLastPage(videosResponse?.data?.lastPage)
      // if (!videosResponse?.data?.lastPage) {
      //   setStart(prev => prev + 1);
      // }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  const fetchVideoBelongTag = async () => {
    try {
      const [videosResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/tag/withTag/${isChoice}`),
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
        id: item?.video.id,
        videoUrl: item?.video.videoUrl,
        title: item?.video.title,
        thumbnail: item?.video.thumbnail,
        upload_date: item?.video.upload_date,
        videoCode: item?.video.videoCode,
        description: item?.video.description,
        views: item?.video.views,
        channel: {
          id: item?.video.channel?.id,
          email: item?.video.channel.email,
          channelCode: item?.video.channel.channelCode,
          channelName: item?.video.channel.channelName,
          logoUrl: item?.video.channel.logoUrl,
          about: item?.video.channel.about
        },
      }));
      const uniqueVideos: VideoType[] = [];
      watchedVideos.forEach((video: VideoType) => {
        if (!uniqueVideos.some((uniqueVideo) => uniqueVideo.id === video.id)) {
          uniqueVideos.push(video);
        }
      });
      console.log("videosResponse", uniqueVideos);
      setVideosTag(uniqueVideos);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchData();
  }, [tags]);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, lastPage]);
  useEffect(() => {
    const videoFilter = allVideos.filter((video: VideoType) => video.videoCode !== videoCode)
    // console.log("videoFilter", videoFilter);

    if (isChoice === "All") {
      // const videosWithTag = videoFilter.filter((video: VideoType) =>)
      setVideosTag(videoFilter);
    } else if (isChoice === "Recently uploaded") {
      fetchNewestVideo()
    } else if (isChoice === "Watched") {
      fetchWatchedVideo()
    } else {
      fetchVideoBelongTag()
    }
  }, [isChoice, allVideos, videoCode]);

  // console.log(isChoice);
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
            <VideoCompInfo video={video} home={home} description={description} editable={editable}
              setEdited={setEdited} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Recommend