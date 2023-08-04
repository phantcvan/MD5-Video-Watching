import axios from 'axios';
import { useEffect, useState } from 'react'
import { ChannelType, VideoType } from '../static/type';
import { HiMagnifyingGlass, HiOutlineUserCircle } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { FiTrash2 } from 'react-icons/fi';
import { ImPlay2 } from 'react-icons/im';
import { AiOutlinePause } from 'react-icons/ai';
import { getUser, setUser } from '../slices/userSlice';
import { GoHistory } from 'react-icons/go';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { getAllChannels, getCurrentChannel, setCurrentChannel } from '../slices/channelSlice';
import { v4 as uuidv4 } from 'uuid';
import ModalPauseHistory from '../components/ModalPauseHistory';
import moment from 'moment';
import VideoComp from '../components/VideoComp';
import { Link } from 'react-router-dom';
import VideoCompInfo from '../components/VideoCompInfo';
import ModalDeleteHistory from '../components/ModalDeleteHistory';

interface HistoryProp {
  id: number;
  view_date: string;
  video: VideoType;
}

interface ResponseProp {
  id: number;
  view_date: string;
  video: VideoType;
  channel: ChannelType;
}
const History = () => {
  const [videos, setVideos] = useState<HistoryProp[]>([])
  const [viewData, setViewData] = useState([])
  const [uniqueViewDates, setUniqueViewDates] = useState<string[] | []>([])
  const [searchKeyword, setSearchKeyword] = useState('');
  const [openPauseModal, setOpenPauseModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const user = useSelector(getUser);
  const allChannels = useSelector(getAllChannels);
  const currentChannel = useSelector(getCurrentChannel);
  const [home, setHome] = useState(false);
  const [description, setDescription] = useState(true);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };
  const handleSearch = () => {
    if (searchKeyword.replace(/\s+/g, ' ').trim()) {
      // dispatch(setSearchQuery(searchKeyword));
      // navigate({
      //   pathname: `/search`,
      //   search: createSearchParams({
      //     q: searchKeyword
      //   }).toString()
      // })
    }
  };
  const handleAddKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    console.log(keyword.replace(/\s+/g, ' ').trim());
  };

  const fetchWatchedVideo = async () => {
    try {
      const [videosResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/history/${currentChannel?.id}`),
      ]);
      console.log("videosResponse", videosResponse?.data);
      const videoSort = videosResponse?.data?.sort((a: HistoryProp, b: HistoryProp) =>
        new Date(b.view_date).getTime() - new Date(a.view_date).getTime());

      const transformedVideos = videoSort.map((item: ResponseProp) => ({
        id: item.id,
        view_date: item.view_date,
        video: { ...item.video, channel: { ...item.channel }, },
      }));
      console.log("transformedVideos", videoSort);
      setVideos(videoSort)

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchWatchedVideo();
  }, []);
  const formatDate = (date: string) => {
    const viewDate = moment(date);
    const now = moment();
    const diffInDays = now.diff(viewDate, 'days');
    const diffInWeeks = now.diff(viewDate, 'weeks');
    const isThisYear = now.year() === viewDate.year();

    if (diffInDays < 7) {
      return viewDate.format('dddd');
    } else if (diffInWeeks < 52 && isThisYear) {
      return viewDate.format('MMM DD');
    } else {
      return viewDate.format('YYYY, MMM DD');
    }
  }

  const handleLogin = async () => {
    const response = await signInWithPopup(auth, provider);
    handleAddChannel(response?.user)
  };

  const handleAddChannel = async (user: any) => {
    try {
      const findChannelIndex = allChannels?.findIndex(
        ((e: ChannelType) => e.email == user?.email
        ));
      // console.log("findChannelIndex", findChannelIndex);


      if (findChannelIndex === -1) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
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
  
  console.log("currentChannel", currentChannel);
  // console.log("uniqueViewDates", uniqueViewDates);
  let currentDate: string | null = null;
  return (
    <div className={`w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex flex-col z-0 ml-[18px]
    sm:px-6 md:px-7 lg:px-8 xl:px-9 text-yt-white `}>
      {currentChannel && <span className='text-4xl font-bold mt-3 mb-5 mx-5'>Watch history</span>}
      <div className='flex'>
        {currentChannel
          ? <div className='flex basis-2/3 flex-col ml-5 mr-10'>
            {videos.map((video) => {
              const isDifferentDate = currentDate !== video.view_date;
              currentDate = video.view_date;
              return (
                <div key={video.id} className='flex flex-col my-1'>
                  {isDifferentDate && <p className='text-lg font-semibold'>{formatDate(video.view_date)}</p>}
                  <div className='flex justify-between items-start my-3 gap-2 hide-scrollbar-x' >
                    <Link to={`/video/${video?.video.videoCode}`}>
                      <div className='w-[246px] aspect-video rounded-md cursor-pointer'>
                        <img src={video?.video.thumbnail}
                          alt=""
                          className={`w-[100%] object-cover aspect-video rounded-md`} />
                      </div>
                    </Link>
                    <div className='flex flex-1 '>
                      <VideoCompInfo video={video?.video} home={home} description={description}/>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>
          : <div className='flex flex-col mt-24 min-h-[calc(100%-53px)] items-center justify-center w-full'>
            <GoHistory size={100} />
            <span className='mt-5 text-2xl font-semibold'>Keep track of what you watch</span>
            <span className='mt-5'>Watch history isn't viewable when signed out. </span>
            <div className="mt-5 border border-yt-light-black w-fit rounded-r-full rounded-l-full
            hover:bg-yt-blue-1">
              <button
                className=" text-[#37A6FF] py-[6px] px-3 flex gap-2"
                onClick={handleLogin}
              >
                <HiOutlineUserCircle size={24} />
                Sign in
              </button>
            </div>
          </div>}
        {currentChannel && <div className='flex flex-1'>
          <div className='fixed flex flex-col'>
            <div className='border-b border-yt-white flex items-center mt-2 mb-4'>
              <button className="flex items-center hover:bg-yt-light-black p-2 rounded-full">
                <HiMagnifyingGlass
                  size={20}
                  onClick={handleSearch}
                  className="text-yt-white inline-block text-center font-thin"
                />
              </button>
              <div className="rounded-l-3xl h-10 w-[20vw] flex items-center">
                <input
                  type="text"
                  placeholder="Search watch history"
                  value={searchKeyword}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onChange={handleAddKeyword}
                  className="w-full bg-yt-black h-6 text-yt-white text-start focus:outline-none pl-4"
                />
              </div>
            </div>
            <div className='mt-2 p-3 w-fit gap-3 rounded-l-full rounded-r-full hover:bg-yt-light-black flex 
            items-center cursor-pointer' onClick={() => setOpenDeleteModal(true)}>
              <FiTrash2 size={20}
                className="text-yt-white inline-block text-center font-thin" />
              <span>Clear all watch history</span>
            </div>
            {currentChannel?.recordHistory === 1
              ? <div className='mt-2 p-3 w-fit gap-3 rounded-l-full rounded-r-full hover:bg-yt-light-black flex 
            items-center cursor-pointer' onClick={() => setOpenPauseModal(true)}>
                <AiOutlinePause size={20}
                  className="text-yt-white inline-block text-center font-thin" />
                <span>Pause watch history</span>
              </div>
              : <div className='mt-2 p-3 w-fit gap-3 rounded-l-full rounded-r-full hover:bg-yt-light-black flex 
            items-center cursor-pointer' onClick={() => setOpenPauseModal(true)}>
                <ImPlay2 size={20}
                  className="text-yt-white inline-block text-center font-thin" />
                <span>Turn on watch history</span>
              </div>}

          </div>
        </div>}

      </div>
      {(openPauseModal && currentChannel) && <ModalPauseHistory setOpenPauseModal={setOpenPauseModal} />}
      {(openDeleteModal && currentChannel) && <ModalDeleteHistory setOpenDeleteModal={setOpenDeleteModal} />}
    </div>
  )
}

export default History