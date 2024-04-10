import React, { useEffect } from "react";
import _ from "lodash";
import YTSearch from "youtube-api-search";
import SearchBar from "./components/search_bar";
import VideoList from "./components/video_list";
import VideoDetail from "./components/video_detail";
import { Video } from "./utils/types";
import { useSelector, useDispatch } from "react-redux";
import { setVideos, setSelectedVideo } from "./redux/videosSlice";
import { RootState } from "./redux/store";
const API_KEY = "ADD_API_KEY_HERE";

const App: React.FC = () => {
  const dispatch = useDispatch();
  //useSelector gets the current state slice from redux store
  const videos = useSelector((state: RootState) => state.videos.videos);
  const selectedVideo = useSelector(
    (state: RootState) => state.videos.selectedVideo
  );
  //changed search video when the project starts because previous search term (liverpool) loaded a video
  //that was unavailable to stream on other platforms
  useEffect(() => {
    videoSearch(
      "Salah Winner At The Kop End! | Extended HighLights | Liverpooo 2-1 Brighton"
    );
  }, []);

  const videoSearch = (term: string) => {
    YTSearch({ key: API_KEY, term: term }, (videos: Video[]) => {
      console.log("videos", videos);
      //dispatch action to set videos in the redux store
      dispatch(setVideos(videos));

      //dispatch action to set the first video from the setVideos array
      dispatch(setSelectedVideo(videos[0]));
    });
  };

  const videoSearchDebounced = _.debounce((term: string) => {
    videoSearch(term);
  }, 300);

  return (
    <div>
      <SearchBar onSearchTermChange={videoSearchDebounced} />
      <VideoDetail video={selectedVideo} />
      <VideoList
        onVideoSelect={(selectedVideo: Video) =>
          dispatch(setSelectedVideo(selectedVideo))
        }
        videos={videos}
      />
    </div>
  );
};

export default App;
