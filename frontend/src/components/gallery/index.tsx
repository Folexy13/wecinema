import React, { useEffect, useState } from "react";
import { MdVerifiedUser } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { getRequest } from "../../api";
import { formatDateAgo, generateSlug, truncateText } from "../../utilities/helperfFunction";
import { Skeleton } from "..";
interface GalleryProps {
	title: string;
	data?: any;
	category?: string;
	length?: number;
	isFirst?: boolean;
}
const Gallery: React.FC<GalleryProps> = ({
	title,
	isFirst,
	// data,
	length,
	category,
}) => {
	const nav = useNavigate();

	const [loading, setLoading] = useState<boolean>(false);
	const [videos, setVideos] = useState<any>([]);
		useEffect(() => {
		(async () => {
			const result = await getRequest("video/all", setLoading);

			if (result) {
				// Update state or props to trigger rendering with result
				setVideos(result); // Assuming a `videos` state variable
				console.log("====================================");
				console.log(loading);
				console.log("====================================");
			}
		})();
	}, []);
	const filteredVideo = (category?: string) => {
		return videos.filter((v: any) => v.genre.includes(category));
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
					{filteredVideo(category).length > 6 && (
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
							onClick={() =>
								nav(video.slug ?? generateSlug(video.title), { state: video })
							}
							key={index}
							style={{ maxWidth: "20%" }}
							className="cursor-pointer gallery relative flex-wrap  border-gray-200  w-full   p-2 "
						>
							<div className="thumbnail relative overflow-hidden">
								<img
									className="border-gray-200 rounded-xl"
									width="480"
									height="200"
									loading="lazy"
									src={video?.author?.avatar}
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
													{formatDateAgo(video.createdAt??video.updatedAt)}
													<BsDot className="inline-flex items-center" /> 155k
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
	if (length === 4 && filteredVideo(category).length > 0) {return (
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
							<img
								className="border-gray-200 rounded-xl"
								width="480"
								height="270"
								loading="lazy"
								src={video?.author?.avatar}
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
												9 hours ago{" "}
												<BsDot className="inline-flex items-center" /> 155k
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
	);}
	if (videos.length === 0) {
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
	}
	
};

export default Gallery;
