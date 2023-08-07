import { IoLogoBuffer } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { getAllChannels, getCurrentChannel } from '../slices/channelSlice';
import { useEffect, useState } from 'react';
import SubsItem from '../components/Subscribe/SubsItem';
import axios from 'axios';
import { ChannelType, VideoType } from '../static/type';
import { setPickSidebar, setShowMenu } from '../slices/appSlice';
import "../index.css"

const Subscription = () => {
  const currentChannel = useSelector(getCurrentChannel);
  const dispatch = useDispatch();
  const allChannels = useSelector(getAllChannels);
  const [subscribes, setSubscribes] = useState<VideoType[]>([]);

  const fetchData = async () => {
    try {
      const [subscribesResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/subscribe/subscribed/${currentChannel?.id}`),
        // axios.get("http://localhost:5000/api/v1/videos"),
      ]);
      // console.log(subscribesResponse?.data);

      // setSubscribes(subscribesResponse?.data);
      const newestVideos = [];
      if (subscribesResponse?.data.length > 0) {
        const promises = subscribesResponse?.data.reverse().map(async (channel: ChannelType) => {
          const response = await axios.get(`http://localhost:5000/api/v1/videos/newest/${channel.id}`);
          return response?.data;
        });
        newestVideos.push(...(await Promise.all(promises)));
        const flattenedVideos = newestVideos.flat();
        // console.log(flattenedVideos);
        setSubscribes(flattenedVideos)
      }
      // const subscribedChannels = allChannels.filter((channel) => {
      //   return subscribesResponse.data.subscribes.some(
      //     (subscribe) => subscribe.channel_id === channel.channel_id
      //   );
      // });
      // dispatch(setChannelsSub(subscribedChannels));
      // dispatch(setVideos(videosResponse.data.videos));
      dispatch(setShowMenu(false));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(setPickSidebar("Subscription"))
    if (currentChannel) {
      fetchData();
    }
  }, []);


  return (
    <div className={`w-full min-h-screen h-[calc(100%-53px)] mt-16 bg-yt-black flex z-0 flex-col ml-[18px]
    sm:px-12 md:px-14 lg:px-16 xl:px-20 hide-scrollbar-y`}>
      {!currentChannel ? (
        <div className="flex flex-col justify-between items-center m-auto gap-4 mt-5">
          <span className="">
            <IoLogoBuffer size={100} />
          </span>
          <span className="text-2xl">Don’t miss new videos</span>
          <span>Sign in to see updates from your favorite YouTube channels</span>
        </div>
      ) : subscribes.length > 0 ? (
        subscribes.map((subscribe) => (
          <div className='flex flex-col gap-2 w-full hide-scrollbar-y' key={subscribe.id}>
            <SubsItem subscribe={subscribe} />
            <hr className='' />
          </div>
        ))
      ) : (
        <div className="m-auto flex flex-col">
          <span className="text-center text-2xl text-yt-white">
            You have not subscribed to any channel.
          </span>
        </div>
      )}
    </div>
  )
}

export default Subscription