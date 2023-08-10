import { useDispatch, useSelector } from "react-redux"
import { getAllChannels, getCurrentChannel, setCurrentChannel } from "../slices/channelSlice"
import { MdVideoLibrary } from "react-icons/md";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";
import { ChannelType, VideoType } from "../static/type";
import { v4 as uuidv4 } from 'uuid';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { GoHistory } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import VideoComp from "../components/VideoComp";
import { useEffect, useState } from "react";
import HistoryLib from "../components/Library/HistoryLib";
import LikedLib from "../components/Library/LikedLib";
import LibInfo from "../components/Library/LibInfo";
import { getCurrentDate } from "../static/fn";
import { setPickSidebar } from "../slices/appSlice";

interface HistoryProp {
  id: number;
  view_date: string;
  video: VideoType;
}

const Library = () => {
  const currentChannel = useSelector(getCurrentChannel);
  const allChannels = useSelector(getAllChannels);
  const dispatch = useDispatch();
  const [videosHistory, setVideosHistory] = useState<VideoType[]>([]);
  const [videosLiked, setVideosLiked] = useState<VideoType[]>([]);
  const [home, setHome] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [likedCount, setLikedCount] = useState(0);
  const allCookies = document.cookie;
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await signInWithPopup(auth, provider);
    handleAddChannel(response?.user)
  };

  const handleAddChannel = async (user: any) => {
    try {
      const findChannelIndex = allChannels?.findIndex(
        ((e: ChannelType) => e.email == user?.email
        ));

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
        console.log("newChannel", newChannel);
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

  const fetchWatchedVideo = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/auth', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setCurrentChannel(response?.data))
      try {
        const [videosResponse, uploadResponse, reactionResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/history/${response?.data?.id}`),
          axios.get(`http://localhost:5000/api/v1/videos/videosBelongChannel/${response?.data?.id}`),
          axios.get(`http://localhost:5000/api/v1/reaction/filterByChannelId/${response?.data?.id}`),
        ]);
        // sắp xếp video
        const videoSort = videosResponse?.data?.sort((a: HistoryProp, b: HistoryProp) =>
          new Date(b.view_date).getTime() - new Date(a.view_date).getTime());
        const uniqueVideosMap = new Map();
        videoSort.forEach((item: HistoryProp) => {
          if (!uniqueVideosMap.has(item.video.id) || item.view_date > uniqueVideosMap.get(item.video.id).view_date) {
            uniqueVideosMap.set(item.video.id, item);
          }
        });
        const sortedUniqueVideos = Array.from(uniqueVideosMap.values());
        const extractedVideos = sortedUniqueVideos.map((item) => item.video);
        setVideosHistory(extractedVideos);
        // đếm số lượng video đã upload
        setUploadCount(uploadResponse?.data.length)
        // lấy về các reaction
        // console.log("reactionResponse",reactionResponse?.data);
        setVideosLiked(reactionResponse?.data)
        setLikedCount(reactionResponse?.data?.length)
      } catch (error) {
        console.error(error);
      }

    } catch (error) {
      console.error('Error checking login:', error);
      return false;
    }
  };
  useEffect(() => {
    const cookieArray = allCookies.split(';');
    let accessToken = '';
    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        accessToken = value;
        fetchWatchedVideo(accessToken);
        dispatch(setPickSidebar("History"))
        break;
      }
    }
    if (accessToken === '') {
      navigate('/')
    }

  }, []);

  // console.log("videosLiked", videosLiked);

  return (
    <div className={`w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex flex-col z-0 ml-[18px]
    sm:px-6 md:px-7 lg:px-8 xl:px-9 text-yt-white `}>
      {currentChannel
        ? <div className="flex gap-3">
          <div className="flex flex-col basis-3/4 mr-5">
            <HistoryLib videosHistory={videosHistory} home={home} />
            <LikedLib videosLiked={videosLiked} home={home} likedCount={likedCount} />
          </div>
          <div className="flex flex-1">
            <LibInfo uploadCount={uploadCount} likedCount={likedCount} />
          </div>
        </div>
        : <div className='flex flex-col min-h-[calc(100%-53px)] items-center justify-center w-full'>
          <MdVideoLibrary size={100} />
          <span className='mt-5 text-2xl font-semibold'>Enjoy your favorite videos</span>
          <span className='mt-5'>Sign in to access videos that you’ve liked or saved </span>
          <div className="mt-5 border border-yt-light-black w-fit rounded-r-full rounded-l-full
        hover:bg-yt-blue-1">
            <button
              className=" text-[#37A6FF] py-[6px] px-3 flex gap-2"
              onClick={handleLogin}>
              <HiOutlineUserCircle size={24} />
              Sign in
            </button>
          </div>
        </div>}
    </div>
  )
}

export default Library