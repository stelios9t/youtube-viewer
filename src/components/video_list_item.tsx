import React from "react";
import { VideoListItemProps } from "../utils/types";

const VideoListItem: React.FC<VideoListItemProps> = ({
  video,
  onVideoSelect,
}) => {
  const imageUrl = video.snippet.thumbnails.default.url;

  return (
    <li onClick={() => onVideoSelect(video)} className="list-group-item">
      <div className="video-list media">
        <div className="media-left">
          <img className="media-object" alt="video thumbnail" src={imageUrl} />
        </div>
        <div className="media-body">
          <div className="media-heading">{video.snippet.title}</div>
        </div>
      </div>
    </li>
  );
};

export default VideoListItem;
