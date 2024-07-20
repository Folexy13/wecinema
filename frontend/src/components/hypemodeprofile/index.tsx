import React, { useEffect, useState } from "react";
import { MdVerifiedUser } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import VideoThumbnail from "react-video-thumbnail";
import { getRequest } from "../../api";

import {
	formatDateAgo,
	generateSlug,
	truncateText,
} from "../../utilities/helperfFunction";
import { Skeleton } from "..";
interface GalleryProps {
	title?: string;
	type?: string;
	data?: any;
	category?: string;
	length?: number;
	isFirst?: boolean;
}
const HypemodeGallery: React.FC<GalleryProps> = ({
	title,
	isFirst,
	data,
	length,
	category,
	type,
}) => {
	const nav = useNavigate();

	const [loading, setLoading] = useState<boolean>(false);
	const [videos, setVideos] = useState<any>([]);
	const [viewCounts, setViewCounts] = useState<{ [key: string]: number }>({});
	// const [hiddenVideos, setHiddenVideos] = useState<any>([]);
	const fetchVideoViews = async (videoId:any) => {
		try {
		  const response = await fetch(`//video/views/${videoId}`);
		  const data = await response.json();
		  return data.views;
		} catch (error) {
		  console.error('Error fetching video views:', error);
		  return 0;
		}
	  };
	  
	useEffect(() => {
		let isMounted = true;
	  
		(async () => {
		  setLoading(true);
		  const result:any = !data
			? await getRequest("video/all", setLoading)
			: await getRequest("video/all/" + data, setLoading);
	  
		  if (isMounted && result) {
			setVideos(result);
			setLoading(false);
	  
			const fetchViewCounts = async () => {
			  const viewsPromises = result.map(async (video:any) => {
				const views = await fetchVideoViews(video._id);
				return { videoId: video._id, views };
			  });
	  
			  const viewsData = await Promise.all(viewsPromises);
			  const viewsMap:any = {};
			  viewsData.forEach((item) => {
				viewsMap[item.videoId] = item.views;
			  });
			  setViewCounts(viewsMap);
			};
	  
			fetchViewCounts();
		  }
		})();
	  
		return () => {
		  isMounted = false;
		};
	  }, [category]);
	  

	  const filteredVideo = (category?: string) => {
		return videos.filter((v: any) =>
			v.hasPaid && (category ? v.genre.includes(category) : v)
		);
	};
	// const handleHideVideo = async (videoId: string) => {
	// 	try {
	// 		await getRequest(`/video/hide/${videoId}`, setLoading);
	// 		setHiddenVideos((prev: any) => [...prev, videoId]);
	// 	} catch (error) {
	// 		console.error("Error hiding video:", error);
	// 	}
	// };
	
	// const handleUnhideVideo = async (videoId: string) => {
	// 	try {
	// 		await getRequest(`/video/unhide/${videoId}`, setLoading);
	// 		setHiddenVideos((prev: any) => prev.filter((id: string) => id !== videoId));
	// 	} catch (error) {
	// 		console.error("Error unhiding video:", error);
	// 	}
	// };
	
	const handleVideolick = (video: any) => {
		nav(video.slug ?? "/video/" + generateSlug(video._id), {
			state: video,
		});
		localStorage.setItem("video", JSON.stringify(video));
	};
	if (length === 5 && filteredVideo(category).length > 0) {
		return (
			<div
				// style={{ minHeight: 280 }}
				className={` ${
					isFirst ? "mt-20" : ""
				} z-1 relative p-2 flex flex-wrap border-b  border-blue-200 sm:mx-4 pb-4`}
			>
				<div className="mt-1 w-full sm:px-4 py-2 flex justify-between items-center">
					<h2 className="text-l font-extrabold text-lg sm:text-xl">{title}</h2>
					{filteredVideo(category).length > 6 && title && (
						<a
							href="#"
							className={` ${
								!title && "float-right"
							} hover:bg-green-700 whitespace-nowrap hover:text-white hover:border-green-700 border border-green-700 py-1  rounded-xl px-4  cursor-pointer	`}
						>
							View all
						</a>
					)}
				</div>
				<div className="flex flex-wrap w-full">
					{filteredVideo(category).map((video: any, index: any) => (
						// VideoStream
						<div
							key={index}
							style={{ maxWidth: "20%" }}
							className="cursor-pointer gallery relative flex-wrap  border-gray-200  w-full   p-2 "
						>
							<div
								onClick={() => handleVideolick(video)}
								className="thumbnail relative overflow-hidden"
							>
								<VideoThumbnail
									videoUrl={video.file}
									//thumbnailHandler={(thumbnail: any) => console.log(thumbnail)}
									className="border-gray-200 rounded-xl w-full"
								/>
								{/* <img
									className="border-gray-200 rounded-xl"
									width="480"
									height="121.41"
									loading="lazy"
									src={video?.author?.avatar}
								/> */}
							</div>
							<div
								className="footer flex-1 block"
								onClick={() => {
									nav("/user/" + video?.author?._id);
								}}
							>
								<a href="#" className="inline-flex max-w-max overflow-hidden">
									<h3 className="text-base font-semibold leading-5 my-2">
										{truncateText(video.title, 60)}
									</h3>
								</a>
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
											<div className="flex items-center ml-2 flex-grow">
												<span className="overflow-hidden -webkit-box">
													{video?.author?.username}
												</span>
												<MdVerifiedUser
													size="12"
													color="green"
													className="flex-shrink-0 ml-2"
												/>
											</div>
											<div className="ml-2 w-full">
												<span>
													{formatDateAgo(video.createdAt ?? video.updatedAt)}
													<BsDot className="inline-flex items-center" /> {viewCounts[video._id]} 
													Views
												</span>

											</div>
										</div>
									</a>
								</address>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
	if (length === 4 && filteredVideo(category).length > 0) {
		return (
			<div
				// style={{ minHeight: 280 }}
				className={` ${
					isFirst ? "mt-20" : ""
				} z-1 relative p-2 flex flex-wrap border-b  border-blue-200 sm:mx-4 pb-4`}
			>
				<div className="mt-1 w-full sm:px-4 py-2 flex justify-between items-center">
					<h2 className="font-extrabold text-lg sm:text-xl">{title}</h2>
					<a
						href="#"
						className={` ${
							!title && "float-right"
						} hover:bg-green-700 whitespace-nowrap hover:text-white hover:border-green-700 border border-green-700 py-1  rounded-xl px-4  cursor-pointer	`}
					>
						View all
					</a>
				</div>
				<div className="flex flex-wrap w-full">
					{filteredVideo(category).map((video: any, index: any) => (
						// VideoStream
						<div
							onClick={() => nav("/ls")}
							key={index}
							style={{ maxWidth: length === 4 ? "inherit" : "20%" }}
							className="cursor-pointer gallery relative  border-gray-200 flex-wrap w-full   p-2 "
						>
							<div className="thumbnail relative overflow-hidden">
								{/* <img
									className="border-gray-200 rounded-xl"
									width="480"
									height="270"
									loading="lazy"
									src={video?.author?.avatar}
								/> */}
								<VideoThumbnail
									videoUrl={video.file}
									//thumbnailHandler={(thumbnail: any) => console.log(thumbnail)}
									className="border-gray-200 rounded-xl"
								/>
							</div>
							<div className="footer flex-1 block">
								<a href="#" className="inline-flex max-w-max overflow-hidden">
									<h3 className="text-base font-semibold leading-5 my-2">
										{truncateText(video.title, 60)}
									</h3>
								</a>
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
											<div className="flex items-center ml-2 flex-grow">
												<span className="overflow-hidden -webkit-box">
													Fresh and Fit
												</span>
												<MdVerifiedUser
													size="12"
													color="green"
													className="flex-shrink-0 ml-2"
												/>
											</div>
											<div className="ml-2 w-full">
													<span>
													{formatDateAgo(video.createdAt ?? video.updatedAt)}
													<BsDot className="inline-flex items-center" /> {viewCounts[video._id]} 
													Views
												</span>
											</div>
										</div>
									</a>
								</address>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
	if (videos.length === 0 && loading) {
		return (
			<div
				// style={{ minHeight: 280 }}
				className={` ${
					isFirst ? "mt-5" : ""
				} z-1 relative p-2 flex flex-wrap border-b overflow-hidden border-blue-200 sm:mx-4 pb-4`}
			>
				<div className="flex flex-wrap w-full ">
					{Array(7)
						.fill("")
						.map((_, index: any) => (
							// VildeoStream
							<Skeleton
								key={index}
								width={400}
								style={{ maxWidth: "20%" }}
								className="cursor-pointer gallery relative flex-wrap  border-gray-200  w-full   p-2 "
							/>
						))}
				</div>
			</div>
		);
	} else if (
		filteredVideo(category).length > 0 &&
		type === "profile" &&
		!loading
	) {
		return (
			<div
				// style={{ minHeight: 280 }}
				className={` ${
					isFirst ? "mt-5" : ""
				} z-1 relative p-2 flex text-center flex-wrap border-b overflow-hidden border-blue-200 sm:mx-4 pb-4`}
			>
				<div className="flex flex-wrap w-full ">No Video Uploaded</div>
			</div>
		);
	}
};

export default HypemodeGallery;
