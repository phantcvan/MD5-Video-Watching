import { AiOutlineLike } from "react-icons/ai"
import { Link } from "react-router-dom"
import { VideoType } from "../../static/type"
import VideoComp from "../VideoComp"
import { useState } from "react"

interface LikedProp {
  videosLiked: VideoType[],
  home: boolean,
  likedCount: number
}
const LikedLib = ({ videosLiked, home, likedCount }: LikedProp) => {
  const [editable, setEditable] = useState(false);
  return (
    <div className='flex flex-col ml-5 mt-5'>
      <div className="flex justify-between mt-2 my-4 items-center">
        <Link to="/likedVideos">
          <span className="flex gap-3 font-semibold">
            <AiOutlineLike size={24} /> Liked videos
            <span className="text-yt-light-5">{likedCount}</span>
          </span>
        </Link>
        <Link to="/likedVideos">
          <span className='text-yt-blue-2 px-5 py-2 hover:bg-yt-blue-1 cursor-pointer rounded-l-full
             rounded-r-full'>
            See all
          </span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {videosLiked?.splice(0, 4).map((video) => (
          <div
            className={``}
            key={video.id}
          >
            <VideoComp
              video={video} home={home} editable={editable}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default LikedLib