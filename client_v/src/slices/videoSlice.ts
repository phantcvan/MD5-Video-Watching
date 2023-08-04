// videoSlice.js

import { createSlice } from '@reduxjs/toolkit';

interface Video {
  id: number;
  videoUrl: string;
  title: string;
  description: string;
  thumbnail: string;
  upload_date: string;
  channelId: number;
  videoCode: string;
  views: number;
}
interface Tag {
  id: number;
  tag: string;
  videoId: number;
}
interface VideoState {
  videos: Video[];
  newVideo: string;
  tags: Tag[];
  searchQuery: string;
  searchMessage: string;
}
const initialState: VideoState = {
  videos: [],
  newVideo: "", //video_id
  tags: [],
  searchQuery: '',
  searchMessage: '',
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload;
    },
    setNewVideo: (state, action) => {
      state.newVideo = action.payload;
    },
    setAllTags: (state, action) => {
      state.tags = action.payload;
    },
    incrementView: (state, action) => {
      const videoId = action.payload;
      state.videos = state.videos.map((video) => {
        if (video.id === videoId) {
          return {
            ...video,
            views: video.views + 1,
          };
        }
        return video;
      });
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchMessage: (state, action) => {
      state.searchMessage = action.payload;
    },
  },
});

export const { setVideos, setNewVideo, incrementView, setSearchQuery, setSearchMessage, setAllTags } = videoSlice.actions;
export const getVideos = (state: any) => state.video.videos;
export const getNewVideo = (state: any) => state.video.newVideo;
export const getAllTags = (state: any) => state.video.tags;
export const getSearchQuery = (state: any) => state.video.searchQuery;
export const getSearchMessage = (state: any) => state.video.searchMessage;

export default videoSlice.reducer;