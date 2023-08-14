import { useEffect, useState } from "react";
import upload1 from "../../assets/upload-step1-rm.png";
import upload2 from "../../assets/upload-step1-done.png";
import uploadGIF from "../../assets/uploading.gif";
import { notification } from "antd";
import { IoWarningOutline } from "react-icons/io5";
import axios from "axios";

interface Step1Prop {
  setVideoUrl: React.Dispatch<React.SetStateAction<string>>,
  setStep: React.Dispatch<React.SetStateAction<number>>,

}

const UploadStep1 = ({ setVideoUrl, setStep }: Step1Prop) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [imageSrc, setImageSrc] = useState(uploadGIF);
  const [message, setMessage] = useState("");


  const handleInputChange = async (event: any) => {
    const videoFileArr = event.target.files[0].name.split(".");
    const typeOfVideo = videoFileArr[videoFileArr.length - 1].toLowerCase();
    if (
      typeOfVideo === "mp4" ||
      typeOfVideo === "avi" ||
      typeOfVideo === "mkv"
    ) {
      setSelectedVideo(event.target.files[0]);
      setMessage('');
      // upload Video
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      formData.append('upload_preset', 'youtube');
      try {
        const uploadVideo = await axios.post('https://api.cloudinary.com/v1_1/dbs47qbrd/video/upload', formData);
        setVideoUrl(uploadVideo.data.secure_url);
        setImageSrc(upload2);
        console.log("upload2", uploadVideo.data.secure_url);

        setStep(2);
      } catch (error) {
        console.error('Error uploading cover:', error);
      }
    } else {
      setMessage("Please select a video in MP4, AVI or MKV format.");
      setSelectedVideo(null);
    }
  };
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setImageSrc(upload2);
  //   }, 4300);
  //   return () => clearTimeout(timeout);
  // }, [selectedVideo]);
  return (
    <div>
      <div className="flex flex-col items-center max-h-full">
        <div className="flex items-center w-full justify-center">
          <div
            className={`w-44 h-44 flex items-center justify-center`}
          >
            {selectedVideo ? (
              <img src={imageSrc} alt="" className="w-44 h-44 mb-3" />
            ) : (
              <img src={upload1} alt="" className="w-44 h-44 mb-2" />
            )}
          </div>
        </div>
        <p className="text-center mt-3 text-md">
          Your videos will be private until you publish them.
        </p>
      </div>
      {message
        ? <div className="w-full flex justify-center gap-2 mt-14">
          <span className="text-yt-red"><IoWarningOutline size={21} /></span>
          <span className="text-yt-light-5">{message}</span>
        </div>
        : <div className="w-full flex justify-center mt-14"><span className="py-3">  </span>
        </div>}
      <div className="border-solid border-1 px-2 bg-transparent border-inherit flex flex-col items-center
      my-3">
        <label htmlFor="uploadVideo"
          className="flex cursor-pointer bg-yt-blue text-yt-black p-2 rounded-md font-semibold">
          SELECT FILE
        </label>
        <input
          type="file" id='uploadVideo'
          name="uploadVideo"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
      <div>
        <p className="text-[13px] text-center my-1">
          By submitting your videos to YouTube, you acknowledge that you
          agree to YouTube's
          <span className="text-[#1967D2]"> Terms of Service </span>
          and
          <span className="text-[#1967D2]"> Community Guidelines</span>.
        </p>
        <p className="text-[13px] text-center">
          Please be sure not to violate others' copyright or privacy
          rights.
          <span className="text-[#1967D2]"> Learn more </span>
        </p>

      </div>
    </div>
  )
}

export default UploadStep1