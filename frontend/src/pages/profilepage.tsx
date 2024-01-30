// import React from 'react'

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Gallery, Layout } from "../components";
import { getRequest } from "../api";
import { decodeToken, isUserIdInArray } from "../utilities/helperfFunction";
let token =localStorage.getItem("token") ||null;
const genrepage = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState<any>({});
	useEffect(() => {
		if (!id) {
			toast.error("Please login first");
			return;
		} else {
			const fetchData = async () => {
				try {
					const result = await getRequest("/user/" + id, setLoading);
					setUser(result);
				} catch (error) {
					console.error("Error fetching data:", error);
				}
			};

			fetchData();
		}
	}, []);
	return (
		<Layout hasHeader={false}>
			<div style={{ marginTop: 12 }} className="">
				<div className="flex bg-black justify-center w-full items-start my-0  mx-auto h-52 sm:h-80">
					{/* <img
						className="w-50 h-50"
						src={user.coverImage}
						alt="..."
						width="400"
						height="30"
					/> */}
				</div>
				<div className="flex items-center ">
					<div className="w-full h-full -mt-12">
						<div className="items-center justify-center sm:justify-start flex-col sm:flex-row flex h-full sm:px-8 my-4 mx-auto w-full">
							<div className="overflow-hidden  flex justify-center mt--8 items-center">
								<img
									className="rounded-full bg-white h-16 w-16 sm:h-36 sm:w-36  border-2 p-1 border-white"
									src={user.avatar}
									alt="..."
								/>
							</div>
							<div className="overflow-hidden">
								<div className="flex items-center justify-center mb-1 ml-4">
									<h1 className="overflow-hidden text-ellipsis font-extrabold text-base sm:text-2xl mr-4">
										{user.username}
									</h1>
									<svg
										className=" h-4 sm:h-6"
										width="23"
										viewBox="0 0 23 24"
									>
										<path
											fill="#74CC1D"
											fill-rule="evenodd"
											d="M21.2 16a5.7 5.7 0 0 0 0-7.9A28.3 28.3 0 0 0 7.5.1 5.3 5.3 0 0 0 1.3 4 29 29 0 0 0 1 20.3a5.4 5.4 0 0 0 6.4 3.5A27 27 0 0 0 21.1 16Zm-6.5-6.3a1 1 0 0 0-1.4-1.4L8.5 13l-1.8-1.8a1 1 0 0 0-1.4 1.4l2.5 2.5c.4.4 1 .4 1.4 0l5.5-5.5Z"
										></path>
									</svg>
								</div>
								<span className="mb-1 ml-4 text-sm sm:text-xl">
									{user?.followers?.length} Followers
								</span>
							</div>
							{id !== decodeToken(token)?.userId && (
								<div className="ml-auto flex items-center">
									{isUserIdInArray("tokenData?.userId", user?.followers) ? (
										<button
											disabled={loading}
											className="bg-red-600 btn cursor-pointer text-white  px-6 md:py-2 py-1 rounded-full"
										>
											Unfollow
										</button>
									) : (
										<button
											disabled={loading}
											className="bg-green-400 btn text-white cursor-pointer px-6 md:py-2 py-1 rounded-full"
										>
											Follow
										</button>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<Gallery category="" length={5} data={id} />
		</Layout>
	);
};

export default genrepage;
