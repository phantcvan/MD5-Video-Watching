import { createSlice } from "@reduxjs/toolkit";
import { ChannelType } from "../static/type";


interface ChannelState {
  channels: ChannelType[];
  currentChannel: ChannelType | null;
  channelsSub: ChannelType[];
}

const initialState: ChannelState = {
  channels: [],
  channelsSub: [],
  currentChannel: null
};


const channelsSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setAllChannels: (state, action) => {
      state.channels = action.payload;
    },
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    setChannelsSub: (state, action) => {
      state.channelsSub = action.payload;
    },
  },
});

export const { setAllChannels, setCurrentChannel, setChannelsSub } = channelsSlice.actions;

export const getAllChannels = (state: any) => state.channel.channels;
export const getCurrentChannel = (state: any) => state.channel.currentChannel;
export const getChannelsSub = (state: any) => state.channel.channelsSub;

export default channelsSlice.reducer;