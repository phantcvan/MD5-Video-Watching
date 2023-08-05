import React, { useState } from 'react'
import { HiMagnifyingGlass, HiOutlineBars3, HiOutlineUserCircle } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getCurrentWidth, getShowLogIn, getShowMenu, setShowLogIn, setShowMenu } from '../slices/appSlice';
import { Link, createSearchParams } from 'react-router-dom';
import { setSearchQuery } from '../slices/videoSlice';
import { BiVideoPlus } from "react-icons/bi";
import { getUser, logout, setUser } from '../slices/userSlice';
import UploadVideo from './UploadVideo';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { BsPersonCircle } from "react-icons/bs";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { getAllChannels, getCurrentChannel, setCurrentChannel } from '../slices/channelSlice';
import { ChannelType } from '../static/type';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate } from '../static/fn';
// import { handleAddChannel } from "../static/handleAddChannel";



const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showMenu = useSelector(getShowMenu);
  // console.log("showMenu", showMenu);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [openUpload, setOpenUpload] = useState(false);
  const currentChannel = useSelector(getCurrentChannel);
  const showLogIn = useSelector(getShowLogIn);
  const curWid = useSelector(getCurrentWidth)
  const allChannels = useSelector(getAllChannels)
  // console.log("allChannels", allChannels);



  // Search
  const handleSearch = () => {
    if (searchKeyword.replace(/\s+/g, ' ').trim()) {
      dispatch(setSearchQuery(searchKeyword));
      navigate({
        pathname: `/search`,
        search: createSearchParams({
          q: searchKeyword
        }).toString()
      })
    }
  };
  const handleAddKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    console.log(keyword.replace(/\s+/g, ' ').trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  // login
  const handleLogin = async () => {
    const response = await signInWithPopup(auth, provider);
    // console.log("response", response);

    // dispatch(setUser(response?.user));
    handleAddChannel(response?.user);
  };

  // const saveToken = async () => {
  //   try {
  //     await axios.post("http://localhost:5000/api/v1/auth")
  //   } catch (error) {

  //   }
  // }
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

  // Logout
  const handleLogout = async () => {
    dispatch(setUser(null));
    dispatch(setCurrentChannel(null));
    dispatch(setShowLogIn(false));
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    await signOut(auth);
  };

  const handleDropdownToggle = () => {
    showLogIn == false ? dispatch(setShowLogIn(true)) : dispatch(setShowLogIn(false));

  };
  let channel_id = ""
  if (currentChannel != null) {
    // channel_id = allChannels?.find(channel => channel.email === user?.email)?.channel_id;
  }


  return (
    <div className="bg-yt-black fixed top-0 w-[100%] z-10 pb-2 flex">
      <div className="h-14 flex items-center pl-4 sm:pr-5 md:pr-2 justify-between">
        <div className="flex justify-between items-center flex-1">
          <div
            className="text-yt-white p-2 w-10 text-2xl text-center hover:bg-yt-light-black rounded-full 
    cursor-pointer"
            onClick={() => dispatch(setShowMenu(!showMenu))}>
            <HiOutlineBars3 />
          </div>
          {curWid >= 786
            && <div className="py-5 w-32 pr-3 md:mr-4 lg:mr-16 xl:mr-28"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Link to="/">
                <img src="/assets/yt-logo-white.png" alt="" className="object-contain" />
              </Link>
            </div>}
        </div>

        <div className={`h-10 flex flex-row items-center justify-between m-auto basis-[70%]`}>
          <div className={`bg-yt-black flex border border-yt-light-black items-center justify-between 
            rounded-3xl h-10 w-[100%]`}>
            <div className="rounded-l-3xl hover:border hover:border-[#1C62B9] h-10 w-[50vw] flex items-center">
              <input
                type="text"
                placeholder="Search"
                value={searchKeyword}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={handleAddKeyword}
                className="w-full bg-yt-black h-6 ml-6 text-yt-white text-start focus:outline-none pl-4"
              />
            </div>
            <button className="w-16 h-10 bg-yt-light-black px-2 py-0.5 rounded-r-3xl border-l-2 border-yt-light-black">
              <HiMagnifyingGlass
                size={22}
                onClick={handleSearch}
                className="text-yt-white inline-block text-center font-thin"
              />
            </button>
          </div>
        </div>

        <div className="flex flex-row basis-1/4 items-center sm:mr-3 md:mr-1 justify-end sm:ml-24 md:ml-6 lg:ml-28 ">
          {/* <div className="flex flex-row flex-1 items-center justify-end"> */}
          {currentChannel &&
            <div className="mr-2 p-2 w-10 hover:bg-yt-light-black rounded-full cursor-pointer">
              <BiVideoPlus size={25} className="text-yt-white text-center"
                onClick={() => setOpenUpload(true)} />
            </div>}
          <div className={`mx-1 items-center cursor-pointer flex justify-end`}>
            {!currentChannel ? (
              <div className="my-2 border border-yt-light-black w-fit rounded-r-full rounded-l-full 
              hover:bg-yt-blue-1">
                <button
                  className=" text-[#37A6FF] py-[6px] px-3 flex gap-2"
                  onClick={handleLogin}
                >
                  <HiOutlineUserCircle size={24} />
                  Sign in
                </button>
              </div>
            ) : (
              <div>
                <img
                  src={currentChannel?.logoUrl}
                  alt={currentChannel?.channelName}
                  onClick={handleDropdownToggle}
                  className="object-contain rounded-full cursor-pointer w-10 h-10"
                />
                {showLogIn && (
                  <div className={`dropdown absolute mt-2 bg-[#282828] rounded-md shadow-lg right-[10px]`}>
                    <ul className="py-1">
                      <Link to={`/channel/${channel_id}`}>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-yt-white"
                          onClick={() => dispatch(setShowLogIn(false))}>
                          <span className="flex items-center gap-2"><BsPersonCircle size={20} /> Your Channel</span>
                        </li>
                      </Link>
                      <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-yt-white"
                        onClick={handleLogout}>
                        <span className="flex items-center gap-2"><RiLogoutCircleRLine size={20} /> Log out</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            {/* </div> */}


          </div>
        </div>
      </div>
      {openUpload && <UploadVideo setOpenUpload={setOpenUpload} />}

    </div>

  )
}

export default Navbar