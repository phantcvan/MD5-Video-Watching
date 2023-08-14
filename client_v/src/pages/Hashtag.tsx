import { useEffect, useState } from 'react';
import { useParams } from 'react-router'
import { VideoType } from '../static/type';
import VideoComp from '../components/VideoComp';
import axios from 'axios';

const Hashtag = () => {
  const { id: tag } = useParams();
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [videosBelongChannel, setVideosBelongChannel] = useState<VideoType[]>([]);
  const [channelCount, setChannelCount] = useState(0);
  const [home, setHome] = useState(false);
  const [editable, setEditable] = useState(false);
  const [edited, setEdited] = useState(false);
  const [start, setStart] = useState(1);


  const fetchData = async () => {
    try {
      const [videosResponse, channelResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/tag/withTag/${tag}`),
        axios.get(`http://localhost:5000/api/v1/channel/hashtag/${tag}`),
      ])
      console.log(channelResponse);
      setVideos(videosResponse?.data);
      setChannelCount(channelResponse?.data?.length);
      if (channelResponse?.data?.length > 0) {
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
          setVideos(mergedVideos);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log(videos);

  useEffect(() => {
    fetchData()
  }, [])
  console.log(tag);

  return (
    <div className={`w-full min-h-screen h-[calc(100%-53px)] mt-[53px] bg-yt-black flex flex-col z-0 ml-[18px]
    sm:px-6 md:px-7 lg:px-8 xl:px-9 text-yt-white`}>
      <div className='flex flex-col gap-2'>
        <span className='text-2xl font-semibold'>#{tag}</span>
        <span className='text-[16px] text-yt-light-4'>
          {videos.length} {videos.length > 1 ? "videos" : "video"} • {channelCount} {channelCount > 1 ? "channels" : "channel"}
        </span>
      </div>
      {videos.length > 0
        && (<div className="pt-4 px-5 grid grid-cols-yt gap-x-5 gap-y-8">
          {videos?.map((video) => (
            <div className="" key={video?.id}>
              <VideoComp home={home} video={video} editable={editable} setEdited={setEdited}
              />
            </div>
          ))}
        </div>)}


    </div>
  )
}

export default Hashtag