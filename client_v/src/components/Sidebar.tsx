import React, { useState } from "react";
import { CategoryItems } from "../static/data";
import { Link } from "react-router-dom";
import { getAllChannels, getChannelsSub, getCurrentChannel, setCurrentChannel } from '../slices/channelSlice';
import { setUser, getUser } from "../slices/userSlice";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { AiFillChrome, AiFillHome, AiOutlineMenu, AiOutlinePlaySquare } from "react-icons/ai";
import { MdOutlineSubscriptions, MdVideoLibrary } from "react-icons/md";
import { BiLike } from "react-icons/bi";
import { HiOutlineFire, HiOutlineUserCircle } from "react-icons/hi2";
import { IoMusicalNoteOutline } from "react-icons/io5";
import { SiYoutubegaming } from "react-icons/si";
import { BsNewspaper } from "react-icons/bs";
import { CiTrophy } from "react-icons/ci";
import { ChannelType } from "../static/type";
import { setShowMenu } from "../slices/appSlice";
import { GoHistory } from "react-icons/go";
import { RiVideoFill } from "react-icons/ri";
import "../index.css";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

interface SidebarItem {
  icon: React.ReactNode;
  name: string;
  path: string;
}


const Sidebar = ({ }) => {
  const [active, setActive] = useState("Home");
  const dispatch = useDispatch();
  const currentChannel = useSelector(getCurrentChannel);
  const myChannelId = 123;
  const allChannels = useSelector(getAllChannels);
  // const channelsSub = useSelector(getChannelsSub);
  // let SideBarItems: SideBarType;

  // const channel_id = allChannels?.find((e, i) => e.email === user.email)?.channel_id;

  const handleLogin = async () => {
    const response = await signInWithPopup(auth, provider);
    // dispatch(setUser(response?.user));
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
        const [channelResponse, authResponse] = await Promise.all([
          axios.post("http://localhost:5000/api/v1/channel", newChannel),
          axios.post(`http://localhost:5000/api/v1/auth`, newChannel),
        ]);
        console.log("authResponse 1", authResponse);

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
            axios.post(`http://localhost:5000/api/v1/auth`, channelNow[0]),
          ]);
          console.log("authResponse 2", authResponse?.data?.access_token);
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


  return (
    <div className="w-full h-[100vh] z-20 overflow-y-hidden bg-overlay-w-100 
    mt-14 fixed top-0 left-0 text-yt-white">
      <div className="w-full h-full z-20 bg-overlay-w-100 " onClick={() => dispatch(setShowMenu(false))}>

      </div>
      <div className="w-60 h-[calc(100vh-53px)] p-3 z-30 absolute top-0 bg-yt-black animate-slide-right
      hide-scrollbar overflow-y-auto" >

        <div className="mb-4">
          {/* Home */}
          <Link to="/">
            <div
              className={`h-10 flex justify-start px-3 rounded-xl items-center cursor-pointer hover:bg-yt-light-black
               my-1 ${active === "Home" ? "bg-yt-light-black" : "bg-yt-black"
                }`}
              onClick={() => { setActive("Home"); dispatch(setShowMenu(false)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <span className="mr-5 my-1"><AiFillHome size={21} /></span>
              <p className="p-2 text-sm font-medium">Home</p>
            </div>
          </Link>
          {/* Subscription */}
          <Link to="/subscription">
            <div
              className={`h-10 flex justify-start px-3 rounded-xl items-center cursor-pointer hover:bg-yt-light-black
               my-1 ${active === "Subscription" ? "bg-yt-light-black" : "bg-yt-black"
                }`}
              onClick={() => { setActive("Subscription"); dispatch(setShowMenu(false)) }}
            >
              <span className="mr-5 my-1"><MdOutlineSubscriptions size={21} /></span>
              <p className="p-2 text-sm font-medium">Subscription</p>
            </div>
          </Link>
          <hr className="text-yt-light-black my-2" />
          {/* Library */}
          <Link to="/library">
            <div
              className={`h-10 flex justify-start px-3 rounded-xl items-center cursor-pointer hover:bg-yt-light-black
               my-1 ${active === "Library" ? "bg-yt-light-black" : "bg-yt-black"
                }`}
              onClick={() => { setActive("Library"); dispatch(setShowMenu(false)) }}
            >
              <span className="mr-5 my-1"><MdVideoLibrary size={21} /></span>
              <p className="p-2 text-sm font-medium">Library</p>
            </div>
          </Link>
          {/* History */}
          <Link to="/history">
            <div
              className={`h-10 flex justify-start px-3 rounded-xl items-center cursor-pointer hover:bg-yt-light-black
               my-1 ${active === "History" ? "bg-yt-light-black" : "bg-yt-black"
                }`}
              onClick={() => { setActive("History"); dispatch(setShowMenu(false)) }}
            >
              <span className="mr-5 my-1"><GoHistory size={21} /></span>
              <p className="p-2 text-sm font-medium">History</p>
            </div>
          </Link>
          {!currentChannel
            && <Link to={`/channel/${myChannelId}`}>
              <div
                className={`h-10 flex justify-start px-3 rounded-xl items-center cursor-pointer hover:bg-yt-light-black
             my-1 ${active === "Channel" ? "bg-yt-light-black" : "bg-yt-black"
                  }`}
                onClick={() => { setActive("Channel"); dispatch(setShowMenu(false)) }}
              >
                <span className="mr-5 my-1"><RiVideoFill size={21} /></span>
                <p className="p-2 text-sm font-medium">Your Videos</p>
              </div>
            </Link>
          }
          <hr className="text-yt-light-black my-2" />


        </div>
        {/* {sidebar.SideBarItems.Middle.length > 0
        && <>
          <hr className="text-yt-light-black my-2" />
          <div className="mb-4">
            {sidebar.SideBarItems.Middle.map((item, index) => (
              <Link to={item.path} key={index}>
                <div
                  key={index}
                  className={`h-10 flex justify-start px-3 rounded-xl items-center cursor-pointer hover:bg-yt-light-black my-1 ${item.name === active ? "bg-yt-light-black" : "bg-yt-black"
                    }`}
                  onClick={() => setActive(item.name)}
                >
                  <span className="mr-5">{item.icon}</span>
                  <p className="p-2 text-sm font-medium">{item.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </>} */}
        {!currentChannel
          && <div className="px-3">
            <div className="mb-4 ">
              <span className="my-2 text-justify">Sign in to like videos, comment, and subscribe.</span>
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
            </div>
          </div>
        }
        {/* {user && sidebar.SideBarItems.Subscriptions.length > 0
        && <div>
          <hr className="text-yt-light-black my-2" />
          <h2 className="py-2 px-3">Subscriptions</h2>
          <div className="mb-4">
            {sidebar.SideBarItems.Subscriptions.map((item, index) => (
              <Link to={item.path} key={index}>
                <div
                  className={`h-10 flex justify-start px-3 rounded-xl items-center cursor-pointer hover:bg-yt-light-black
               my-1 ${item.name === active ? "bg-yt-light-black" : "bg-yt-black"} gap-4`}
                  onClick={() => setActive(item.name)}
                >
                  <div className="h-6 w-6 rounded-full overflow-hidden">
                    <img src={item.logoUrl} alt="" />
                  </div>
                  <p className="p-2 text-sm font-medium">{item.name}</p>
                </div>
              </Link>
            ))}

          </div>
        </div>} */}
        <hr className="text-yt-light-black" />
        <div className="flex flex-wrap">
          {CategoryItems.map((item, index) => {
            return (
              <div
                key={index}
                className={`h-8 flex flex-wrap justify-start px-1 rounded-xl items-center cursor-pointer hover:bg-yt-light-black`}
              >
                <p className="px-2 text-sm">{item}</p>
              </div>
            )
          }
          )}
        </div>
        <hr className="text-yt-light-black my-2" />
      </div>
    </div>
  );
};

export default Sidebar;
