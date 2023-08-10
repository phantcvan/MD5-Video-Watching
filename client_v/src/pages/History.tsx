import axios from 'axios';
import { useEffect, useState } from 'react'
import { ChannelType, VideoType } from '../static/type';
import { HiMagnifyingGlass, HiOutlineUserCircle } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2 } from 'react-icons/fi';
import { ImPlay2 } from 'react-icons/im';
import { AiOutlinePause } from 'react-icons/ai';
import { GoHistory } from 'react-icons/go';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { getAllChannels, getCurrentChannel, setCurrentChannel } from '../slices/channelSlice';
import { v4 as uuidv4 } from 'uuid';
import ModalPauseHistory from '../components/ModalPauseHistory';
import { Link, useNavigate } from 'react-router-dom';
import VideoCompInfo from '../components/VideoCompInfo';
import ModalDeleteHistory from '../components/ModalDeleteHistory';
import { formatDate, getCurrentDate } from '../static/fn'
import { setPickSidebar } from '../slices/appSlice';

interface HistoryProp {
  id: number;
  view_date: string;
  video: VideoType;
}

const History = () => {
  const [videos, setVideos] = useState<HistoryProp[]>([])
  const [videosFilter, setVideosFilter] = useState<HistoryProp[]>([])
  const [searchKeyword, setSearchKeyword] = useState('');
  const [openPauseModal, setOpenPauseModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [editable, setEditable] = useState(false);
  const [edited, setEdited] = useState(false);
  const dispatch = useDispatch();
  const allChannels = useSelector(getAllChannels);
  const currentChannel = useSelector(getCurrentChannel);
  const [home, setHome] = useState(false);
  const [description, setDescription] = useState(true);
  const allCookies = document.cookie;
  const navigate = useNavigate()


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };
  const handleSearch = () => {
    if (searchKeyword.replace(/\s+/g, ' ').trim()) {
      const keyword = searchKeyword.replace(/\s+/g, ' ').trim();
      console.log(keyword);
      const videoSearch = videos?.filter((item) => (item.video.title.toLowerCase().includes(keyword.toLowerCase())
        || (item.video.channel.channelName.toLowerCase().includes(keyword.toLowerCase()))))
      setVideosFilter(videoSearch);
    }
  };

  const handleAddKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    if (keyword === '') setVideosFilter(videos)
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
        const [videosResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/v1/history/${response?.data?.id}`),
        ]);
        const videoSort = videosResponse?.data?.sort((a: HistoryProp, b: HistoryProp) =>
          (b.id) - (a.id));
        setVideos(videoSort);
        setVideosFilter(videoSort);
        console.log("videosFilter", videoSort);
      } catch (error) {
        console.error(error);
      }

    } catch (error) {
      console.error('Error checking login:', error);
      return false;
    }
  }

  useEffect(() => {
    const cookieArray = allCookies.split(';');
    let accessToken = '';
    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      console.log(name, value);
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
  // console.log("uniqueViewDates", uniqueViewDates);
  let currentDate: string | null = null;
  function isSameDate(date1: Date | null, date2: string | null): boolean {
    if (!date1 || !date2) return false;

    const parsedDate2 = new Date(date2);

    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();

    const year2 = parsedDate2.getFullYear();
    const month2 = parsedDate2.getMonth();
    const day2 = parsedDate2.getDate();

    return year1 === year2 && month1 === month2 && day1 === day2;
  }
  return (
    <div className={`w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex flex-col z-0 ml-[18px]
    sm:px-6 md:px-7 lg:px-8 xl:px-9 text-yt-white `}>
      {currentChannel && <span className='text-4xl font-bold mt-3 mb-5 mx-5'>Watch history</span>}
      <div className='flex'>
        {currentChannel
          ? <div className='flex basis-2/3 flex-col ml-5 mr-10'>
            {videosFilter.map((video, index) => {
              const videoDate = new Date(video.view_date);
              const isDifferentDate = index === 0 || !isSameDate(videoDate, videosFilter[index - 1]?.view_date);
              return (
                <div key={video.id} className='flex flex-col my-1'>
                  {isDifferentDate && <p className='text-lg font-semibold'>
                    {formatDate(video.view_date)}
                    {/* {video.view_date} */}
                  </p>}
                  <div className='flex justify-between items-start my-3 gap-2 hide-scrollbar-x' >
                    <Link to={`/video/${video?.video.videoCode}`}>
                      <div className='w-[246px] aspect-video rounded-md cursor-pointer'>
                        <img src={video?.video.thumbnail}
                          alt=""
                          className={`w-[100%] object-cover aspect-video rounded-md`} />
                      </div>
                    </Link>
                    <div className='flex flex-1 '>
                      <VideoCompInfo video={video?.video} home={home} description={description}
                        editable={editable} setEdited={setEdited} />
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
                onClick={handleLogin}>
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