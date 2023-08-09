import { useSelector } from "react-redux";
import { getCurrentChannel } from "../../slices/channelSlice";
import { notification } from "antd";
import { useEffect, useState } from "react";

interface CoverProp {
  setSelectedCover: React.Dispatch<React.SetStateAction<string>>,
  canceled: boolean
}
const Cover = ({ setSelectedCover, canceled }: CoverProp) => {
  const currentChannel = useSelector(getCurrentChannel);
  const [previewCover, setPreviewCover] = useState("");
  useEffect(() => {
    if (canceled) {
      setPreviewCover(currentChannel?.thumbnailM)
    }
  }, [canceled])

  const handleAddCover = (event: any) => {
    const mediaFileArr = event.target.files[0].name.split('.');
    console.log(event.target.files[0].size);

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
      setSelectedCover(event.target.files[0]);
      // xem trước media
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (event: any) {
        setPreviewCover(event.target.result);
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
      <span className="text-yt-white font-semibold">Banner image</span>
      <span className="text-yt-light-5 my-2">
        This image will appear across the top of your channel
      </span>
      <div className="flex gap-5 mt-3">
        <div className="flex relative h-[160px] w-1/3 bg-yt-light-black justify-center">
          <div className="absolute top-[10px] w-[93%] h-[140px] rounded-full flex items-center">
            {previewCover
              ? <img src={previewCover}
                className="w-full p-2 overflow-hidden object-cover" />
              : currentChannel?.thumbnailM
                ? <img src={currentChannel?.thumbnailM}
                  className="w-full p-2 overflow-hidden object-cover" />
                : <img src="https://theoheartist.com/wp-content/uploads/sites/2/2015/01/fbdefault.png"
                  className="w-full p-2 overflow-hidden object-cover" />}

          </div>
        </div>
        <div className="flex flex-1 flex-col ml-5">
          <span className="text-yt-light-5">
            For the best results on all devices, use an image that’s at least 2048 x 1152 pixels and 6MB or less.
          </span>
          <div className="flex my-4">
            <label htmlFor="uploadCover"
              className="flex cursor-pointer text-yt-blue">
              CHANGE
            </label>
            <input type="file" name="uploadCover" id="uploadCover"
              className="hidden" onChange={handleAddCover} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cover