import axios from "axios";
import { useState } from "react";
import { BiSolidImage } from "react-icons/bi";

interface ThumbnailProp {
  imgURL: string,
  setImgURL: React.Dispatch<React.SetStateAction<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  selectInput: number
}
const Thumbnail = ({ imgURL, setImgURL, setMessage, selectInput }: ThumbnailProp) => {

  const [selectedImg, setSelectedImg] = useState("");


  const handleImgChange = async (event: any) => {
    const ImgFileArr = event.target.files[0].name.split(".");
    const typeOfImg = ImgFileArr[ImgFileArr.length - 1].toLowerCase();
    if (
      typeOfImg === "png" ||
      typeOfImg === "jpg" ||
      typeOfImg === "jpeg" ||
      typeOfImg === "bmp"
    ) {
      setSelectedImg(event.target.files[0]);
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      formData.append('upload_preset', 'youtube');
      try {
        const uploadImg = await axios.post('https://api.cloudinary.com/v1_1/dbs47qbrd/image/upload', formData);
        setImgURL(uploadImg.data.secure_url);
        setMessage("");
      } catch (error) {
        console.error('Error uploading cover:', error);
      }

    } else {
      console.log(typeOfImg);
      setMessage("Please select a image in PNG, JPG, JPEG or BMP format.");
      setSelectedImg("");
    }
  };
  return (
    <div className={`bg-yt-light-2 flex flex-col text-yt-gray rounded-sm py-1 px-2 w-full my-2`}>
      <label
        className={`text-yt-white text-lg font-medium`}
      >
        Thumbnail
      </label>
      <div className="flex justify-start gap-3">
        <span className="my-1">
          Select or upload a picture that shows what's in your
          video. A good thumbnail stands out and draws viewers'
          attention.
        </span>
        {selectedImg
          ? (
            <img
              src={imgURL}
              alt="Selected Thumbnail"
              className="w-52 aspect-video overflow-hidden object-cover"
            />
          ) : <div className="w-52">
            <label htmlFor="thumbnail"
              className={`flex flex-col cursor-pointer items-center gap-2 text-yt-light-4 p-2 rounded-md
              border border-dashed text-sm ${selectInput === 3 ? 'border-[#3EA6FF]' : 'border-yt-light-6 hover:border-yt-light-5'}`}>
              <span><BiSolidImage size={24} /></span>
              <span>Upload thumbnail</span>
            </label>
            <input
              type="file"
              name="thumbnail" id="thumbnail"
              required
              // value={selectedImg}
              className="hidden"
              onChange={handleImgChange}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default Thumbnail