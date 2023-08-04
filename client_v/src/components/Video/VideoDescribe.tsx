import moment from 'moment'
import { AllTags, VideoType } from '../../static/type'
import { useNavigate } from 'react-router';

interface VideoComp {
  video: VideoType | null;
  tags: AllTags[]
}
const VideoDescribe = ({ video, tags }: VideoComp) => {
  const navigate = useNavigate()
  return (
    <div className="bg-yt-light-black mt-4 rounded-2xl text-sm p-3 text-yt-white">
      <div className="flex items-center">
        <p className="font-medium pr-3 my-2">
          {Number(video?.views).toLocaleString()}
          <span className="pl-1 text-xs">Views</span>
        </p>
        <p className="font-medium pr-3 my-2">{moment(video?.upload_date).fromNow()}</p>
        {tags?.map((item, i: number) => (
          <span className='mr-[6px] text-yt-light-4 cursor-pointer' key={i}
            onClick={() => navigate(`/hashtag/${item?.tag}`)}>
            #{item?.tag}
          </span>
        ))}
      </div>
      <span className="text-center font-normal">{video?.description}</span>
    </div>
  )
}

export default VideoDescribe