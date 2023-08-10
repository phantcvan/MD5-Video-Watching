import { useDispatch, useSelector } from "react-redux"
import { ChannelType } from "../../static/type"
import { getAllChannels, getChannelsSub, getCurrentChannel, setChannelsSub, setCurrentChannel } from "../../slices/channelSlice"
import { FaRegBell } from "react-icons/fa"
import { getCurrentDate, handleNumber } from "../../static/fn"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Tooltip } from "antd"
import axios from "axios";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { v4 as uuidv4 } from 'uuid';


interface HeaderProp {
  channel: ChannelType | null,
  subscribers: number,
  videoCount: number,
  setPick: React.Dispatch<React.SetStateAction<number>>
}
const Header = ({ channel, subscribers, videoCount, setPick }: HeaderProp) => {
  const currentChannel = useSelector(getCurrentChannel);
  const [openUpload, setOpenUpload] = useState(false);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const channelsSub = useSelector(getChannelsSub);
  const allChannels = useSelector(getAllChannels)
  // console.log(channelsSub);
  useEffect(() => {
    const isSubscribed = channelsSub.some((ch: ChannelType) => ch.id === channel?.id);
    setIsSubscribe(isSubscribed);
  }, [channelsSub, channel]);

  const handleAddSubscribe = async () => {
    if (isSubscribe) {
      try {
        const [subscribeResponse] = await Promise.all([
          axios.delete(`http://localhost:5000/api/v1/subscribe/${currentChannel?.id}/${channel?.id}`),

        ])
        if (subscribeResponse?.status === 200) {
          const updatedChannelsSub = channelsSub.filter((ch: ChannelType) => ch.id !== channel?.id)
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
            subscribed_id: channel?.id
          }),
          axios.get(`http://localhost:5000/api/v1/channel/findChannel/${channel?.id}`)
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

  const handleLogin = async () => {
    const response = await signInWithPopup(auth, provider);
    handleAddChannel(response?.user);
  };
  const handleAddChannel = async (user: any) => {
    try {
      const findChannelIndex = allChannels?.findIndex(
        ((e: ChannelType) => e.email == user?.email
        ));
      // console.log("findChannelIndex", findChannelIndex);


      if (findChannelIndex === -1) {
        const formattedDate = getCurrentDate();
        const newCode = uuidv4()
        const newChannel = {
          email: user?.email,
          logoUrl: user?.photoURL,
          channelName: user?.displayName,
          joinDate: formattedDate,
          thumbnailM: null,
          channelCode: newCode,
          recordHistory: 1
        };
        // console.log("newChannel", newChannel);
        const [channelResponse, authResponse] = await Promise.all([
          axios.post("http://localhost:5000/api/v1/channel", newChannel),
          axios.post(`http://localhost:5000/api/v1/auth/signUp`, newChannel),
        ]);
        // console.log("authResponse 1", authResponse);

        const randomId = Math.floor(Math.random() * 10000000);
        const newChannelWithId = Object.assign({}, newChannel, {
          id: randomId,
        });
        dispatch(setCurrentChannel(newChannelWithId))
      } else {
        const channelNow = allChannels?.filter((channel: ChannelType) => channel?.email === user?.email)
        console.log("channelNow", channelNow);
        dispatch(setCurrentChannel(channelNow[0]))
        try {
          const [authResponse] = await Promise.all([
            axios.post(`http://localhost:5000/api/v1/auth/signIn`, channelNow[0]),
          ]);
          // console.log("authResponse 2", authResponse?.data?.access_token);
          const jwtToken = authResponse?.data?.access_token;
          const expiresInDays = 7; // Số ngày tồn tại của cookies
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + expiresInDays);
          const cookieString = `access_token=${jwtToken}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
          document.cookie = cookieString;
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="flex flex-col gap-3">
      {channel?.thumbnailM
        && <img src={channel?.thumbnailM}
          className="aspect-[5.6] overflow-hidden object-cover w-full" />}
      <div className="flex items-center gap-8 flex-1 mr-5 ml-[88px]">
        <div className="flex flex-1 items-center gap-8">
          <div className="h-[128px] w-[128px] object-cover">
            <img
              src={channel?.logoUrl}
              className="h-[128px] w-[128px] rounded-full overflow-hidden object-cover"
            />
          </div>
          <div className="flex flex-col text-yt-white">
            <Tooltip placement="topLeft" title={channel?.channelName} color='#3F3F3F' arrow={false}>
              <span className="font-medium text-xl my-1">
                {channel?.channelName}
              </span>
            </Tooltip>
            <div className="flex gap-3 text-yt-light-4 text-sm">
              <span className="font-normal my-1">
                @{channel?.email.split("@")[0]}
              </span>
              <span className="font-normal my-1">
                {`${handleNumber(subscribers)} ${subscribers > 1 ? "subscribers" : "subscriber"}`}
              </span>
              <span className="font-normal my-1">
                {`${handleNumber(videoCount)} ${videoCount > 1 ? "videos" : "video"}`}
              </span>
            </div>
            {channel?.about && <div className="flex gap-3 text-yt-light-4 text-sm cursor-pointer"
              onClick={() => setPick(3)}>
              <span className="font-normal my-1">
                {channel?.about?.length <= 150
                  ? channel?.about
                  : `${channel?.about.substr(0, 150)}...`}
              </span>
            </div>}

          </div>
        </div>
        <div className="flex basis-1/3 justify-center ">
          {currentChannel?.email !== channel?.email
            ? (
              isSubscribe ? (
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
              ) : currentChannel
                ? (
                  <button
                    className="rounded-l-full rounded-r-full bg-yt-white text-yt-black px-3 py-2
                  hover:bg-yt-light-7"
                    onClick={handleAddSubscribe}
                  >
                    Subscribe
                  </button>
                )
                : (
                  <button
                    className="rounded-l-full rounded-r-full bg-yt-white text-yt-black px-3 py-2
                  hover:bg-yt-light-7"
                    onClick={handleLogin}
                  >
                    Subscribe
                  </button>
                )
            )
            : videoCount > 0 ? (
              <div className="flex gap-4 items-center text-yt-white">
                <button
                  className="rounded-l-full rounded-r-full bg-yt-light-2 px-3 py-2 hover:bg-yt-light-3"
                  onClick={() => navigate(`/edit-info/${currentChannel?.channelCode}`)}
                >
                  Customize channel
                </button>
                <button
                  className="rounded-l-full rounded-r-full bg-yt-light-2 px-3 py-2 hover:bg-yt-light-3"
                  onClick={() => setPick(2)}
                >
                  Manager video
                </button>
              </div>
            ) : (
              <button
                className="rounded-l-full rounded-r-full bg-yt-light-2 px-3 py-2 relative hover:bg-yt-light-3"
                onClick={() => setOpenUpload(true)}
              >
                Customize channel
              </button>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Header