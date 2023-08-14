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
  const [editable, setEditable] = useState(false);
  const [edited, setEdited] = useState(false);

  const fetchData = async () => {
    try {
      const [channelResponse, videosResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/channel/hashtag/${searchQuery}`),
        axios.get(`http://localhost:5000/api/v1/videos/find/search?q=${searchQuery}`),
      ])
      setVideosSearch(videosResponse?.data);
      console.log("channelResponse", channelResponse?.data);
      setChannelSearch(channelResponse?.data[0])
      if (channelResponse?.data.length > 0) {
        const allVideosBelongChannel = [];
        try {
          for (const channel of channelResponse?.data) {
            try {
              const response = await axios.get(`http://localhost:5000/api/v1/videos/videosBelongChannel/${channel.id}`);
              const videosForChannel = response?.data;
              allVideosBelongChannel.push(...videosForChannel);
              console.log(allVideosBelongChannel);
            } catch (error) {
              console.error(`Error fetching videos for channel ${channel.id}:`, error);
            }
          }
          const mergedVideos = [...videosResponse?.data, ...allVideosBelongChannel].reduce((acc, video) => {
            const existingVideo = acc.find((v: VideoType) => v.id === video.id);
            if (!existingVideo) {
              acc.push(video);
            }
            return acc;
          }, []);
          setVideosSearch(mergedVideos);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData()
  }, [searchQuery])
  console.log("video", videosSearch);




  return (
    <div className={`w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex z-0 flex-col ml-[18px]
    sm:px-6 md:px-7 lg:px-8 xl:px-9`}>
      {message ? (
        <span className="text-yt-white font-medium text-lg mt-6 pt-4 ">
          {message}
        </span>
      ) : (
        <div className="w-full flex flex-col gap-4">
          {channelSearch && <ChannelSearch channelSearch={channelSearch} />}
          {channelSearch && <hr className="text-yt-light-6" />}
          <div>
            {videosSearch.length !== 0 && (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {videosSearch?.map((video) => (
                  <div className="" key={video?.id}>
                    <VideoComp home={home} video={video} editable={editable} setEdited={setEdited}
                    />
                  </div>
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