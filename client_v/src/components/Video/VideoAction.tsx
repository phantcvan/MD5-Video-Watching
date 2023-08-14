import { useSelector } from "react-redux";
import { VideoType } from "../../static/type";
import { getUser } from "../../slices/userSlice";
import { useEffect, useState } from "react";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { handleNumber } from "../../static/fn";
import { RiShareForwardLine } from "react-icons/ri";
import { notification } from "antd";
import { getCurrentChannel } from "../../slices/channelSlice";
import axios from "axios";

interface VideoComp {
  video: VideoType | null
}

const VideoAction = ({ video }: VideoComp) => {
  // console.log("video", video);

  const currentChannel = useSelector(getCurrentChannel);
  const [userAction, setUserAction] = useState(-1);
  const [countLike, setCountLike] = useState(0);

  const fetchReactionData = async () => {
    try {
      const allLikeReaction = await axios.get(`http://localhost:5000/api/v1/reaction/allLike/${video?.id}`)
      if (currentChannel) {
        const myReactionResponse = await axios.get(`http://localhost:5000/api/v1/reaction/reactionOfVideo/${video?.id}/${currentChannel?.id}`)
        if (myReactionResponse?.data) setUserAction(myReactionResponse?.data?.action)
      }
      setCountLike(allLikeReaction?.data)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchReactionData()

  }, [video])
  // console.log("userAction", userAction);

  const handleLikeClick = async () => {
    if (currentChannel) {
      if (userAction === 0) {// nêu người dùng đang dislike -> update reaction
        try {
          const [likeResponse] = await Promise.all([
            axios.put(`http://localhost:5000/api/v1/reaction`, {
              videoId: video?.id,
              channelId: currentChannel?.id,
              action: 1
            })
          ])
          if (likeResponse?.status === 200) {
            setUserAction(1);
            setCountLike(pre => (pre + 1))
          }
        } catch (error) {
          console.log(error);
        }
      } else if (userAction === 1) { // nếu người dùng đang like -> delete
        try {
          const likeResponse = await axios.delete(`http://localhost:5000/api/v1/reaction/${video?.id}/${currentChannel?.id}`)
          if (likeResponse?.status === 200) {
            setUserAction(-1);
            setCountLike(pre => (pre - 1))
          }
        } catch (error) {
          console.log(error);
        }
      } else if (userAction === -1) { // nếu người dùng chưa like/dislike ->create
        try {
          const likeResponse = await axios.post(`http://localhost:5000/api/v1/reaction`,
            {
              videoId: video?.id,
              channelId: currentChannel?.id,
              action: 1
            })
          if (likeResponse?.status === 201) {
            setUserAction(1);
            setCountLike(pre => (pre + 1))
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      notification.warning({
        message: "Please sign in to like this video.",
        style: {
          top: 5,
        },
      });
    }
  }
  const handleDislikeClick = async () => {
    if (currentChannel) {
      if (userAction === 1) {// nêu người dùng đang like -> update reaction
        try {
          await axios.put(`http://localhost:5000/api/v1/reaction`, {
            videoId: video?.id,
            channelId: currentChannel?.id,
            action: 0
          })
          setUserAction(0);
          setCountLike(pre => (pre - 1))
        } catch (error) {
          console.log(error);
        }
      } else if (userAction === 0) { // nếu người dùng đang dislike -> delete
        try {
          await axios.delete(`http://localhost:5000/api/v1/reaction/${video?.id}/${currentChannel?.id}`)
          setUserAction(-1);
        } catch (error) {
          console.log(error);
        }
      } else if (userAction === -1) { // nếu người dùng chưa like/dislike ->create
        try {
          await axios.post(`http://localhost:5000/api/v1/reaction`,
            {
              videoId: video?.id,
              channelId: currentChannel?.id,
              action: 0
            })
          setUserAction(0);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      notification.warning({
        message: "Please sign in to dislike this video.",
        style: {
          top: 5,
        },
      });
    }

  }

  // share video --> copy link vào clipboard
  const handleCopy = () => {
    // setMessage("Link copied to clipboard");
    navigator.clipboard.writeText(`http://localhost:5173/video/${video?.videoCode}`)
      .then(() => {
        console.log('Link copied to clipboard');
        notification.success({
          message: "Link copied to clipboard",
          style: {
            top: 95,
            zIndex: 50
          },
          duration: 2,
        });
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
      });
  };

  return (
    <div className="flex pl-10">
      <div className="flex bg-yt-light-black items-center rounded-2xl h-10 ">
        <div
          className="rounded-l-2xl h-10 flex px-3 items-center border-r-2 border-r-yt-light-1 cursor-pointer
                  hover:bg-yt-light-1"
          onClick={handleLikeClick}>
          {userAction === 1
            ? <AiFillLike className="text-yt-white text-2xl" />
            : <AiOutlineLike className="text-yt-white text-2xl" />}
          <p className="text-yt-white pl-2 pr-3 text-sm font-semibold">
            {`${handleNumber(Number(countLike))}`}
          </p>
        </div>
        <div className="rounded-r-2xl h-10 flex items-center cursor-pointer px-5
               hover:bg-yt-light-1"
          onClick={handleDislikeClick}>
          {userAction === 0
            ? <AiFillDislike className="text-[22px] font-extralight text-yt-white" />
            : <AiOutlineDislike className="text-[22px] font-extralight text-yt-white" />}
          {/* {countDislike > 0 && <p className="text-yt-white pl-2 pr-3 text-sm font-semibold">
                  {`${handleNumber(Number(countDislike))}`}
              </p>} */}
        </div>
      </div>
      <div className="flex bg-yt-light-black items-center rounded-2xl h-10 mx-1 cursor-pointer hover:bg-yt-light-1">
        <div className="flex px-3 items-center cursor-pointer">
          <RiShareForwardLine className="text-2xl text-yt-white font-thin" />
          <span className="text-yt-white pl-2 pr-3 text-sm font-semibold" onClick={handleCopy}>
            Share
          </span>
        </div>
      </div>

    </div>
  )
}

export default VideoAction