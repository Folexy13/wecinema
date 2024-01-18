import React from "react";
import { BsDot } from "react-icons/bs";
import {
	MdChat,
	MdCode,
	MdPlayArrow,
	MdUpload,
	MdVerifiedUser,
} from "react-icons/md";

const VideoPlayer: React.FC = () => {
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
				{/* <MdPlayArrow
					size="80"
					color="white"
					className="absolute cursor-pointer "
					style={{ top: "45%", left: "45%" }}
				/> */}
				<iframe
					width={"100%"}
					className="none"
					height="703"
					src="https://www.youtube.com/embed/hzHPQr5bwtU"
					title="How to play HOT Praises...BASS, BACKING....."
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowFullScreen
				></iframe>
			</div>

			{/* Video Metadata and Actions */}
			<div className="mt-4 sm:flex justify-between items-center border-b pb-3  border-blue-200">
				{/* Video Information and Comments */}
				<div className="sm:w-2/3 ml-4 ">
					{/* Video Title */}
					<h1 className="text-2xl font-bold mb-2 ">
						The Aurora Borealis dancing all night in northern Sweden
					</h1>

					<div className="flex gap-10 items-center ">
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
											backgroundImage:
												"url('data:image/jpeg;base64,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')",
										}}
										title="Fresh and Fit"
									></div>
								</div>
								<div style={{ fontSize: 13 }} className="w-full">
									<div className="flex items-center ml-2 flex-grow">
										<span className="overflow-hidden -webkit-box">
											Fresh and Fit
										</span>
										<MdVerifiedUser
											size="18"
											color="green"
											className="flex-shrink-0 ml-2"
										/>
									</div>
									<div className="ml-2 w-full">
										<span>
											9 hours ago <BsDot className="inline-flex items-center" />{" "}
											155k Views
										</span>
									</div>
								</div>
							</a>
						</address>
						<button className="bg-green-400 btn text-white cursor-pointer px-6 py-2 rounded-full">
							Follow
						</button>
					</div>
				</div>

				{/* Like and Subscribe Buttons */}
				<div className="sm:w-1/3 mr-2 text-right flex gap-1 items-center">
					<button className="bg-gray-400 hover:bg-gray-500 btn gap-2 flex text-white cursor-pointer px-6 py-2 rounded-full">
						<MdChat size="24" color="white" />
						Comments
					</button>
					<button className="bg-gray-400 hover:bg-gray-500 btn flex gap-2 text-white px-4 py-2 rounded-full mr-2">
						<MdUpload size="24" color="white" />
						Share
					</button>
					<button className="bg-gray-400 hover:bg-gray-500 btn flex gap-2 text-white px-4 py-2 rounded-full mr-2">
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
