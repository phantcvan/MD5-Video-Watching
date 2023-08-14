import axios from "axios";
import { useEffect, useState } from "react";
import { BiSolidImage } from "react-icons/bi";

interface ThumbnailProp {
  imgURL: string,
  setImgURL: React.Dispatch<React.SetStateAction<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  selectInput: number,
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>
}
const Thumbnail = ({ imgURL, setImgURL, setMessage, selectInput, setIsChange }: ThumbnailProp) => {
  const [selectedImg, setSelectedImg] = useState("");
  const loadingGif = 'https://firebasestorage.googleapis.com/v0/b/ss11-514db.appspot.com/o/images%2Fuploading_Thumb.gif?alt=media&token=d0df8884-4442-4e04-b598-54be5cec8248'
  useEffect(() => {
    if (imgURL !== loadingGif) {
      setSelectedImg(imgURL)
    }
  }, [imgURL])


  const handleImgChange = async (event: any) => {
    setImgURL(loadingGif)
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
      setIsChange(true)
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
          ? <div className="relative w-52 flex items-center justify-center">
            <div className="absolute top-0 bg-overlay-70 z-30 w-full aspect-video">
              <label htmlFor="thumbnail"
                className={`flex flex-col cursor-pointer items-center gap-2 text-yt-light-4 p-2 rounded-md
        text-sm `}>
                <span><BiSolidImage size={24} /></span>
                <span>Change thumbnail</span>
              </label>
              <input
                type="file"
                name="thumbnail" id="thumbnail"
                required
                className="hidden"
                onChange={handleImgChange}
              />
            </div>
            <img
              src={imgURL}
              alt="Selected Thumbnail"
              className="w-52 aspect-video overflow-hidden object-cover z-20"
            />
          </div>
          : <div className="w-52">
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
          </div>}
        {/* 
        {selectedImg
          ? (
            <img
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              src={imgURL}
              alt="Selected Thumbnail"
              className="w-52 aspect-video overflow-hidden object-cover"
            />
          ) :
          (imgURL !== loadingGif || isHover)
            ? <div className="relative w-52 flex items-center justify-center">
              <div className="absolute top-0 bg-overlay-70 z-30 w-full aspect-video">
                <label htmlFor="thumbnail"
                  className={`flex flex-col cursor-pointer items-center gap-2 text-yt-light-4 p-2 rounded-md
            text-sm `}>
                  <span><BiSolidImage size={24} /></span>
                  <span>Change thumbnail</span>
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
              <img
                src={imgURL}
                alt="Selected Thumbnail"
                className="w-52 aspect-video overflow-hidden object-cover z-20"
              />
            </div>
            : <div className="w-52">
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
        } */}
      </div>
    </div>
  )
}

export default Thumbnail