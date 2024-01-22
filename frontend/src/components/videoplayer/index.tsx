import React from "react";
import { BsDot } from "react-icons/bs";
import {
	MdChat,
	MdCode,
	// MdPlayArrow,
	MdUpload,
	MdVerifiedUser,
} from "react-icons/md";
import { formatDateAgo } from "../../utilities/helperfFunction";
// import { GrLike } from "react-icons/gr";
import { SlDislike, SlLike } from "react-icons/sl";


const VideoPlayer: React.FC<any> = (video: any) => {
	return (
		<div className="">
			{/* Video Player */}
			<div
				className="relative w-full min-w-screen-xl  bg-black"
				style={{ marginTop: 17 }}
			>
				{/* <video
					muted=""
					playsinline=""
					hidefocus="hidefocus"
					style="width:100% !important;height:100% !important;display:block"
					preload="metadata"
				></video> */}
				<video width="100%" height="400" controls>
					<source src={video.video.file} type="video/mp4" />
					<source src={video.video.file} type="video/quicktime" />
					Your browser does not support the video tag.
				</video>

				{/* <iframe
					width={"100%"}
					className="none"
					height="703"
					src={video.video.file}
					title={truncateText(video.video.title, 40)}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				></iframe> */}
			</div>

			{/* Video Metadata and Actions */}
			<div className="mt-4 sm:flex justify-between items-center border-b pb-3  border-blue-200">
				{/* Video Information and Comments */}
				<div className="sm:w-3/6 ml-4 ">
					{/* Video Title */}
					<h1 className="md:text-2xl font-bold mb-2 text-xl">
						{video.video.title}
					</h1>

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
										title={video?.video?.author?.username}
									></div>
								</div>
								<div style={{ fontSize: 13 }} className="w-full">
									<div className="flex items-center sm:ml-2 flex-grow">
										<span className="overflow-hidden -webkit-box">
											{video?.video?.author?.username}
										</span>
										<MdVerifiedUser
											size="18"
											color="green"
											className="flex-shrink-0 sm:ml-2"
										/>
									</div>
									<div className="sm:ml-2 w-full">
										<span>
											{formatDateAgo(
												video.video?.createdAt ?? video.video?.updatedAt
											)}{" "}
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
							<SlLike size="24" color="white" />
							{video?.likes?.length??0}
						</button>
						<button className="w-full border-l-2 border-white sm:w-fit hover:bg-gray-500 btn gap-2 flex text-white cursor-pointer px-6 md:py-2 py-1 ">
							<SlDislike size="24" color="white" />
							{video?.dislikes?.length??0}
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
				<p>
					<a href="#">Sign in to </a> view Comments{" "}
				</p>
			</div>
		</div>
	);
};

export default VideoPlayer;
