import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import Title from '../Upload/Title';
import axios from 'axios';
import { AllTags, VideoType } from '../../static/type';
import Description from '../Upload/Description';
import Thumbnail from '../Upload/Thumbnail';
import Tag from '../Upload/Tag';
import { notification } from 'antd';


interface EditProp {
  setEdit: React.Dispatch<React.SetStateAction<number>>,
  videoId: number,
  setEdited: React.Dispatch<React.SetStateAction<boolean>>
}

const EditVideo = ({ setEdit, videoId, setEdited }: EditProp) => {
  const [videoEdit, setVideoEdit] = useState<VideoType | null>(null);
  const [selectInput, setSelectInput] = useState(1);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isChange, setIsChange] = useState(false);
  let jwt = "";
  const allCookies = document.cookie;

  console.log("Video", title, description, imgURL, tags);
  // Load dữ liệu cũ
  const fetchVideoOldData = async () => {
    try {
      const [videoResponse, tagsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/videos/byId/${videoId}`),
        axios.get(`http://localhost:5000/api/v1/tag/tagForVideo/${videoId}`),
      ])
      if (tagsResponse?.data?.length > 0) {
        const oldTags = tagsResponse?.data?.map((tag: AllTags) => tag.tag)
        setTags(oldTags);
      }
      setVideoEdit(videoResponse?.data);
      setTitle(videoResponse?.data?.title || "");
      setDescription(videoResponse?.data?.description || "");
      setImgURL(videoResponse?.data?.thumbnail || "")
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchVideoOldData();

  }, [videoId])
  // Update dữ liệu mới
  const handleUpdate = async () => {
    if (isChange) {
      try {
        // Lấy JWT từ cookies
        const cookieArray = allCookies.split(';');
        console.log("cookieArray", cookieArray);
        for (const cookie of cookieArray) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'access_token') {
            jwt = value;
            break;
          }
        }
        console.log("JWT in useEffect", jwt);
        const newVideoDetail = {
          id: videoEdit?.id,
          videoUrl: videoEdit?.videoUrl,
          title,
          description,
          thumbnail: imgURL,
          upload_date: videoEdit?.upload_date,
          videoCode: videoEdit?.videoCode,
          views: videoEdit?.views,
          channel: videoEdit?.channel
        }
        console.log("newVideoDetails", newVideoDetail);
        console.log("jwt", jwt);

        const videoResponse = await axios.put(`http://localhost:5000/api/v1/videos/edit-detail/${videoEdit?.id}`, newVideoDetail, {
          headers: {
            "Authorization": "Bearer " + jwt,
          }
        })
        console.log("videoResponse", videoResponse);
        if (tags.length > 0) {
          try {
            await axios.delete(`http://localhost:5000/api/v1/tag/${videoEdit?.id}`, {
              headers: {
                "Authorization": "Bearer " + jwt,
              }
            });
            for (const tag of tags) {
              console.log("tag", tag);
              await axios.put(`http://localhost:5000/api/v1/tag/${videoEdit?.id}`, { tag }, {
                headers: {
                  "Authorization": "Bearer " + jwt,
                }
              });
            }
          } catch (error) {
            console.log(error);
          }
        }
        if (videoResponse.status === 200) {
          notification.success({
            message: "Video Detail updated successfully",
            style: {
              top: 95,
              zIndex: 50
            },
            duration: 2,
          });
          setEdited(pre => !pre)
        }
      } catch (error) {
        console.log(error);

      }
    }
  }

  return (
    <div className="w-[100%] absolute top-80 left-0 bg-overlay-40 flex items-center 
  justify-center z-20">
      <div className="w-[100%] h-[100%] fixed top-0 left-0 bg-overlay-40 flex items-center 
    justify-center z-[21]" onClick={() => setEdit(-1)}>
      </div>
      <div className="wrap_img w-[800px] h-[500px] bg-yt-light-2 text-yt-white px-5 pt-4 flex flex-col gap-5 
      fixed rounded-md z-[25]">
        <div className="absolute top-5 right-5 cursor-pointer " onClick={() => setEdit(-1)}>
          <AiOutlineClose />
        </div>
        <span className="text-center text-2xl font-semibold mt-2">Edit video details</span>
        <div className='gap-[2px] flex flex-col overflow-y-auto mb-2 px-5'>
          <Title setSelectInput={setSelectInput} selectInput={selectInput} setTitle={setTitle}
            title={title} setMessage={setMessage} setIsChange={setIsChange} />
          <Description setDescription={setDescription} selectInput={selectInput} setSelectInput={setSelectInput}
            setMessage={setMessage} description={description} setIsChange={setIsChange} />
          <Thumbnail imgURL={imgURL} setImgURL={setImgURL} setMessage={setMessage} selectInput={selectInput}
            setIsChange={setIsChange} />
          <Tag setTags={setTags} selectInput={selectInput} setSelectInput={setSelectInput} tags={tags}
            setMessage={setMessage} setIsChange={setIsChange} title={title}/>
        </div>
        <button className={`py-2  px-5 rounded-sm text-yt-black font-medium mb-3 w-60 m-auto
      ${isChange ? "bg-[#3EA6FF]" : "bg-yt-light-5 cursor-not-allowed"}`}
          onClick={handleUpdate}>
          UPDATE
        </button>
      </div>
    </div>
  )
}

export default EditVideo