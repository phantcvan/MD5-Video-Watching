import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentChannel, setCurrentChannel } from '../slices/channelSlice'
import { useNavigate, useParams } from 'react-router';
import Avatar from '../components/EditInfo/Avatar';
import axios from 'axios';
import Cover from '../components/EditInfo/Cover';
import Name from '../components/EditInfo/Name';
import Description from '../components/EditInfo/Description';
import { ChannelEditType } from '../static/type';


const EditChannelInfo = () => {
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [selectedCover, setSelectedCover] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [desInput, setDesInput] = useState("");
  const [sthChange, setSthChange] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const currentChannel = useSelector(getCurrentChannel);
  const { id: channelCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (currentChannel?.channelCode !== channelCode) {
    navigate('/')
  }

  useEffect(() => {
    if (selectedAvatar || selectedCover || nameInput || desInput) {
      setSthChange(true)
    } else setSthChange(false)
  }, [selectedAvatar, selectedCover, nameInput, desInput])

  // console.log("nameInput", nameInput);

  const handleUpdate = async () => {
    const updateData: ChannelEditType = {
      channelName: currentChannel?.channelName,
      about: currentChannel?.about,
      logoUrl: currentChannel?.logoUrl,
      thumbnailM: currentChannel?.thumbnailM
    };

    if (nameInput) updateData.channelName = nameInput;
    if (desInput) updateData.about = desInput;

    let avatarUrl;
    if (selectedAvatar) {
      const formData = new FormData();
      formData.append('file', selectedAvatar);
      formData.append('upload_preset', 'youtube');
      try {
        const uploadAvatar = await axios.post('https://api.cloudinary.com/v1_1/dbs47qbrd/image/upload', formData);
        avatarUrl = uploadAvatar.data.secure_url;
        updateData.logoUrl = avatarUrl;
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }

    let coverUrl;
    if (selectedCover) {
      const formData = new FormData();
      formData.append('file', selectedCover);
      formData.append('upload_preset', 'youtube');
      try {
        const uploadCover = await axios.post('https://api.cloudinary.com/v1_1/dbs47qbrd/image/upload', formData);
        coverUrl = uploadCover.data.secure_url;
        updateData.thumbnailM = coverUrl;
      } catch (error) {
        console.error('Error uploading cover:', error);
      }
    }

    try {
      const [updateResponse] = await Promise.all([
        axios.patch(`http://localhost:5000/api/v1/channel/updateInfo/${currentChannel?.id}`, updateData),
      ]);
      console.log("updateResponse", updateResponse);
      const newCurrentChannel = currentChannel;
      newCurrentChannel.channelName = updateData.channelName;
      newCurrentChannel.about = updateData.about;
      newCurrentChannel.logoUrl = updateData.logoUrl;
      newCurrentChannel.thumbnailM = updateData.thumbnailM;
      dispatch(setCurrentChannel(newCurrentChannel));
      if (updateResponse.data.status === 200) {
        console.log('Update Channel Successfully');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setSelectedAvatar("");
    setSelectedCover("");
    setNameInput("");
    setDesInput("");
    setCanceled(true);
  }

  return (
    <div className={`w-full min-h-screen h-[calc(100%-53px)] mt-[65px] bg-yt-black flex z-0 flex-col
    sm:px-6 md:px-7 lg:px-8 xl:px-9 mx-16`}>
      <div className='flex justify-between items-center'>
        <span className='text-2xl text-yt-white font-semibold w-2/3'>Channel customization</span>
        <div className='flex flex-1 gap-5'>
          <span className='text-yt-blue cursor-pointer px-2 py-1 text-[15px] font-semibold'>VIEW CHANNEL</span>
          <span className={`px-2 py-1 font-semibold text-[15px]
          ${sthChange ? " text-yt-blue" : "text-yt-light-6"}`}
            onClick={handleCancel}>
            CANCEL
          </span>
          <span className={`px-2 py-1 font-semibold rounded-sm text-[15px] ${sthChange
            ? "bg-yt-blue-2 text-yt-black-1 cursor-pointer" : "text-yt-black bg-yt-light-5"}`}
            onClick={handleUpdate}>
            PUBLISH
          </span>
        </div>
      </div>
      <Avatar setSelectedAvatar={setSelectedAvatar} canceled={canceled} />
      <Cover setSelectedCover={setSelectedCover} canceled={canceled} />
      <Name setNameInput={setNameInput} canceled={canceled} />
      <Description setDesInput={setDesInput} canceled={canceled} />
    </div>
  )
}

export default EditChannelInfo