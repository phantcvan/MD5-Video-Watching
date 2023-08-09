import { useSelector } from "react-redux";
import { getCurrentChannel } from "../../slices/channelSlice";
import { notification } from "antd";
import { useEffect, useState } from "react";

interface AvatarProp {
  setSelectedAvatar: React.Dispatch<React.SetStateAction<string>>,
  canceled: boolean
}
const Avatar = ({ setSelectedAvatar, canceled }: AvatarProp) => {
  const currentChannel = useSelector(getCurrentChannel);
  const [previewSrc, setPreviewSrc] = useState("");
  useEffect(() => {
    if (canceled) {
      setPreviewSrc(currentChannel?.logoUrl)
    }
  }, [canceled])
  const handleAddMedia = (event: any) => {
    const mediaFileArr = event.target.files[0].name.split('.');
    // console.log(event.target.files[0].size);

    const typeOfMedia = mediaFileArr[mediaFileArr.length - 1].toLowerCase();
    if (event.target.files[0].size > 4194304) {
      notification.warning({
        message: "Please choose a picture that's 4MB or less.",
        style: {
          top: 5,
        },
      });
      return;
    }
    if (typeOfMedia === "png" || typeOfMedia === 'jpg' || typeOfMedia === 'jpeg' || typeOfMedia === 'bmp' || typeOfMedia === 'gif') {
      setSelectedAvatar(event.target.files[0]);
      // xem trước media
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (event: any) {
        setPreviewSrc(event.target.result);
      };
      reader.readAsDataURL(file);

    } else {
      notification.warning({
        message: "Please choose a picture",
        style: {
          top: 5,
        },
      });
      return;
    }
  };

  return (
    <div className="flex flex-col my-3">
      <span className="text-yt-white font-semibold">Picture</span>
      <span className="text-yt-light-5 my-2">
        Your profile picture will appear where your channel is presented on YouTube, like next to your videos and comments
      </span>
      <div className="flex gap-5 mt-3">
        <div className="flex relative h-[160px] w-1/3 bg-yt-light-black justify-center">
          <div className="absolute top-[10px] w-[140px] h-[140px] rounded-full">
            {previewSrc
              ? <img src={previewSrc}
                className="w-[140px] h-[140px] rounded-full overflow-hidden object-cover" />
              : <img src={currentChannel?.logoUrl}
                className="w-[140px] h-[140px] rounded-full overflow-hidden object-cover" />}

          </div>
        </div>
        <div className="flex flex-1 flex-col ml-5">
          <span className="text-yt-light-5">
            It’s recommended to use a picture that’s at least 98 x 98 pixels and 4MB or less.
          </span>
          <span className="text-yt-light-5">
            Make sure your picture follows the YouTube Community Guidelines.
          </span>
          <div className="flex my-4">
            <label htmlFor="uploadMedia"
              className="flex cursor-pointer text-yt-blue">
              CHANGE
            </label>
            <input type="file" name="uploadMedia" id="uploadMedia"
              className="hidden" onChange={handleAddMedia} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Avatar