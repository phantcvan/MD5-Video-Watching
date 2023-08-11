import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllChannels, setCurrentChannel } from "../slices/channelSlice";
import { ChannelType } from "./type";
import { v4 as uuidv4 } from 'uuid';
import { getCurrentDate } from "./fn";

const allChannels = useSelector(getAllChannels);
const dispatch = useDispatch();

export const handleAddChannel = async (user: any) => {
  try {
    const findChannelIndex = allChannels?.findIndex(
      ((e: ChannelType) => e.email == user?.email
      ));
    // console.log("findChannelIndex", findChannelIndex);


    if (findChannelIndex === -1) {

      const formattedDate = getCurrentDate();
      const newCode = uuidv4()
      const newChannel = {
        email: user?.email,
        logoUrl: user?.photoURL,
        channelName: user?.displayName,
        joinDate: formattedDate,
        thumbnailM: null,
        channelCode: newCode,
        recordHistory: 1
      };
      console.log("newChannel", newChannel);
      const [channelResponse, authResponse] = await Promise.all([
        axios.post("http://localhost:5000/api/v1/channel", newChannel),
        axios.post(`http://localhost:5000/api/v1/auth/signUp`, newChannel),
      ]);
      // console.log("authResponse 1", authResponse);

      const randomId = Math.floor(Math.random() * 10000000);
      const newChannelWithId = Object.assign({}, newChannel, {
        id: randomId,
      });
      dispatch(setCurrentChannel(newChannelWithId))
    } else {
      const channelNow = allChannels?.filter((channel: ChannelType) => channel?.email === user?.email)
      console.log("channelNow", channelNow);
      dispatch(setCurrentChannel(channelNow[0]))
      try {
        const [authResponse] = await Promise.all([
          axios.post(`http://localhost:5000/api/v1/auth/signIn`, channelNow[0]),
        ]);
        // console.log("authResponse 2", authResponse?.data?.access_token);
        const jwtToken = authResponse?.data?.access_token;
        const expiresInDays = 7; // Số ngày tồn tại của cookies
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expiresInDays);
        const cookieString = `access_token=${jwtToken}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
        document.cookie = cookieString;
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
};
