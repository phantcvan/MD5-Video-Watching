import React, { useEffect, useRef, useState } from 'react'
import { HiMagnifyingGlass, HiOutlineBars3, HiOutlineUserCircle } from 'react-icons/hi2';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { getCurrentWidth, getShowLogIn, getShowMenu, setShowLogIn, setShowMenu } from '../slices/appSlice';
import { Link, createSearchParams } from 'react-router-dom';
import { setSearchQuery } from '../slices/videoSlice';
import { BiVideoPlus } from "react-icons/bi";
import { getUser, logout, setUser } from '../slices/userSlice';
import UploadVideo from './Upload/UploadVideo';
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { BsPersonCircle } from "react-icons/bs";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { getAllChannels, getCurrentChannel, setChannelsSub, setCurrentChannel } from '../slices/channelSlice';
import { ChannelType, SearchHistoryType, SearchSuggestType } from '../static/type';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate } from '../static/fn';
import { FiEdit3 } from 'react-icons/fi';
import { Tooltip } from 'antd';
import { GoHistory } from 'react-icons/go';
// import { handleAddChannel } from "../static/handleAddChannel";



const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showMenu = useSelector(getShowMenu);
  // console.log("showMenu", showMenu);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [openUpload, setOpenUpload] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryType[]>([]);
  const [searchSuggest, setSearchSuggest] = useState<SearchSuggestType[]>([]);
  const currentChannel = useSelector(getCurrentChannel);
  const showLogIn = useSelector(getShowLogIn);
  const curWid = useSelector(getCurrentWidth)
  const allChannels = useSelector(getAllChannels);
  const tooltipRef = useRef(null);
  // console.log("allChannels", allChannels);
  // đóng Tooltip khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current) {
        const clickedOutside = !(tooltipRef.current.contains(event.target));
        if (clickedOutside) {
          setOpenTooltip(false);
          setSearchSuggest([]);
          setSearchKeyword('')
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Search
  const loadSearchHistory = async () => {
    if (currentChannel) {
      try {
        const searchResponse = await axios.get(`http://localhost:5000/api/v1/search/all/${currentChannel?.id}`)
        // console.log("searchResponse", searchResponse);
        if (searchResponse?.data.length > 0) {
          const searchData = searchResponse?.data.reverse().slice(0, 4);
          setSearchHistory(searchData)
          setOpenTooltip(true)
        } else {
          setOpenTooltip(false)
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  // console.log("searchHistory", searchHistory);
  const handleAddKeyword = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    const keywordTrim = keyword.replace(/\s+/g, ' ').trim()
    const dataFilter = searchHistory?.filter((item: SearchHistoryType) =>
      item.searchContent.toLowerCase().includes(keywordTrim.toLowerCase()))
    let searchHistoryLength = 0
    { dataFilter.length > 4 ? searchHistoryLength = 4 : searchHistoryLength = dataFilter.length }
    console.log(searchHistoryLength);
    // const searchHistoryTrim = searchHistory.slice(0, searchHistoryLength)
    setSearchHistory(dataFilter.slice(0, searchHistoryLength));
    const suggestLength = 10 - searchHistoryLength;
    try {
      const searchData = await axios.get(`http://localhost:5000/api/v1/tag/search/${keywordTrim}`)
      console.log("searchData", searchData);
      if (searchData?.data.length > 0) {
        // bỏ tag trùng
        const searchUnique: SearchSuggestType[] = [];
        searchData?.data.forEach((data: SearchSuggestType) => {
          if (!searchUnique.some((search) => search.tag === data.tag)) {
            searchUnique.push(data);
          }
        });
        // Kiểm tra xem có bất kỳ searchContent nào trùng với tag của suggestItem không
        const filteredSearchSuggest = searchUnique.filter(suggestItem => {
          const hasMatchingContent = dataFilter.slice(0, searchHistoryLength).some(historyItem =>
            historyItem.searchContent === suggestItem.tag
          );
          return !hasMatchingContent;
        });
        // cắt ngắn mảng, chỉ lấy tối đa 10 kết quả
        const searchDataTrim = filteredSearchSuggest?.slice(0, suggestLength);
        setSearchSuggest(searchDataTrim)
      }
      if (searchData?.data.length === 0 && searchHistory.length === 0) {
        setOpenTooltip(false)
      } else {
        setOpenTooltip(true)
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = async () => {
    if (searchKeyword.replace(/\s+/g, ' ').trim()) {
      const newSearch = {
        searchContent: searchKeyword.replace(/\s+/g, ' ').trim(),
        channelId: currentChannel?.id
      }
      try {
        const searchResponse = await axios.post(`http://localhost:5000/api/v1/search`, newSearch)
        // console.log("searchResponse", searchResponse);
        if (searchResponse.status === 201) {
          setOpenTooltip(false)
          setSearchKeyword('');
          dispatch(setSearchQuery(searchKeyword));
          navigate({
            pathname: `/search`,
            search: createSearchParams({
              q: searchKeyword
            }).toString()
          })
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleSearch();
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
        const [channelResponse, authResponse] = await Promise.all([
          axios.post("http://localhost:5000/api/v1/channel", newChannel),
          axios.post(`http://localhost:5000/api/v1/auth/signUp`, newChannel),
        ]);

        const randomId = Math.floor(Math.random() * 10000000);
        const newChannelWithId = Object.assign({}, newChannel, {
          id: randomId,
        });
        dispatch(setCurrentChannel(newChannelWithId))
      } else {
        const channelNow = allChannels?.filter((channel: ChannelType) => channel?.email === user?.email)
        dispatch(setCurrentChannel(channelNow[0]))
        try {
          const [authResponse] = await Promise.all([
            axios.post(`http://localhost:5000/api/v1/auth/signIn`, channelNow[0]),
          ]);
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
    dispatch(setChannelsSub(null));
    dispatch(setShowLogIn(false));
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    await signOut(auth);
  };


  const handleDropdownToggle = () => {
    showLogIn == false ? dispatch(setShowLogIn(true)) : dispatch(setShowLogIn(false));
  };

  const handleDeleteSearch = async (id: number) => {
    try {
      const deleteAct = await axios.delete(`http://localhost:5000/api/v1/search/${id}`)
      if (deleteAct.status === 200) {
        const newSearchHistory = searchHistory.filter((sh) => sh.id !== id)
        setSearchHistory(newSearchHistory);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClickSearchSuggest = async (item: string) => {
    if (currentChannel) {
      const newSearch = {
        searchContent: item,
        channelId: currentChannel?.id
      }
      try {
        const searchResponse = await axios.post(`http://localhost:5000/api/v1/search`, newSearch)
        console.log("searchRespone", searchResponse);
        if (searchResponse.status === 201) {
          setOpenTooltip(false)
          setSearchKeyword('');
          dispatch(setSearchQuery(item));
          navigate({
            pathname: `/search`,
            search: createSearchParams({
              q: item
            }).toString()
          })
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setOpenTooltip(false)
      setSearchKeyword('');
      dispatch(setSearchQuery(item));
      navigate({
        pathname: `/search`,
        search: createSearchParams({
          q: item
        }).toString()
      })
    }
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

        <div className={`h-10 flex flex-row items-center justify-between m-auto basis-[70%] relative`}>
          <div className={`bg-yt-black flex border border-yt-light-black items-center justify-between 
            rounded-3xl h-10 w-[100%]`}>
            <div className="rounded-l-3xl hover:border hover:border-[#1C62B9] h-10 w-[50vw] flex
             items-center relative" >
              <input
                type="text"
                placeholder="Search"
                value={searchKeyword}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={handleAddKeyword}
                onClick={loadSearchHistory}
                className="w-full bg-yt-black h-6 ml-6 text-yt-white text-start focus:outline-none pl-4"
              />
              {openTooltip
                && <div className='flex flex-col gap-2 absolute top-12 bg-yt-light-black rounded-md px-2 
                py-2 w-full' ref={tooltipRef}>
                  {searchHistory.map((sh) => (
                    <div className='flex items-center justify-between' key={sh.id}>
                      <div className='flex gap-3 items-center text-yt-white cursor-pointer'
                        onClick={() => handleClickSearchSuggest(sh.searchContent)}>
                        <GoHistory size={18} />
                        <span className='text-[15px] text-yt-white font-semibold'>
                          {sh.searchContent}
                        </span>
                      </div>
                      <span className='text-yt-blue cursor-pointer' onClick={() => handleDeleteSearch(sh.id)}>
                        Remove
                      </span>
                    </div>
                  ))}
                  {searchSuggest.map((ss) => (
                    <div className='flex items-center justify-between cursor-pointer' key={ss.id}
                      onClick={() => handleClickSearchSuggest(ss.tag)}>
                      <div className='flex gap-3 items-center text-yt-white'>
                        <HiMagnifyingGlass size={18} />
                        <span className='text-[15px] text-yt-white font-semibold'>
                          {ss.tag?.length <= 70
                            ? ss.tag
                            : `${ss.tag.substr(0, 70)}...`}
                        </span>
                      </div>
                    </div>
                  ))}

                </div>}
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
                  className="rounded-full cursor-pointer w-10 h-10 overflow-hidden object-cover"
                />
                {showLogIn && (
                  <div className={`dropdown absolute mt-2 bg-[#282828] rounded-md shadow-lg right-[10px]`}>
                    <ul className="py-1">
                      <Link to={`/channel/${currentChannel?.channelCode}`}>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-yt-white"
                          onClick={() => dispatch(setShowLogIn(false))}>
                          <span className="flex items-center gap-2"><BsPersonCircle size={20} /> Your Channel</span>
                        </li>
                      </Link>
                      <Link to={`/edit-info/${currentChannel?.channelCode}`}>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-yt-white"
                          onClick={() => dispatch(setShowLogIn(false))}>
                          <span className="flex items-center gap-2">
                            <FiEdit3 size={20} /> Customize channel
                          </span>
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