import { useSelector } from "react-redux"
import { ChannelType } from "../../static/type"
import { getCurrentChannel } from "../../slices/channelSlice"
import { FaRegBell } from "react-icons/fa"
import { handleNumber } from "../../static/fn"
import { useState } from "react"
import { useNavigate } from "react-router"
import { Tooltip } from "antd"

interface HeaderProp {
  channel: ChannelType | null,
  isSubscribe: boolean,
  subscribers: number,
  videoCount: number,
  setPick: React.Dispatch<React.SetStateAction<number>>
}
const Header = ({ channel, isSubscribe, subscribers, videoCount, setPick }: HeaderProp) => {
  const currentChannel = useSelector(getCurrentChannel);
  const [openUpload, setOpenUpload] = useState(false);
  const navigate = useNavigate();

  const handleAddSubscribe = () => {

  }
  return (
    <div className="flex flex-col gap-3">
      {channel?.thumbnailM
        && <img src={channel?.thumbnailM} className="aspect-[5.6] overflow-hidden object-cover w-full" />}
      <div className="flex items-center gap-8 flex-1 mr-5 ml-[88px]">
        <div className="flex flex-1 items-center gap-8">
          <div className="h-[128px] w-[128px] object-cover">
            <img
              src={channel?.logoUrl}
              className="h-[128px] w-[128px] rounded-full"
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
              ) : (
                <button
                  className="rounded-l-full rounded-r-full bg-yt-white text-yt-black px-3 py-2
                  hover:bg-yt-light-7"
                  onClick={handleAddSubscribe}
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