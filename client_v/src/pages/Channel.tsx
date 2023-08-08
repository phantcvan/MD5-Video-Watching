import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setPickSidebar } from "../slices/appSlice"
import { useParams } from "react-router";
import { getCurrentChannel } from "../slices/channelSlice";
import axios from "axios";
import { ChannelType, VideoType } from "../static/type";
import Header from "../components/Channel/Header";
import PickMenu from "../components/Channel/PickMenu";
import HotVideo from "../components/Channel/HotVideo";
import VideoBelongChannel from "../components/Channel/VideoBelongChannel";
import About from "../components/Channel/About";


const Channel = () => {
  const dispatch = useDispatch();
  const { id: channelCode } = useParams();
  const currentChannel = useSelector(getCurrentChannel);
  const [channelViewing, setChannelViewing] = useState<ChannelType | null>(null)
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const [videosUpload, setVideosUpload] = useState<VideoType[]>([]);
  const [pick, setPick] = useState(1);
  const [totalView, setTotalView] = useState(0);
  const [editable, setEditable] = useState(false);
  const [edited, setEdited] = useState(false);

  // console.log(channelCode);
  const fetchChannelData = async () => {
    try {
      const [channelResponse, subscribedResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/channel/channelInfo/${channelCode}`),
        axios.get(`http://localhost:5000/api/v1/subscribe/subscribed/${currentChannel?.id}`),
      ])
      setChannelViewing(channelResponse?.data);
      const check = subscribedResponse?.data.some((channel: ChannelType) => channel?.channelCode === channelCode)
      setIsSubscribe(check);
      try {
        const [subscriberResponse, videoUploaded] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/subscribe/subscriber/${channelResponse?.data?.id}`),
          axios.get(`http://localhost:5000/api/v1/videos/videosBelongChannel/${channelResponse?.data?.id}`),
        ])
        setSubscribers(subscriberResponse?.data?.length);
        setVideosUpload(videoUploaded?.data.reverse());
        const total = videoUploaded?.data.reduce((sum: number, video: VideoType) => sum + Number(video?.views), 0);
        setTotalView(total);
        if (currentChannel?.channelCode === channelCode) setEditable(true);
        else setEditable(false);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchChannelData()
    setPick(1);
    dispatch(setPickSidebar(channelViewing?.channelName))
  }, [channelCode, edited])
  useEffect(() => {
    fetchChannelData()
    dispatch(setPickSidebar(channelViewing?.channelName))
  }, [edited])
  // console.log(videosUpload);

  return (
    <div className={`w-full min-h-screen h-[calc(100%-53px)] mt-[60px] bg-yt-black flex z-0 flex-col
    sm:pl-6 md:pl-7 lg:pl-8 xl:pl-9 gap-4`}>
      <Header channel={channelViewing} isSubscribe={isSubscribe} subscribers={subscribers}
        videoCount={videosUpload?.length} setPick={setPick} />
      <PickMenu setPick={setPick} pick={pick} />
      {pick === 1
        ? <HotVideo videos={videosUpload} />
        : pick === 2
          ? <VideoBelongChannel videos={videosUpload} editable={editable} setEdited={setEdited}/>
          : pick === 3
          && <About channel={channelViewing} totalView={totalView} />}

    </div>
  )
}

export default Channel