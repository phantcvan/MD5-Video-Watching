import ReactPlayer from "react-player"
import { VideoType } from "../../static/type"
import moment from "moment"
import { useState } from "react"
import VideoComp from "../VideoComp"
import { useNavigate } from "react-router"

interface HotVideoProp {
  videos: VideoType[]
}
const HotVideo = ({ videos }: HotVideoProp) => {
  const [home, setHome] = useState(false);
  const [editable, setEditable] = useState(false);
  const navigate = useNavigate();
  

  return (
    <div className="flex flex-col gap-5 my-2">
      <div className="flex gap-5 border-b border-b-yt-light-3 pb-5">
        <div className="w-[424px] aspect-video rounded-lg">
          <ReactPlayer
            url={videos[0]?.videoUrl}
            playing={true}
            muted
            width='100%'
            height='100%'
            controls
            style={{ borderRadius: "8px" }}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <span className="text-yt-white font-semibold my-2">{videos[0]?.title}</span>
          <span className="text-yt-light-5 my-2 text-sm">
            {Number(videos[0]?.views).toLocaleString()} {videos[0]?.views > 1 ? 'views' : 'view'} {'・'}{moment(videos[0]?.upload_date).fromNow()}
          </span>
          <span className="text-yt-white text-sm mr-20 text-justify ">
            {videos[0]?.description.length <= 300
              ? videos[0]?.description
              : `${videos[0]?.description.substr(0, Number(300))}...`}
          </span>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {videos?.map((video) => (
          <div onClick={() => navigate(`/video/${video?.videoCode}`)}
            className={``}
            key={video?.id}
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

export default HotVideo