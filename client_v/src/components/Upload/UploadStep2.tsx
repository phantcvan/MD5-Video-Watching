import { useState } from "react";
import "../../index.css"
import Title from "./Title";
import Description from "./Description";
import Thumbnail from "./Thumbnail";
import Tag from "./Tag";
import { IoWarningOutline } from "react-icons/io5";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate } from "../../static/fn";
import { useSelector } from "react-redux";
import { getCurrentChannel } from "../../slices/channelSlice";
import { useNavigate } from "react-router";
import { notification } from "antd";

interface Step2Prop {
  videoUrl: string,
  setOpenUpload: React.Dispatch<React.SetStateAction<boolean>>
}
const UploadStep2 = ({ videoUrl, setOpenUpload }: Step2Prop) => {
  // console.log(videoUrl);
  const [selectInput, setSelectInput] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [fullInfo, setFullInfo] = useState(false);
  const loadingGif = 'https://res.cloudinary.com/dbs47qbrd/image/upload/v1691744913/uploading_Thumb_nyyc19.gif'
  const [imgURL, setImgURL] = useState(loadingGif);
  const currentChannel = useSelector(getCurrentChannel);
  const navigate = useNavigate()
  console.log("newVideo", title, description, imgURL, videoUrl, tags);

  const handleUpload = async () => {
    if (!title || !description || (imgURL === loadingGif)) {
      setMessage("Please fill out all information");
    }
    if (!title) {
      setSelectInput(1)
    } else if (!description) {
      setSelectInput(2)
    } else if (imgURL === loadingGif) {
      setSelectInput(3)
    } else {
      setFullInfo(true);
      const videoCode = uuidv4();
      const upload_date = getCurrentDate()
      const views = 0
      const newVideo = {
        videoCode,
        videoUrl,
        views,
        title,
        description,
        thumbnail: imgURL,
        upload_date,
        channelId: currentChannel?.id
      }
      try {
        const [videoResponse] = await Promise.all([
          axios.post(`http://localhost:5000/api/v1/videos`, newVideo),
        ])
        if (videoResponse?.status === 201) {
          if (tags.length > 0) {
            try {
              for (const tag of tags) {
                await axios.post(`http://localhost:5000/api/v1/tag`, {
                  tag: tag,
                  videoCode
                });
              }
            } catch (error) {
              console.log(error);
            }
          }
          notification.success({
            message: "Video uploaded successfully",
            style: {
              top: 95,
              zIndex: 50
            },
            duration: 2,
          });
          setOpenUpload(false)
          navigate(`/channel/${currentChannel?.channelCode}`)
        }
      } catch (error) {
        console.log(error);
      }

    }
  }
  return (
    <div className="overflow-y-auto mb-2 px-5 flex flex-col gap-1">
      <Title setSelectInput={setSelectInput} selectInput={selectInput} setTitle={setTitle}
        setMessage={setMessage} />
      <Description setDescription={setDescription} selectInput={selectInput} setSelectInput={setSelectInput}
        setMessage={setMessage} />
      <Thumbnail imgURL={imgURL} setImgURL={setImgURL} setMessage={setMessage} selectInput={selectInput} />
      <Tag setTags={setTags} selectInput={selectInput} setSelectInput={setSelectInput} tags={tags}
        setMessage={setMessage} />
      {message
        ? <div className="w-full flex justify-center gap-2">
          <span className="text-yt-red"><IoWarningOutline size={21} /></span>
          <span className="text-yt-light-5">{message}</span>
        </div>
        : <div className="w-full flex justify-center"><span className="py-3">  </span>
        </div>}
      <button className={`py-2  px-5 rounded-sm text-yt-black font-medium mb-2 w-60 m-auto
      ${fullInfo ? "bg-[#3EA6FF]" : "bg-yt-light-5 cursor-not-allowed"}`}
        onClick={handleUpload}>
        SAVE
      </button>

    </div>
  )
}

export default UploadStep2