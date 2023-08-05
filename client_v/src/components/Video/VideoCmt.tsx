import axios from "axios";
import { ChannelType, Cmt, VideoType } from "../../static/type"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "../../slices/userSlice";
import avatarDefault from "../../../public/assets/avatar_default.jpg";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import Comment from "./Comment";
import { getAllChannels, getCurrentChannel, setCurrentChannel } from "../../slices/channelSlice";
import { notification } from "antd";
import { getCurrentDate } from '../../static/fn';
import { v4 as uuidv4 } from 'uuid';
import { IoIosArrowDown } from "react-icons/io";


interface VideoComp {
  video: VideoType | null,
  forKid: boolean
}

const VideoCmt = ({ video, forKid }: VideoComp) => {
  const [comments, setComments] = useState<Cmt[]>([]);
  const currentChannel = useSelector(getCurrentChannel);
  const [commentInput, setCommentInput] = useState("");
  const [existCmt, setExistCmt] = useState(false);
  const [commented, setCommented] = useState(false);
  const [showCmtL2, setShowCmtL2] = useState(false);
  const dispatch = useDispatch();
  const allChannels = useSelector(getAllChannels)


  const fetchCmt = async () => {
    try {
      const [cmtsResponse,] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/comment/${video?.id}`),

      ]);
      // console.log("cmtsResponse", cmtsResponse.data);
      setComments(cmtsResponse?.data.reverse());

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCmt();
  }, [video?.id, commented]);



  const handleInputChange = (e: any) => {
    const { value } = e.target;
    setCommentInput(value);
    setExistCmt(value.trim().length > 0);
  };

  const addCommentL1 = async (e: any) => {
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
        level: 1,
        cmt_reply: -1
      };
      await axios
        .post("http://localhost:5000/api/v1/comment", newComment)
        .then((res) => {
          if (res.status === 201) {
            console.log("Thêm comment thành công");
            setCommentInput("");
            fetchCmt();
            setCommented(pre => !pre)
          }
        })
        .catch((error) => console.log(error));
    }
  };

  // login
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

  const displayMessage = () => {
    notification.warning({
      message: "The channel or video's audience is set as 'Made for Kids'.",
      style: {
        top: 95,
        zIndex: 50
      },
      duration: 2,
    });
  }

  return (
    <div className="text-yt-white mt-5">
      {forKid ? (
        <div className="text-center mt-2">
          <span>Comments are turned off. </span>
          <span className="text-[#1967D2] cursor-pointer" onClick={displayMessage}>
            Learn more
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <h1>
              {comments.length}{" "}
              {comments.length > 1 ? "Comments" : "Comment"}
            </h1>
          </div>

          {currentChannel ? (
            <form
              onSubmit={addCommentL1}
              className="flex w-full pt-4 items-start"
            >
              <img
                src={currentChannel?.logoUrl}
                alt="profile"
                className="rounded-full mr-3 h-12 w-12"
              />
              <input
                value={commentInput}
                onChange={handleInputChange}
                type="text"
                placeholder="Add a comment..."
                className="bg-[transparent] border-b border-b-yt-light-black outline-none text-sm p-1 w-full"
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
              <img
                src={avatarDefault}
                alt="profile"
                className="rounded-full mr-3 h-12 w-12"
              />
              <input
                onClick={handleLogin}
                type="text"
                placeholder="Add a comment..."
                className="bg-[transparent] border-b border-b-yt-light-black outline-none text-sm p-1 w-full"
              />
              <button
                className={`ml-1 p-2 rounded-r-full rounded-l-full text-yt-gray bg-yt-light-2`}
                onClick={handleLogin}
              >
                Comment
              </button>
            </div>
          )}
          <div className="my-6">
            {comments
              .filter((item) => item.level === 1)
              .map((item, i) => {
                const level2Comments = comments.filter((cmt) => cmt?.cmt_reply === item?.id);
                const numLevel2Comments = level2Comments.length;

                return (
                  <div key={i}>
                    <Comment item={item} video={video} setCommented={setCommented} handleLogin={handleLogin} />
                    {numLevel2Comments > 0 && (
                      <div className="w-full ml-14 mt-[-6px]">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-3">
                            <span
                              className="cursor-pointer hover:bg-yt-blue-1 text-yt-blue p-2 rounded-full"
                              onClick={() => setShowCmtL2(pre => !pre)}
                            >
                              <IoIosArrowDown size={24} />
                            </span>
                            <span
                              className="cursor-pointer hover:bg-yt-blue-1 text-yt-blue py-2 px-3 rounded-l-full rounded-r-full"
                              onClick={() => setShowCmtL2(pre => !pre)}
                            >
                              {numLevel2Comments} {numLevel2Comments > 1 ? 'replies' : 'reply'}
                            </span>
                          </div>
                          {showCmtL2 && level2Comments.map((cmt2, index) => (
                            <div className="w-full" key={index}>
                              <Comment item={cmt2} video={video} setCommented={setCommented} handleLogin={handleLogin} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

        </>
      )}
    </div>
  )
}

export default VideoCmt