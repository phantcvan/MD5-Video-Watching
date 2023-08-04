import React, { useState } from "react";
import { SideBar, CategoryItems } from "./data";
import { Link } from "react-router-dom";
import { getAllChannels, getChannelsSub } from '../slices/channelSlice';
import { setUser, getUser } from "../slices/userSlice";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { AiFillChrome, AiFillHome, AiOutlinePlaySquare } from "react-icons/ai";
import { MdOutlineSubscriptions } from "react-icons/md";
import { BiLike } from "react-icons/bi";
import { HiOutlineFire } from "react-icons/hi2";
import { IoMusicalNoteOutline } from "react-icons/io5";
import { SiYoutubegaming } from "react-icons/si";
import { BsNewspaper } from "react-icons/bs";
import { CiTrophy } from "react-icons/ci";
import { ChannelType } from "./type";

interface SideBarType {
  icon: React.ReactNode;
  title: string;
  path: string;
}

// Define the type for SideBarItems
// interface SideBarType {
//   Top: SidebarItem[];
  // Middle: SidebarItem[];
  // Explore: SidebarItem[];
  // Subscriptions: SidebarItem[];
// }
const currentChannel = useSelector(getUser);
let Top: SideBarType
let Home=<AiFillHome size={21} />

export const TopData = () => {
if (userNow !== null) {
    Top: [
      { icon: <AiFillHome size={21} />, title: "Home", path: "" },
      {
        icon: <MdOutlineSubscriptions size={21} />,
        title: "Subscriptions",
        path: "/subscription",
      },
    ],
    // Middle: [
    //   // { icon: <MdVideoLibrary size={21} />, title: "Library", path: ''  },
    //   // { icon: <VscHistory size={21} />, title: "History", path: '/history'  },
    //   {
    //     icon: <AiOutlinePlaySquare size={21} />,
    //     title: "Your videos",
    //     path: `/channel/${channel_id}`,
    //   },
    //   {
    //     icon: <BiLike size={21} />,
    //     title: "Liked videos",
    //     path: "/likedVideos",
    //   },
    // ],
    // Explore: [
    //   { icon: <HiOutlineFire size={21} />, title: "Trending", path: "" },
    //   { icon: <IoMusicalNoteOutline size={21} />, title: "Music", path: "" },
    //   { icon: <SiYoutubegaming size={21} />, title: "Gaming", path: "" },
    //   { icon: <BsNewspaper size={21} />, title: "News", path: "" },
    //   { icon: <CiTrophy size={23} />, title: "Sports", path: "" },
    // ],
  //   Subscriptions: channelsSub.map((channel) => ({
  //     logoUrl: channel.logoUrl,
  //     title:
  //       channel.channelName.length <= 15
  //         ? channel.channelName
  //         : `${channel.channelName.substr(0, 15)}...`,
  //     path: `/channel/${channel.channel_id}`,
  //   })),
  // };
// return {
//   sideBarItems,
// };
}
}