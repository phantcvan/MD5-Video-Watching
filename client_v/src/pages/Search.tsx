import { useDispatch, useSelector } from "react-redux";
import { getSearchQuery } from "../slices/videoSlice";
import { getAllChannels, getCurrentChannel } from "../slices/channelSlice";
import { useEffect, useState } from "react";
import { ChannelType, VideoType } from "../static/type";
import VideoComp from "../components/VideoComp";
import axios from "axios";
import ChannelSearch from "../components/Search/ChannelSearch";


const Search = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(getSearchQuery);
  const allChannels = useSelector(getAllChannels);
  const currentChannel = useSelector(getCurrentChannel);
  const [message, setMessage] = useState("");
  const [home, setHome] = useState(false);
  const [videosSearch, setVideosSearch] = useState<VideoType[]>([]);
  const [channelSearch, setChannelSearch] = useState<ChannelType | null>(null);
  const fetchData = async () => {
    try {
      const [channelResponse, videosResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/channel/find/search?q=${searchQuery}`),
        axios.get(`http://localhost:5000/api/v1/videos/find/search?q=${searchQuery}`),
      ])
      // console.log("searchQuery", searchQuery);
      setVideosSearch(videosResponse?.data);
      setChannelSearch(channelResponse?.data)
    } catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    fetchData()
  }, [searchQuery])




  return (
    <div className={`w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex z-0 flex-col ml-[18px]
    sm:px-6 md:px-7 lg:px-8 xl:px-9`}>
      {message ? (
        <span className="text-yt-white font-medium text-lg mt-6 pt-4 ">
          {message}
        </span>
      ) : (
        <div className="w-full">
          <ChannelSearch channelSearch={channelSearch} />
          <div>
            {videosSearch.length !== 0 && (
              <div className="pt-4 px-5 grid grid-cols-yt gap-x-5 gap-y-8">
                {videosSearch?.map((video) => (
                  <div className="" key={video?.id}>

                  </div>
                  // <VideoComp home={home} video={video}
                  // />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Search