import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPickSidebar } from "../slices/appSlice"
import { useParams } from "react-router";
import { getCurrentChannel } from "../slices/channelSlice";
import axios from "axios";
import { ChannelType, VideoType } from "../static/type";
import Header from "../components/Channel/Header";


const Channel = () => {
  const dispatch = useDispatch();
  const { id: channelCode } = useParams();
  const currentChannel = useSelector(getCurrentChannel);
  const [channelViewing, setChannelViewing] = useState<ChannelType | null>(null)
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const [videosUpload, setVideosUpload] = useState<VideoType[]>([]);
  const [pick, setPick] = useState(0);


  // console.log(channelCode);
  const fetchChannelData = async () => {
    try {
      const [channelResponse, subscribedResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/channel/channelInfo/${channelCode}`),
        axios.get(`http://localhost:5000/api/v1/subscribe/subscribed/${currentChannel?.id}`),
      ])
      setChannelViewing(channelResponse?.data);
      const check = subscribedResponse?.data.some((channel: ChannelType) => channel.channelCode === channelCode)
      setIsSubscribe(check);
      try {
        const [subscriberResponse, videoUploaded] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/subscribe/subscriber/${channelResponse?.data?.id}`),
          axios.get(`http://localhost:5000/api/v1/videos/videosBelongChannel/${channelResponse?.data?.id}`),
        ])
        setSubscribers(subscriberResponse?.data?.length);
        setVideosUpload(videoUploaded?.data);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchChannelData()
    dispatch(setPickSidebar(channelViewing?.channelName))
  }, [channelCode])
  return (
    <div className={`w-full min-h-screen h-[calc(100%-53px)] mt-[60px] bg-yt-black flex z-0 flex-col
    sm:pl-6 md:pl-7 lg:pl-8 xl:pl-9`}>
      <Header channel={channelViewing} isSubscribe={isSubscribe} subscribers={subscribers} 
      videoCount={videosUpload?.length} setPick={setPick}/>
      Channel
    </div>
  )
}

export default Channel