import React, { useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import {
	MdChat,
	MdCode,
	MdPlayArrow,
	MdUpload,
	MdVerifiedUser,
} from "react-icons/md";
import { formatDateAgo } from "../../utilities/helperfFunction";
// import { GrLike } from "react-icons/gr";
import { SlDislike } from "react-icons/sl";
import { BiLike } from "react-icons/bi";
import { getRequest } from "../../api";

import { useParams } from "react-router-dom";
const VideoPlayer: React.FC<any> = ({ video, isLoggedIn, toggleModal }) => {
	const { slug } = useParams();
	const [loading, setLoading] = useState(false);
	console.log("====================================");
	console.log(video);
	console.log("====================================");
	useEffect(() => {
		if (!video) {
			getRequest("/video/" + slug, setLoading);
		}
	}, [video]);

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
				<div className="sm:w-3/6 ml-4 ">
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
											backgroundImage: `url(${video?.video?.author?.avatar})`,
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
						<button className="bg-green-400 btn text-white cursor-pointer px-6 md:py-2 py-1 rounded-full">
							Follow
						</button>
					</div>
				</div>

				{/* Like and Subscribe Buttons */}
				<div className="sm:w-3/6 sm:mr-2 my-3 sm:my-0 text-right mt-2 sm:mt-0 overflow-auto flex gap-1 items-center">
					<div className="flex rounded-full bg-gray-400">
						<button className=" w-full sm:w-fit bg-gray-500 btn gap-2 flex text-white cursor-pointer px-6 md:py-2 py-1 rounded-full">
							<BiLike size="24" color="white" />
							{video?.likes?.length ?? 0}
						</button>
						<button className="w-full border-l-2 border-white sm:w-fit hover:bg-gray-500 btn gap-2 flex text-white cursor-pointer px-6 md:py-2 py-1 ">
							<SlDislike size="24" color="white" />
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
					<button className="bg-gray-400 w-full cursor-pointer sm:w-fit  hover:bg-gray-500 btn flex gap-2 text-white px-4 md:py-2 py-1 rounded-full sm:mr-2">
						<MdCode size="24" color="white" />
						Embed
					</button>
				</div>
			</div>
			<hr />
			<div className="w-5/6 my-20 py-20 m-auto bg-white rounded-md flex items-center justify-center">
				{isLoggedIn ? (
					<div></div>
				) : (
					<p>
						<span
							onClick={toggleModal}
							className="cursor-pointer text-green-500"
						>
							Sign in to{" "}
						</span>{" "}
						view Comments{" "}
					</p>
				)}
			</div>
		</div>
	);
};

export default VideoPlayer;
