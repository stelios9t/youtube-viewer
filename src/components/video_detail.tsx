import React, { useEffect, useState, useMemo } from "react";
import { VideoDetailProps } from "../utils/types";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
import userProfile from "../assets/user_profile.jpg";
import "../styles/styles.css";
import SortByButton from "./sortByButton";
//comments interface is being kept in  video_detail component only as it has no relevance outside of this component
//and will not be reused anywhere else in the project
interface Comment {
  id: string;
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        textDisplay: string;
        publishedAt: string;
        authorProfileImageUrl: string;
        likeCount: number;
        dislikeCount: number;
      };
    };
  };
}

const VideoDetail: React.FC<VideoDetailProps> = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortCriteria, setSortCriteria] = useState<"newest" | "top">("newest");
  const [sorting, setSorting] = useState(false);
  const video = useSelector((state: RootState) => state.videos.selectedVideo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState<number | null>(null);
  const API_KEY = "ADD_API_KEY_HERE";
  //function for comment sorting, compares a and b using getTime for newest comments and like Count for top comments
  //retrieves the newest or most liked comment between a and b
  // useMemo to cache the sorting result and prevent uneccesary rendering of the comments section
  const sortedComments = useMemo(() => {
    const commentsCopy = [...comments]; // Create a shallow copy of comments for immutable sorting
    return commentsCopy.sort((a, b) => {
      if (sortCriteria === "newest") {
        return (
          new Date(b.snippet.topLevelComment.snippet.publishedAt).getTime() -
          new Date(a.snippet.topLevelComment.snippet.publishedAt).getTime()
        );
      } else if (sortCriteria === "top") {
        return (
          b.snippet.topLevelComment.snippet.likeCount -
          a.snippet.topLevelComment.snippet.likeCount
        );
      }
      return 0;
    });
  }, [comments, sortCriteria]); // Only re-sort if comments or sortCriteria changes
  useEffect(() => {
    const fetchVideoDetails = async (videoId: string) => {
      setLoading(true);
      setError(null);
      try {
        const commentURL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=70&key=${API_KEY}`;

        const commentResponse = await fetch(commentURL);
        if (!commentResponse.ok) {
          throw new Error(
            `Failed to fetch comments, status code: ${commentResponse.status}`
          );
        }
        const commentData = await commentResponse.json();
        setComments(commentData.items);

        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`
        );
        if (!videoResponse.ok) {
          throw new Error(
            `Failed to fetch video statistics, status code: ${videoResponse.status}`
          );
        }
        const videoData = await videoResponse.json();
        if (videoData.items.length > 0) {
          setCommentCount(videoData.items[0].statistics.commentCount);
        } else {
          throw new Error("Video statistics not found");
        }
      } catch (error) {
        console.error("Error:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (video) {
      fetchVideoDetails(video.id.videoId);
    }
  }, [video, API_KEY]);

  if (!video) return <div>Loading...</div>;
  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>Error loading comments</div>;

  const videoId = video.id.videoId;
  const url = `https://www.youtube.com/embed/${videoId}`;
  //formats numbers such as comment count, like count etc to look better rounding to one decimal place concatenated with M or K
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    } else {
      return num.toString();
    }
  };
  //function to determine how long ago a comment was posted. Subtracts the published date from the current date
  //converts it into seconds (dividing by 1000 as the time difference is in milliseconds) and compares it for years, months days, hours, minutes and seconds

  const getTimeSincePublished = (publishedAt: string): string => {
    const publishedDate = new Date(publishedAt);
    const currentDate = new Date();
    const seconds = Math.floor(
      (currentDate.getTime() - publishedDate.getTime()) / 1000
    );

    let interval = seconds / 31536000; // number of seconds in a year

    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000; // number of seconds in a month
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400; // number of seconds in a day
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600; // number of seconds in an hour
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60; // number of seconds in a minute
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  const handleSortOptionChange = (criteria: "newest" | "top") => {
    setSortCriteria(criteria);
    setSorting(true);
    // Assuming sorting is instantaneous, but for a more smooth user experience
    setTimeout(() => setSorting(false), 500);
  };
  return (
    <div className="video-detail col-md-8">
      <div className="embed-responsive embed-responsive-16by9">
        <iframe
          title={video.snippet.title}
          className="embed-responsive-item"
          src={url}
        />
      </div>
      <div className="details">
        <div>
          <h3>{video.snippet.title}</h3>
        </div>
        <div>{video.snippet.description}</div>
      </div>
      <div className="details-header">
        <h4>
          {commentCount !== null
            ? `${formatNumber(commentCount)} `
            : "(count not available)"}
          Comments
        </h4>
        <div>
          <SortByButton onChange={handleSortOptionChange} />
        </div>
      </div>
      <div>
        <div className="comments-container">
          {sorting && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
          {sorting && (
            <div className="loading-overlay">Sorting comments...</div>
          )}
          {sortedComments.map((item, index) => (
            <div key={index} className="comment">
              <img
                src={
                  item.snippet.topLevelComment.snippet.authorProfileImageUrl ||
                  userProfile
                }
                onError={(e) => (e.currentTarget.src = userProfile)}
                alt="user profile"
              />
              <div>
                <h3 className="author">
                  {item.snippet.topLevelComment.snippet.authorDisplayName}
                  <span>
                    {getTimeSincePublished(
                      item.snippet.topLevelComment.snippet.publishedAt
                    )}
                  </span>
                </h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>

                <div className="commentButtons">
                  <img src={like} alt="like" />
                  <span>
                    {formatNumber(
                      item.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                  <img src={dislike} alt="dislike" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoDetail;
