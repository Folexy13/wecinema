import React, { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import { MdChat, MdPlayArrow, MdUpload, MdVerifiedUser } from "react-icons/md";
import {
	AiFillDislike,
	AiFillLike,
	AiOutlineDislike,
	AiOutlineLike,
} from "react-icons/ai";
import {
	formatDateAgo,
	isUserIdInArray,
} from "../../utilities/helperfFunction";
// import { GrLike } from "react-icons/gr";
import { getRequest, postRequest, putRequest } from "../../api";
import { toast } from "react-toastify";
const VideoPlayer: React.FC<any> = ({ video, tokenData }) => {
	const [loading, setLoading] = useState(false);
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [comment, setComment] = useState<string>("");
	const [commentData, setCommentData] = useState<any>(video?.comments ?? []);

	const [isDisliked, setIsDisliked] = useState<boolean>(false);

	let [videoLikesLength, setvideoLikesLength] = useState(
		video?.likes?.length ?? 0
	);
	let [videoDisLikesLength, setvideoDisLikesLength] = useState(
		video?.dislikes?.length ?? 0
	);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const result: any = await getRequest("/video/" + video._id, setLoading);
				setCommentData(result.comments);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [loading]);
	const handleLikeClick = async () => {
		try {
			setLoading(true);
			setIsLiked(!isLiked);
			setIsDisliked(false);
			let payload = {
				action: "like",
				userId: tokenData?.userId,
			};
			const result: any = await putRequest(
				"video/" + video._id,
				payload,
				setLoading,
				"Video Liked!"
			);
			console.log(result);

			setvideoLikesLength(++videoLikesLength);
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
			let payload = {
				action: "dislike",
				userId: tokenData?.userId,
			};
			const result: any = await putRequest(
				"video/" + video._id,
				payload,
				setLoading,
				"Video Disliked!"
			);
			setvideoDisLikesLength(++videoDisLikesLength);
			console.log("Post success:", result);
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
	const handleCommentSubmit = async (e: any) => {
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
	return (
		<div className="">
			{/* Video Player */}
			<div
				className="relative w-full min-w-screen-xl  bg-black"
				style={{ marginTop: 17 }}
			>
				{loading && <MdPlayArrow />}
				<video width="100%" height="400" controls>
					<source src={video?.file} type="video/mp4" />
					<source src={video?.file} type="video/quicktime" />
					Your browser does not support the video tag.
				</video>
			</div>

			{/* Video Metadata and Actions */}
			<div className="mt-4 sm:flex justify-between items-center border-b pb-3  border-blue-200">
				{/* Video Information and Comments */}
				<div className="sm:w-3/5 ml-4 ">
					{/* Video Title */}
					<h1 className="md:text-2xl font-bold mb-2 text-xl">{video?.title}</h1>

					<div className="flex sm:gap-10 gap-6 items-center ">
						<address className="flex items-center justify-between mt-8px">
							<a
								href="#"
								className="flex w-full overflow-hidden relative items-center"
							>
								<div className="relative rounded-full w-32px  box-border flex-shrink-0 block">
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
										<MdVerifiedUser
											size="18"
											color="green"
											className="flex-shrink-0 sm:ml-2"
										/>
									</div>
									<div className="sm:ml-2 w-full">
										<span>
											{formatDateAgo(video?.createdAt ?? video?.updatedAt)}{" "}
											<BsDot className="inline-flex items-center" /> 155k Views
										</span>
									</div>
								</div>
							</a>
						</address>
						{isUserIdInArray(tokenData?.userId, video?.author?.followers) ? (
							<button
								onClick={() => handleFollowSubmit("unfollow")}
								className="bg-red-600 btn cursor-pointer text-white  px-6 md:py-2 py-1 rounded-full"
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

				{/* Like and Subscribe Buttons */}
				<div className="sm:w-2/5 sm:mr-2 my-3 sm:my-0 text-right mt-2 sm:mt-0 overflow-auto flex gap-1 items-center">
					<div className="flex rounded-full bg-gray-400">
						<button
							disabled={loading}
							onClick={handleLikeClick}
							className=" w-full sm:w-fit btn gap-2 flex text-white cursor-pointer px-6 md:py-2 py-1 "
						>
							{isLiked ? (
								<AiFillLike size="24" color="red" />
							) : (
								<AiOutlineLike size="24" color="green" />
							)}
							{videoLikesLength}
						</button>
						<button
							disabled={loading}
							onClick={handleDislikeClick}
							className="w-full border-l-2 border-white sm:w-fit btn gap-2 flex text-white cursor-pointer px-6 md:py-2 py-1 "
						>
							{isDisliked ? (
								<AiFillDislike size="24" color="red" />
							) : (
								<AiOutlineDislike size="24" color="green" />
							)}
							{video?.dislikes?.length ?? 0}
						</button>
					</div>

					<button className="bg-gray-400 w-full  sm:w-fit hover:bg-gray-500 btn gap-2 flex text-white cursor-pointer px-6 md:py-2 py-1 rounded-full">
						<MdChat size="24" color="white" />
						Comments
					</button>
					<button className="bg-gray-400 w-full cursor-pointer sm:w-fit  hover:bg-gray-500 btn flex gap-2 text-white px-4 md:py-2 py-1 rounded-full sm:mr-2">
						<MdUpload size="24" color="white" />
						Share
					</button>
					{/* <button className="bg-gray-400 w-full cursor-pointer sm:w-fit  hover:bg-gray-500 btn flex gap-2 text-white px-4 md:py-2 py-1 rounded-full sm:mr-2">
						<MdCode size="24" color="white" />
						Embed
					</button> */}
				</div>
			</div>
			<hr />
			<form
				onSubmit={handleCommentSubmit}
				className="sm:w-5/6 w-11/12 my-20 relative m-auto bg-white rounded-md "
			>
				<textarea
					name=""
					placeholder="Add comment..."
					id=""
					cols={30}
					value={comment}
					onChange={(e: any) => setComment(e.target.value)}
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
			{commentData.length > 0 ? (
				<div className="mt-1 sm:w-5/6 w-11/12 my-20 relative m-auto ">
					<h3 className="break-words sm:text-base text-sm mb-2">
						{commentData.length} Comments
					</h3>

					{commentData.map((comment: any, index: number) => {
						return (
							<section key={index} className="relative  mb-5 gap-2 flex  ">
								<img
									src={comment.avatar}
									className="bg-white rounded-full w-8 h-8 flex-shrink-0 text-lg mr-1.5 block border border-gray-100"
								></img>
								<div>
									<div className="flex gap-1 mb-3">
										<div className="cursor-pointer">
											<h4 className="m-0 sm:text-base text-sm text-cyan-950 leading-4  max-h-3.5 ">
												{comment.username}
											</h4>
										</div>
										<h4 className="m-0 italic sm:text-base text-sm text-cyan-950 leading-4  max-h-3.5 ">
											{formatDateAgo(comment.chatedAt ?? video.updatedAt)}
										</h4>
									</div>
									<p className="break-words sm:text-base text-sm">
										{comment.text}
									</p>
								</div>
							</section>
						);
					})}
				</div>
			) : (
				<p className="mt-1 sm:w-5/6 w-11/12 my-20 relative m-auto ">
					No comment
				</p>
			)}
		</div>
	);
};

export default VideoPlayer;
