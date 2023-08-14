import { useEffect, useState } from "react";
import { ChannelType } from "../../static/type"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getChannelsSub, getCurrentChannel, setChannelsSub } from "../../slices/channelSlice";
import { handleNumber } from "../../static/fn";
import { FaRegBell } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Tooltip, notification } from "antd";

interface ChannelSearchProp {
  channelSearch: ChannelType | null
}
const ChannelSearch = ({ channelSearch }: ChannelSearchProp) => {
  const [isSubscribe, setIsSubscribe] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const dispatch = useDispatch();
  const currentChannel = useSelector(getCurrentChannel);
  const navigate = useNavigate();
  const channelsSub = useSelector(getChannelsSub);


  const fetchChannelData = async () => {
    try {
      if (currentChannel) {
        const subscribedResponse = await axios.get(`http://localhost:5000/api/v1/subscribe/subscribed/${currentChannel?.id}`);
        const isSubscribed = subscribedResponse?.data.some((channel: ChannelType) => channel.channelCode === channelSearch?.channelCode);
        setIsSubscribe(isSubscribed);
      }
  
      const subscriberResponse = await axios.get(`http://localhost:5000/api/v1/subscribe/subscriber/${channelSearch?.id}`);
      setSubscribers(subscriberResponse?.data?.length);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchChannelData()
  }, [channelSearch])

  const handleAddSubscribe = async () => {
    if (!currentChannel) {
      notification.warning({
        message: "Sign in to subscribe to this channel.",
        style: {
          top: 95,
          zIndex: 50
        },
        duration: 2,
      });
    } else {
      if (isSubscribe) {
        try {
          const [subscribeResponse] = await Promise.all([
            axios.delete(`http://localhost:5000/api/v1/subscribe/${currentChannel?.id}/${channelSearch?.id}`),
  
          ])
          if (subscribeResponse?.status === 200) {
            const updatedChannelsSub = channelsSub.filter((ch: ChannelType) => ch.id !== channelSearch?.id)
            dispatch(setChannelsSub(updatedChannelsSub))
            setIsSubscribe(false)
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const [subscribeResponse, channelSubResponse] = await Promise.all([
            axios.post(`http://localhost:5000/api/v1/subscribe/`, {
              userId: currentChannel?.id,
              subscribed_id: channelSearch?.id
            }),
            axios.get(`http://localhost:5000/api/v1/channel/findChannel/${channelSearch?.id}`)
          ])
          if (subscribeResponse?.status === 201 && channelSubResponse?.status === 200) {
            const newSub = channelSubResponse?.data
            const updatedChannelsSub = [...channelsSub, newSub]
            dispatch(setChannelsSub(updatedChannelsSub))
            setIsSubscribe(true)
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  return (
    <div className="flex h-[136px] w-full items-center justify-center mt-5 gap-3 cursor-pointer">
      <div className="flex basis-1/3 justify-center"
        onClick={() => navigate(`/channel/${channelSearch?.channelCode}`)}>
        <div className="h-[136px] w-[136px] rounded-full overflow-hidden object-cover">
          <img src={channelSearch?.logoUrl}
            className="h-full w-full" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1"
        onClick={() => navigate(`/channel/${channelSearch?.channelCode}`)}>
        <Tooltip placement="topLeft" title={channelSearch?.channelName} color='#3F3F3F' arrow={false}>
          <span className="text-yt-white font-semibold text-xl mb-2">
            {channelSearch?.channelName}
          </span>
        </Tooltip>
        <span className="text-yt-light-5 text-sm">
          @{channelSearch?.email.split('@')[0]} ・{handleNumber(subscribers)} {subscribers > 1 ? "subscribers" : "subscriber"}
        </span>
        <span className="text-yt-light-5 text-sm">
          {channelSearch?.about}
        </span>
      </div>
      <div className="flex basis-[10%]">
        {isSubscribe ? (
          <>
            <button
              className="bg-yt-light-2 text-yt-white flex px-3 py-2 rounded-lg text-sm font-medium"
              onClick={handleAddSubscribe}
            >
              <span className="flex items-center gap-2">
                <FaRegBell size={18} /> Subscribed
              </span>
            </button>
          </>
        ) : (
          <button
            className="rounded-l-full rounded-r-full bg-yt-white text-yt-black px-3 py-2
            hover:bg-yt-light-7"
            onClick={handleAddSubscribe}
          >
            Subscribe
          </button>
        )}
      </div>
    </div>
  )
}

export default ChannelSearch