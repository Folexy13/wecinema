import React, { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import { MdChat, MdPlayArrow, MdUpload, MdVerifiedUser } from "react-icons/md";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from "react-icons/ai";
import { formatDateAgo, isUserIdInArray } from "../../utilities/helperfFunction";
import { getRequest, postRequest, putRequest } from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import axios from 'axios';

const VideoPlayer: React.FC<any> = ({ video, tokenData }) => {
  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [commentData, setCommentData] = useState<any>(video?.comments ?? []);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  let [videoLikesLength, setVideoLikesLength] = useState(video?.likes?.length ?? 0);
  let [videoDislikesLength, setVideoDislikesLength] = useState(video?.dislikes?.length ?? 0);
  const [views, setViews] = useState(0); // State for video views
  const [userHasPaid, setUserHasPaid] = useState(false);
  const [currentUserHasPaid, setCurrentUserHasPaid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: any = await getRequest("/video/" + video._id, setLoading);
        setCommentData(result.comments);

        const viewsResult: any = await getRequest(`/video/views/${video._id}`, setLoading);
        setViews(viewsResult.views);

        const response = await axios.get(`http://localhost:3000/user/payment-status/${video.author._id}`);
        setUserHasPaid(response.data.hasPaid);

        if (tokenData) {
          const currentUserResponse = await axios.get(`http://localhost:3000/user/payment-status/${tokenData.userId}`);
          setCurrentUserHasPaid(currentUserResponse.data.hasPaid);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [loading, video._id, video.author._id, tokenData]);

  useEffect(() => {
    if (!userHasPaid && currentUserHasPaid) {
      setShowModal(true);
    }
  }, [userHasPaid, currentUserHasPaid]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  const handleLikeClick = async () => {
    try {
      setLoading(true);
      setIsLiked(!isLiked);
      setIsDisliked(false);
      // let payload = {
      //   action: "like",
      //   userId: tokenData?.userId,
      // };
      // const result: any = await putRequest(
      //   "video/" + video._id,
      //   payload,
      //   setLoading,
      //   "Video Liked!"
      // );
      setVideoLikesLength(isLiked ? videoLikesLength - 1 : videoLikesLength + 1);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
      console.error("Post error:", error);
    }
  };

  const handleDislikeClick = async () => {
    try {
      setLoading(true);
      setIsDisliked(!isDisliked);
      setIsLiked(false);
      // let payload = {
      //   action: "dislike",
      //   userId: tokenData?.userId,
      // };
      // const result: any = await putRequest(
      //   "video/" + video._id,
      //   payload,
      //   setLoading,
      //   "Video Disliked!"
      // );
      setVideoDislikesLength(isDisliked ? videoDislikesLength - 1 : videoDislikesLength + 1);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
      console.error("Post error:", error);
    }
  };

  const handleFollowSubmit = async (action: string) => {
    try {
      setLoading(true);
      let payload = {
        action,
        userId: tokenData?.userId,
      };
      const result: any = await putRequest(
        "user/" + video.author?._id + "/follow",
        payload,
        setLoading,
        "Followed!"
      );
      console.log("Post success:", result);
      setComment("");
    } catch (error) {
      setLoading(false);
      console.error("Post error:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (comment.length > 1) {
      if (!tokenData?.userId) {
        toast.error("Log in first !!!");
        return;
      }
      try {
        setLoading(true);
        let payload = {
          userId: tokenData?.userId,
          text: comment,
        };
        const result: any = await postRequest(
          "video/" + video._id + "/comment",
          payload,
          setLoading,
          "Commented successfully"
        );
        setComment("");
        setCommentData(result?.comments);
      } catch (error: any) {
        setLoading(false);
        toast.error(error.message);
        console.error("Post error:", error);
      }
    }
  };

  const toggleBookmark = async () => {
    try {
      setLoading(true);
      const action = isBookmarked ? "removeBookmark" : "addBookmark";
      let payload = {
        action,
        userId: tokenData?.userId,
      };
      const result: any = await putRequest(
        "video/" + video._id,
        payload,
        setLoading,
        `Video ${isBookmarked ? "Unbookmarked" : "Bookmarked"}!`
      );
      setIsBookmarked(!isBookmarked);
      console.log("Bookmark status toggled:", result);
    } catch (error) {
      setLoading(false);
      console.error("Bookmark toggle error:", error);
    }
  };

  const handleVideoPlay = async () => {
    try {
      const result: any = await putRequest(`/video/view/${video._id}`, {}, setLoading);
      setViews(result.views);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  if (showModal) {
    return (
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        contentLabel="Subscribe Now"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
          },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            color: '#fff',
            padding: '20px',
            borderRadius: '10px',
            border: 'none',
          },
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Subscribe to Access This Profile</h2>
        <p>You need to subscribe to access this profile.</p>
        <button onClick={handleCloseModal} style={{ marginTop: '20px', padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Close
        </button>
      </Modal>
    );
  }

  return (
    <div className="">
      {/* Video Player */}
      <div className="relative w-full min-w-screen-xl bg-black" style={{ marginTop: 17 }}>
        {loading && <MdPlayArrow />}
        <video width="100%" height="400" controls onPlay={handleVideoPlay}>
          <source src={video?.file} type="video/mp4" />
          <source src={video?.file} type="video/quicktime" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Video Metadata and Actions */}
      <div className="mt-4 sm:flex justify-between items-center border-b pb-3 border-blue-200">
        {/* Video Information and Comments */}
        <div className="sm:w-3/5 ml-4 ">
          {/* Video Title */}
          <h1 className="md:text-2xl font-bold mb-2 text-xl">{video?.title}</h1>

          <div className="flex sm:gap-10 gap-6 items-center ">
            <address className="flex items-center justify-between mt-8px">
              <a href="#" className="flex w-full overflow-hidden relative items-center">
                <div className="relative rounded-full w-32px box-border flex-shrink-0 block">
                  <div
                    className="items-center rounded-full flex-shrink-0 justify-center bg-center bg-no-repeat bg-cover flex"
                    style={{
                      width: 32,
                      height: 32,
                      backgroundImage: `url(${video?.author?.avatar})`,
                    }}
                    title={video?.author?.username}
                  ></div>
                </div>
                <div style={{ fontSize: 13 }} className="w-full">
                  <div className="flex items-center sm:ml-2 flex-grow">
                    <span className="overflow-hidden -webkit-box">
                      {video?.author?.username}
                    </span>
                    <MdVerifiedUser size="18" color="green" className="flex-shrink-0 sm:ml-2" />
                  </div>
                  <div className="sm:ml-2 w-full">
                    <span>
                      {formatDateAgo(video?.createdAt ?? video?.updatedAt)} <BsDot className="inline-flex items-center" /> {views} Views
                    </span>
                  </div>
                </div>
              </a>
            </address>
            {isUserIdInArray(tokenData?.userId, video?.author?.followers) ? (
              <button
                onClick={() => handleFollowSubmit("unfollow")}
                className="bg-red-600 btn cursor-pointer text-white px-6 md:py-2 py-1 rounded-full"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => handleFollowSubmit("follow")}
                className="bg-green-400 btn text-white cursor-pointer px-6 md:py-2 py-1 rounded-full"
              >
                Follow
              </button>
            )}
          </div>
        </div>

        {/* Like, Dislike, Bookmark, and Action Buttons */}
        <div className="sm:w-2/5 sm:mr-2 my-3 sm:my-0 text-right mt-2 sm:mt-0 overflow-auto flex gap-4 items-center">
          <button
            disabled={loading}
            onClick={handleLikeClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isLiked ? "bg-green-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isLiked ? <AiFillLike size="24" /> : <AiOutlineLike size="24" />}
            {videoLikesLength}
          </button>
          <button
            disabled={loading}
            onClick={handleDislikeClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isDisliked ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isDisliked ? <AiFillDislike size="24" /> : <AiOutlineDislike size="24" />}
            {videoDislikesLength}
          </button>
          <button
            onClick={toggleBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
              isBookmarked ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isBookmarked ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              )}
            </svg>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full transition-colors"
          >
            <MdChat size="24" />
            Comments
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full transition-colors"
          >
            <MdUpload size="24" />
            Share
          </button>
        </div>
      </div>
      <hr />

      {/* Comment Section */}
      <form
        onSubmit={handleCommentSubmit}
        className="sm:w-5/6 w-11/12 my-20 relative m-auto bg-white rounded-md"
      >
        <textarea
          name=""
          placeholder="Add comment..."
          id=""
          cols={30}
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setComment(e.target.value)
          }
          rows={10}
          className="w-full p-3 border-0 rounded-lg outline-none"
        ></textarea>
        <button
          disabled={loading}
          className="bg-green-400 p-2 text-white absolute bottom-2 right-4 border-0 rounded-lg outline-none"
        >
          Comment
        </button>
      </form>

      {/* Display Comments */}
      {commentData.length > 0 ? (
        <div className="mt-1 sm:w-5/6 w-11/12 my-20 relative m-auto">
          <h3 className="break-words sm:text-base text-sm mb-2">
            {commentData.length} Comments
          </h3>

          {commentData.map((comment: any, index: number) => (
            <section key={index} className="relative mb-5 gap-2 flex">
              <img
                src={comment.avatar}
                className="bg-white rounded-full w-8 h-8 flex-shrink-0 text-lg mr-1.5 block border border-gray-100"
                alt="User Avatar"
              />
              <div>
                <div className="flex gap-1 mb-3">
                  <div className="cursor-pointer">
                    <h4 className="m-0 sm:text-base text-sm text-cyan-950 leading-4 max-h-3.5">
                      {comment.username}
                    </h4>
                  </div>
                  <h4 className="m-0 italic sm:text-base text-sm text-cyan-950 leading-4 max-h-3.5">
                    {formatDateAgo(comment.chatedAt ?? video.updatedAt)}
                  </h4>
                </div>
                <p className="break-words sm:text-base text-sm">
                  {comment.text}
                </p>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-1 sm:w-5/6 w-11/12 my-20 relative m-auto">No comments</p>
      )}
    </div>
  );
};

export default VideoPlayer;
