import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Video } from "../utils/types";

interface VideosState {
  videos: Video[];
  selectedVideo: Video | null;
}
//initial state of videos in redux store
const initialState: VideosState = {
  videos: [], //no videos are loaded
  selectedVideo: null, //no video is selected
};

export const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    //action for videoSlice, sets the list of videos. Payload is an array of Video Objects
    setVideos: (state, action: PayloadAction<Video[]>) => {
      state.videos = action.payload;
    },
    //action that sets the currently selected video. Payload is a Video object or null
    setSelectedVideo: (state, action: PayloadAction<Video | null>) => {
      state.selectedVideo = action.payload;
    },
  },
});

export const { setVideos, setSelectedVideo } = videosSlice.actions;

export default videosSlice.reducer;
