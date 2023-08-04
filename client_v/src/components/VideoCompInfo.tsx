import React from 'react';
import { VideoType } from '../static/type';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentWidth } from '../slices/appSlice';
import { handleNumber } from "../static/fn";
import moment from "moment";
import { MdVerified } from 'react-icons/md';

interface VideoComp {
  video: VideoType,
  home: boolean,
  description: boolean
}
const VideoCompInfo = ({ video, home, description }: VideoComp) => {
  // console.log(video.channel);

  const curWid = useSelector(getCurrentWidth);
  // thiết lập độ dài title
  let titleMaxLength;
  if (curWid <= 480) {
    if (home) titleMaxLength = 30
    else titleMaxLength = 25
  } else if (curWid <= 1024) {
    if (home) titleMaxLength = 48
    else titleMaxLength = 30
  } else {
    if (home) titleMaxLength = 70
    else titleMaxLength = 50
  }
  // const titleMaxLength = curWid <= 480 ? "30" : curWid <= 1024 ? "48" : "70";
  // thiết lập độ dài channel Name
  const channelMaxLength = curWid <= 480 ? "18" : curWid <= 1024 ? "35" : "70";
  return (
    <div className="ml-2 flex justify-between gap-2 w-full">
      <div className="flex flex-1 flex-col mt-2">
        <div className='flex flex-row gap-2 items-center'>
          {home && <Link to={`/channel/${video?.channel?.channelCode}`}>
            <div className={`flex h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 xl:h-9 xl:w-9 rounded-full overflow-hidden`}>
              <img
                src={video?.channel?.logoUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </Link>}

          <Link to={`/video/${video?.videoCode}`}>
            <h2
              className={`font-medium text-yt-white mt-0 mb-0 items-center text-justify text-sm`}
            >
              {video?.title?.length <= Number(titleMaxLength)
                ? video?.title
                : `${video?.title.substr(0, Number(titleMaxLength))}...`}
            </h2>
          </Link>
        </div>
        {/* {channelDisplay && ( */}
        <div className={`${home && "ml-8 md:ml-9 lg:ml-10 xl:ml-11"}`}>
          <Link to={`/channel/${video?.channel?.channelCode}`}>
            <h3
              className={`text-yt-gray ${curWid <= 480 ? "text-[10px]" : "text-xs"
                } mt-1 flex items-center`}
            >
              {video?.channel?.channelName?.length <= Number(channelMaxLength)
                ? video?.channel?.channelName
                : `${video?.channel?.channelName.substr(0, Number(channelMaxLength))}...`}
              <span className="p-1">
                <MdVerified />
              </span>
            </h3>
          </Link>
          {/* )} */}
          <p
            className={`text-yt-gray cursor-default m-0 font-medium ${curWid <= 480 ? "text-[10px]" : "text-xs"
              }`}
          >
            {`${handleNumber(Number(video?.views))}`} Views • {moment(video?.upload_date).fromNow()}
          </p>
          {description && <span className={`text-yt-gray cursor-default mt-1 font-medium text-[13px]`}>
            {video?.description.length <= 150
              ? video?.description
              : `${video?.description.substr(0, Number(150))}...`}
          </span>}
        </div>
      </div>
      {/* {canEdit && (
        <div className="relative flex basis-[10%] justify-end">
          <span
            className="hover:rounded-full hover:bg-yt-light-2 p-2 w-8 h-8 flex items-center "
            onClick={() => setOpenMenu((pre) => !pre)}
          >
            <BsThreeDotsVertical size={18} />
          </span>
          {openMenu && (
            <div className="bg-yt-light-2 p-2 rounded-md text-yt-gray flex flex-col absolute top-0 left-[38px] w-[120px]">
              <span
                className="hover:text-yt-white"
                onClick={() => {
                  setEdit(true);
                }}
              >
                Edit video
              </span>
              <span
                className="hover:text-yt-white"
                onClick={() => handleDeleteVideo(video_id)}
              >
                Delete video
              </span>
            </div>
          )}
        </div>
      )} */}
      {/* {edit && (
        <VideoDetail
          setEdit={setEdit}
          setEdited={setEdited}
          setOpen={setOpen}
          videoId={video_id}
          user={user}
          setOpenMenu={setOpenMenu}
          setMessageChannel={setMessageChannel}
        />
      )} */}
    </div>
    // </div >
  )
}

export default VideoCompInfo