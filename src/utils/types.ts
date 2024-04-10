export interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

export interface VideoListProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
}

export interface VideoListItemProps {
  video: Video;
  onVideoSelect: (video: Video) => void;
}

export interface VideoDetailProps {
  video: Video | null;
}

export interface SearchBarProps {
  onSearchTermChange: (term: string) => void;
}
