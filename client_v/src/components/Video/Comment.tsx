import { BiLike, BiDislike } from "react-icons/bi";
import { ChannelType, Cmt } from "../../static/type";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";

interface CommentProp {
  item: Cmt
}
const Comment = ({ item }: CommentProp) => {
  const [channelCmt, setChannelCmt] = useState<ChannelType | null>(null)
  // console.log("item", item);

  const channelName = item?.channel.split("@")[0];
  const fetchChannelCmtData = async () => {
    try {
      const [channelResponse,] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/channel/${item?.channel}`),

      ]);
      // console.log("channelResponse", channelResponse?.data);
      setChannelCmt(channelResponse?.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchChannelCmtData()
  }, [item])


  return (
    <div className="flex flex-row my-2 items-start">
      <img src={channelCmt?.logoUrl} alt="profile" className="w-12 h-12 rounded-full mr-3" />
      <div>
        <div className="flex items-center my-2">
          <p className="text-sm font-medium pr-2">@{channelName}</p>
          <p className="text-xs text-yt-gray">
            {moment(item.cmt_date).fromNow()}
          </p>
        </div>
        <p className="text-base pt-1">{item?.content}</p>
        <div className="flex justify-between items-center gap-4 w-36">
          <div className="flex py-2 justify-between w-24 items-center gap-2">
            <div className="flex items-center">
              <BiLike size={35} className="cursor-pointer p-2 rounded-full hover:bg-yt-light-2" />
              <p className="text-sm px-1 text-yt-gray">24</p>
            </div>
            <div className="flex items-center">
              <BiDislike size={34} className="cursor-pointer p-2 rounded-full hover:bg-yt-light-2" />
            </div>
          </div>
          <p className="text-sm py-2 px-4 hover:bg-yt-light-2 rounded-l-full rounded-r-full cursor-pointer">
            Reply
          </p>
        </div>
      </div>
    </div>
  );
};
export default Comment;