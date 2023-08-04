import axios from "axios";
import { Cmt, VideoType } from "../../static/type"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "../../slices/userSlice";
import avatarDefault from "../../../public/assets/avatar_default.jpg";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import Comment from "./Comment";
import { getCurrentChannel } from "../../slices/channelSlice";


interface VideoComp {
  video: VideoType | null,
  forKid: boolean
}

const VideoCmt = ({ video, forKid }: VideoComp) => {
  const [comments, setComments] = useState<Cmt[]>([]);
  const currentChannel = useSelector(getCurrentChannel);
  const [commentInput, setCommentInput] = useState("");
  const [existCmt, setExistCmt] = useState(false);
  const dispatch = useDispatch();

  const fetchCmt = async () => {
    try {
      const [cmtsResponse,] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/comment/${video?.id}`),

      ]);
      // console.log("cmtsResponse", cmtsResponse.data);
      setComments(cmtsResponse?.data);

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCmt();
  }, [video?.id]);

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
        .post("http://localhost:5000/api/v1/comments", newComment)
        .then((res) => {
          if (res.data.status === 200) {
            console.log("Thêm comment thành công");
            setCommentInput("");
            fetchCmt();
          }
        })
        .catch((error) => console.log(error));
    }
  };

  // login
  const handleLogin = async () => {
    const response = await signInWithPopup(auth, provider);
    // dispatch(setUser(response.user));
  };

  return (
    <div className="text-yt-white mt-5">
      {forKid ? (
        <div className="text-center mt-2">
          <span>Comments are turned off. </span>
          <span
            className="text-[#1967D2] cursor-pointer"
          // onClick={() =>
          //   setMessage(
          //     "The channel or video's audience is set as 'Made for Kids'."
          //   )
          // }
          >
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
            {comments.map((item, i:number) => (
              <div key={i} >
                <Comment item={item} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default VideoCmt