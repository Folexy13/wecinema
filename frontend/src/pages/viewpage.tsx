import React, { useEffect, useState } from "react";
import { Layout, Player } from "../components";
import { FaEye } from "react-icons/fa";

import { useLocation, useParams } from "react-router-dom";
import { MdComment } from "react-icons/md";
import { decodeToken, formatDateAgo, truncateText } from "../utilities/helperfFunction";
import { getRequest } from "../api";

const Viewpage: React.FC<any> = () => {
	const location = useLocation();
	const { slug } = useParams();
	const [loading, setLoading] = useState(false);
	const [catVideos, setCatVideos] = useState<any>([]);
	const videoDataFromState = location.state;
	const videoDataFromLocalStorage = localStorage.getItem("video");

	let video;

	if (videoDataFromState) {
		// If data is available in the state, use it
		video = videoDataFromState;
	} else if (videoDataFromLocalStorage) {
		// If data is not in the state but available in localStorage, parse it
		try {
			video = JSON.parse(videoDataFromLocalStorage);
		} catch (error) {
			console.error("Error parsing video data from localStorage:", error);
			// Handle the error (e.g., provide a default value or set video to null)
			video = null;
		}
	} else {
		// If no data is available in both state and localStorage, set video to a default value or handle it accordingly
		video = null;
	}

	const token = localStorage.getItem("token") || null;

	const [loggedVideo, setLoggedVideo] = useState<any>(video);
	useEffect(() => {
		if (!video) {
			const result = getRequest("/video/" + slug, setLoading);
			setLoggedVideo(result);
		} else {
			return;
		}
	}, [video]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const catVideosPromises = video?.genre?.map(async (genre: any) => {
					const result = await getRequest(
						"/video/category/" + genre,
						setLoading
					);
					return result;
				});

				// Wait for all promises to resolve
				const catVideos = await Promise.all(catVideosPromises);

				// Once all promises are resolved, update the state
				setCatVideos([].concat(...catVideos));
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
console.log(loading);

		fetchData();
	}, [video]);
	
	
	return (
		<Layout hasHeader={false}>
			<div className="sm:flex flex-col md:flex-row" style={{ marginTop: 12 }}>
				<div className="sm:w-4/5 ">
					<Player video={loggedVideo} tokenData={decodeToken(token)} />
				</div>
				<div className="min-h-86 sm:w-1/5  ml-2.5 py-10">
					{catVideos.map((video: any, index: number) => (
						<div
							key={index}
							className={`flex overflow-hidden items-start ${
								index === 0 ? "sm:mt-20 mt-10" : "mt-6"
							}`}
						>
							<div className="bg-gray-500 size  flex-shrink-0 relative overflow-hidden px-2.5 mr-2.5 py-3 rounded-md">
								<img className="block w-full aspect-w-16 aspect-h-9 object-cover rounded-lg" />
								<small className="absolute bottom-2 right-2 text-gray-300 bg-black px-3 py-1 text-xs backdrop-blur-md border rounded-full overflow-hidden font-semibold">
									1:05:24
								</small>
							</div>
							<div className="w-full block">
								<section className="relative flex items-center ">
									<img
										src={video?.author?.avatar}
										className="bg-white rounded-full w-8 h-8 flex-shrink-0 text-lg mr-1.5 block border border-gray-100"
									></img>
									<div className="cursor-pointer">
										<h4 className="m-0 sm:text-base text-sm text-cyan-950 leading-4  max-h-3.5 ">
											{video?.author?.username}
										</h4>
										<small className="text-cyan-800">
											{formatDateAgo(video.createdAt ?? video.updatedAt)}
										</small>
									</div>
								</section>
								<h3 className="leading-5 overflow-hidden text-sm sm:text-lg my-1 mx-2">
									{truncateText(video.title, 40)}
								</h3>
								<div className="flex items-center justify-between mx-2">
									<div className="flex items-center text-sm text-cyan-800">
										<div className="flex mr-3 items-center">
											<FaEye className="mr-2" size="20" />
											<span>
												{Math.floor(Math.random() * (50 - 0)) + 0}
											</span>
										</div>
										<div className="flex items-center">
											<MdComment className="mr-2" size="20" />
											<span>{video?.comments?.length}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</Layout>
	);
};

export default Viewpage;
