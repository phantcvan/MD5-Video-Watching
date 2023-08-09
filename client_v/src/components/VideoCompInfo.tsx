import React, { useEffect, useState } from 'react';
import { VideoType } from '../static/type';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentWidth } from '../slices/appSlice';
import { handleNumber } from "../static/fn";
import moment from "moment";
import { MdVerified } from 'react-icons/md';
import { Button, Modal, Tooltip, notification } from 'antd';
import { BsThreeDotsVertical } from 'react-icons/bs';
import axios from 'axios';
import '../index.css'

interface VideoComp {
  video: VideoType,
  home: boolean,
  description: boolean,
  editable: boolean,
  setEdited: React.Dispatch<React.SetStateAction<boolean>>
}
const VideoCompInfo = ({ video, home, description, editable, setEdited }: VideoComp) => {
  const [edit, setEdit] = useState(-1);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    else titleMaxLength = 48
  }
  // const titleMaxLength = curWid <= 480 ? "30" : curWid <= 1024 ? "48" : "70";
  // thiết lập độ dài channel Name
  const channelMaxLength = curWid <= 480 ? "18" : curWid <= 1024 ? "35" : "70";
  const handleDeleteVideo = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/videos/${video?.id}`)
      notification.success({
        message: "Video deleted successfully",
        style: {
          top: 95,
          zIndex: 50
        },
        duration: 2,
      });
      setEdited(pre => !pre)
    } catch (error) {
      console.log(error);
    }
  }
  const handleCancel = () => {
    setIsModalVisible(false);
  }

  const handleCopy = () => {
    // setMessage("Link copied to clipboard");
    navigator.clipboard.writeText(`${video?.videoCode}`)
      .then(() => {
        notification.success({
          message: "Link copied to clipboard",
          style: {
            top: 95,
            zIndex: 50
          },
          duration: 2,
        });
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
      });
  };
  // console.log("openMenu", openMenu, openMenu === video?.id);
  const dropdownContent = (
    <div className="rounded-md text-yt-gray flex flex-col gap-2">
      <span
        className="hover:text-yt-white cursor-pointer text-[15px] px-1"
        onClick={() => { setEdit(video?.id) }}
      >
        Edit video
      </span>
      <span
        className="hover:text-yt-white cursor-pointer text-[15px] px-1"
        onClick={() => setIsModalVisible(true)}
      >
        Delete video
      </span>
      <Modal
        title={<span className='font-semibold text-lg'>Delete forever</span>}
        visible={isModalVisible}
        onOk={handleDeleteVideo}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel} className='cancel-button'>
            Cancel
          </Button>,
          <Button key="ok"
            className="ok-button"
            onClick={handleDeleteVideo}>
            Delete forever
          </Button>,
        ]}
      >
        <div className='flex flex-col gap-1'>
          <p className=''>Are you sure you want to delete this video?
          </p>
          <p>Deleting is permanent and can't be undone.</p>
        </div>
      </Modal>
      <span
        className="hover:text-yt-white cursor-pointer text-[15px] px-1"
        onClick={handleCopy}
      >
        Share video
      </span>
    </div>
  );

  return (
    <div className="ml-2 flex justify-between items-start gap-2 w-full mt-2">
      <div className="flex basis-[90%] flex-col mt-2">
        <div className='flex flex-row gap-2 items-center'>
          {home && <Link to={`/channel/${video?.channel?.channelCode}`}>
            <div className={`flex h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 xl:h-9 xl:w-9 rounded-full overflow-hidden`}>
              <Tooltip placement="bottom" title={video?.channel?.channelName} color='#3F3F3F' arrow={false}>
                <img
                  src={video?.channel?.logoUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </Tooltip>
            </div>
          </Link>}
          <Link to={`/video/${video?.videoCode}`}>
            <h2
              className={`font-medium text-yt-light-black mt-0 mb-0 items-center text-justify text-[15px]`}
            >
              <Tooltip placement="topLeft" title={video?.title} color='#3F3F3F'>
                <span className='text-yt-white'>
                  {video?.title?.length <= Number(titleMaxLength)
                    ? video?.title
                    : `${video?.title.substr(0, Number(titleMaxLength))}...`}
                </span>
              </Tooltip>
            </h2>
          </Link>
        </div>
        {/* {channelDisplay && ( */}
        <div className={`${home && "ml-8 md:ml-9 lg:ml-10 xl:ml-11"}`}>
          <Link to={`/channel/${video?.channel?.channelCode}`}>
            <Tooltip placement="bottomLeft" title={video?.channel?.channelName} color='#3F3F3F' arrow={false}>
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
            </Tooltip>
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
      {editable && (
        // <div className="relative flex basis-[10%] justify-end">
        <Tooltip placement="bottomLeft" title={dropdownContent} color='#3F3F3F' arrow={false}>
          <span
            className="hover:rounded-full hover:bg-yt-light-2 p-2 w-8 h-8 flex items-center text-yt-white"
          // onClick={() => handleOpen(video?.id)}
          >
            <BsThreeDotsVertical size={18} />
          </span>
        </Tooltip>
        // </div>
      )}
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
    </div >
    // </div >
  )
}

export default VideoCompInfo