import { useDebugValue, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getShowMenu, setCurrentWidth, setShowLogIn, setShowMenu } from '../slices/appSlice';
import { useDispatch, useSelector } from "react-redux";
import "../index.css";
import axios from 'axios';
import { setAllTags, setVideos } from '../slices/videoSlice';
import { getAllChannels, getCurrentChannel, setAllChannels, setCurrentChannel } from '../slices/channelSlice';
import MiniSidebar from '../components/MiniSidebar';


const Public = () => {
  const showMenu = useSelector(getShowMenu);
  const [curWidth, setCurWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();
  // kiểm tra xem có token không
  const allCookies = document.cookie;

  const checkLogIn = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/auth', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setCurrentChannel(response?.data))
      // Refresh token
      try {
        const [authResponse] = await Promise.all([
          axios.post(`http://localhost:5000/api/v1/auth/signIn`, response?.data),
        ]);
        const jwtToken = authResponse?.data?.access_token;
        const expiresInDays = 7; 
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expiresInDays);
        const cookieString = `access_token=${jwtToken}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
        document.cookie = cookieString;
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
      if (name === 'access_token') {
        accessToken = value;
        checkLogIn(accessToken)
        break;
      }
    }
  }, [])


  // console.log(accessToken);

  // set Width khi resize
  const setWidth = (e: any) => {
    setCurWidth(e.target.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', setWidth)
    return () => {
      window.removeEventListener('resize', setWidth)
    }
  }, [])
  // truyền width cho các page
  useEffect(() => {
    dispatch(setCurrentWidth(curWidth))
  }, [curWidth])
  useEffect(() => {
    fetchChannel()
  }, [])

  const fetchChannel = async () => {
    try {
      const [channelsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/v1/channel"),
      ]);
      // console.log("channelsResponse", channelsResponse);
      dispatch(setAllChannels(channelsResponse?.data))
    } catch (error) {
      console.error(error);
    }
  }




  return (
    <div className='mt-2 overflow-y-auto'>
      <Navbar />
      <div className='flex flex-row h-full w-full bg-yt-black pb-3'>
        {curWidth >= 786 && <div className='flex flex-1'>
          <MiniSidebar />
        </div>}
        <div className='flex sm:basis-[82%] md:basis-[90%] lg:basis-[95%] overflow-x-auto hide-scrollbar-x'>
          <Outlet />
        </div>
        {showMenu && <Sidebar />}
      </div>
    </div>)
}

export default Public