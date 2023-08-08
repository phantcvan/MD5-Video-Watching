import { GoHistory } from "react-icons/go"
import { Link } from "react-router-dom"
import VideoComp from "../VideoComp"
import { VideoType } from "../../static/type"
import { useState } from "react"


interface HistoryLib {
  videosHistory: VideoType[],
  home: boolean
}

const HistoryLib = ({ videosHistory, home }: HistoryLib) => {
  const [editable, setEditable] = useState(false);

  return (
      <div className='flex flex-col ml-5 mt-5'>
        <div className="flex justify-between mt-2 my-4 items-center">
          <Link to="/history">
            <span className="flex gap-3 font-semibold">
              <GoHistory size={24} /> History
            </span>
          </Link>
          <Link to="/history">
            <span className='text-yt-blue-2 px-5 py-2 hover:bg-yt-blue-1 cursor-pointer rounded-l-full
             rounded-r-full'>
              See all
            </span>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {videosHistory?.splice(0, 8).map((video) => (
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

export default HistoryLib