import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { AllTags, VideoType } from '../static/type';
import { useSelector } from 'react-redux';
import { getCurrentWidth } from '../slices/appSlice';
import ReactPlayer from 'react-player';
import VideoInfo from '../components/Video/VideoInfo';
import "../index.css"
import VideoDescribe from '../components/Video/VideoDescribe';
import VideoCmt from '../components/Video/VideoCmt';
import Recommend from '../components/Video/Recommend';
import { getCurrentChannel } from '../slices/channelSlice';


const Video = () => {
  const { id: videoCode } = useParams();
  const [video, setVideo] = useState<VideoType | null>(null);
  const curWid = useSelector(getCurrentWidth)
  const [tags, setTags] = useState<AllTags[]>([])
  const [forKid, setForKid] = useState(false);
  const currentChannel = useSelector(getCurrentChannel)



  const updateView = async (view: number, videoId: number) => {
    try {
      const updatedViews = view + 1;
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      console.log(formattedDate);
      const newHistory = {
        channelId: currentChannel?.id,
        videoId: videoId,
        view_date: formattedDate
      }
      const [response, historyResponse,] = await Promise.all([
        axios.put(`http://localhost:5000/api/v1/videos/view/${videoCode}`,
          { views: updatedViews }
        ),
        axios.post(`http://localhost:5000/api/v1/history`, newHistory),
      ]);


    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataChangeId = async () => {
    try {
      const [
        videoResponse,
        // commentsResponse,
        // actionsResponse,
        // subscribesResponse,
      ] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/videos/${videoCode}`),
        //   axios.get(`http://localhost:5000/api/v1/comments/${id}`),
        //   axios.get(`http://localhost:5000/api/v1/actions/${id}`),
        //   axios.get(`http://localhost:5000/api/v1/subscribes`),
      ]);
      // console.log("videoResponse", videoResponse.data.views);

      setVideo(videoResponse?.data);
      // setComments(commentsResponse?.data.findCmt);
      updateView(videoResponse?.data.views, videoResponse?.data?.id);
      // setSubscribes(subscribesResponse?.data.subscribes);
      // console.log("actionsResponse", actionsResponse?.data.actions);
      // setCountLike(
      //   actionsResponse?.data.actions.filter((action) => action.action === 1)
      //     .length
      // );
      // setCountDislike(
      //   actionsResponse?.data.actions.filter((action) => action.action === 0)
      //     .length
      // );
      // if (user) {
      //   setIsSubscribe(
      //     subscribesResponse?.data.subscribes.some(
      //       (item) =>
      //         item.channel_id === videoResponse?.data.findVideo[0].channel_id &&
      //         item.email === user?.email
      //     )
      //   );
      //   setUserAction(
      //     actionsResponse?.data.actions.find(
      //       (action) => action.email === user?.email
      //     ).action
      //   );
      // }
      try {
        const [tagsResponse,] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/tag/tagForVideo/${videoResponse?.data?.id}`),
        ]);
        // console.log("tagsResponse", tagsResponse?.data);
        setTags(tagsResponse?.data);
      } catch (error) {

      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataChangeId();
  }, [videoCode]);
  console.log("tags", tags);


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