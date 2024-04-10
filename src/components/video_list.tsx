import React from "react";
import VideoListItem from "./video_list_item";
import { VideoListProps } from "../utils/types";

const VideoList: React.FC<VideoListProps> = ({ videos, onVideoSelect }) => {
  const videoItems = videos.map((video) => {
    return (
      <VideoListItem
        key={video.id.videoId}
        video={video}
        onVideoSelect={onVideoSelect}
      />
    );
  });

  return <ul className="col-md-4 list-group">{videoItems}</ul>;
};

export default VideoList;
