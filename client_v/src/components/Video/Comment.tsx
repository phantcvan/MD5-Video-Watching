import { ChannelType, Cmt, CmtAct, VideoType } from "../../static/type";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { getCurrentChannel } from "../../slices/channelSlice";
import { getCurrentDate } from "../../static/fn";
import avatarDefault from "../../../public/assets/avatar_default.jpg";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";


interface CommentProp {
  item: Cmt,
  video: VideoType | null,
  setCommented: React.Dispatch<React.SetStateAction<boolean>>,
  handleLogin: () => Promise<void>
}
const Comment = ({ item, video, setCommented, handleLogin }: CommentProp) => {
  const [channelCmt, setChannelCmt] = useState<ChannelType | null>(null)
  const [cmtReply, setCmtReply] = useState(false);
  const currentChannel = useSelector(getCurrentChannel);
  const [commentInput, setCommentInput] = useState("");
  const [existCmt, setExistCmt] = useState(false);
  const [countLike, setCountLike] = useState(0);
  const [userAction, setUserAction] = useState(-1);

  console.log("item", item);

  const channelName = item?.channel.split("@")[0];
  const fetchChannelCmtData = async () => {
    try {
      const [channelResponse, cmtActRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/channel/${item?.channel}`),
        axios.get(`http://localhost:5000/api/vi/cmt-act/${item?.id}`),
      ]);
      console.log("cmtActRes", cmtActRes?.data);
      setChannelCmt(channelResponse?.data);
      setCountLike(cmtActRes?.data?.length);
      const userAct = cmtActRes?.data?.filter((act: CmtAct) => act.channelId === currentChannel?.id)
      console.log(userAct);
      if (userAct.length > 0) setUserAction(userAct[0].action)
      else setUserAction(-1)


    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchChannelCmtData()
  }, [item])

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    setCommentInput(value);
    setExistCmt(value.trim().length > 0);
  };
  const addCommentL2 = async (e: any) => {
    e.preventDefault();
    const currentDate = getCurrentDate();
    if (!commentInput) {
      // setExistCmt(false);
    } else {
      const newComment = {
        channel: currentChannel.email,
        videoId: video?.id,
        content: commentInput,
        cmt_date: currentDate,
        level: 2,
        cmt_reply: item?.id
      };
      await axios
        .post("http://localhost:5000/api/v1/comment", newComment)
        .then((res) => {
          if (res.status === 201) {
            console.log("Thêm comment thành công");
            setCommentInput("");
            setCommented(pre => !pre)
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const handleLikeCmt = async () => {

  }

  const handleDislikeCmt = async () => {

  }

  return (
    <div className="flex flex-row my-2 items-start gap-3">
      <div className={`${item?.level === 1 ? "h-12 w-12" : "h-7 w-7"} overflow-hidden object-cover`}>
        <img src={channelCmt?.logoUrl} alt="profile"
          className={`rounded-full overflow-hidden object-cover ${item?.level === 1 ? "h-12 w-12" : "h-7 w-7"}`} />
      </div>
      <div className="w-[90%]">
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
              {userAction === 1
                ? <AiFillLike size={35} onClick={handleLikeCmt}
                  className="cursor-pointer p-2 rounded-full hover:bg-yt-light-2" />
                : <AiOutlineLike size={35} onClick={handleLikeCmt}
                  className="cursor-pointer p-2 rounded-full hover:bg-yt-light-2" />}
              <p className="text-sm px-1 text-yt-gray">{countLike}</p>
            </div>
            <div className="flex items-center">
              {userAction === 0
                ? <AiFillDislike size={34} onClick={handleDislikeCmt}
                  className="cursor-pointer p-2 rounded-full hover:bg-yt-light-2" />
                : <AiOutlineDislike size={34} onClick={handleDislikeCmt}
                  className="cursor-pointer p-2 rounded-full hover:bg-yt-light-2" />}

            </div>
          </div>
          <p className="text-sm py-2 px-4 hover:bg-yt-light-2 rounded-l-full rounded-r-full cursor-pointer"
            onClick={() => setCmtReply(pre => !pre)}>
            {item.cmt_reply > 0 ? '' : 'Reply'}
          </p>
        </div>
        {cmtReply && (currentChannel ? (
          <form
            onSubmit={addCommentL2}
            className="flex w-full pt-4 items-start gap-3"
          >
            <div className="h-7 w-7 overflow-hidden object-cover">
              <img
                src={currentChannel?.logoUrl}
                alt="profile"
                className={`rounded-full h-7 w-7 overflow-hidden object-cover`}
              />
            </div>
            <input
              value={commentInput}
              onChange={handleInputChange}
              type="text"
              placeholder="Add a reply..."
              className="bg-[transparent] border-b border-b-yt-light-black outline-none text-sm p-1
               w-[75%]"
            />
            <button
              className={`ml-1 p-2 rounded-r-full rounded-l-full
          ${existCmt
                  ? "text-yt-black bg-[#3EA6FF] hover:bg-[#65B8FF] cursor-pointer"
                  : "text-yt-gray bg-yt-light-2"
                }`}
              disabled={!existCmt}
            >
              Comment
            </button>
          </form>
        ) : (
          <div className="flex w-full pt-4 items-start">
            <div>

              <img
                src={avatarDefault}
                alt="profile"
                className="rounded-full mr-3 h-7 w-7 overflow-hidden origin-center"
              />
            </div>
            <input
              onClick={handleLogin}
              type="text"
              placeholder="Add a reply..."
              className="bg-[transparent] border-b border-b-yt-light-black outline-none text-sm p-1 w-full"
            />
            <button
              className={`ml-1 p-2 rounded-r-full rounded-l-full text-yt-gray bg-yt-light-2`}
              onClick={handleLogin}
            >
              Comment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Comment;