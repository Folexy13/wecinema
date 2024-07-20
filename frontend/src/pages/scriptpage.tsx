// import React from 'react'

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Render } from "../components";
import { getCapitalizedFirstLetter } from "../utilities/helperfFunction";
import { FaArrowUp } from "react-icons/fa";
const genrepage = () => {
	const [script, setScript] = useState<any>({});
	const [isVisible, setIsVisible] = useState(false);
	const location = useLocation();
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	// Function to handle scroll event and show/hide the button
	const handleScroll = () => {
		if (window.pageYOffset > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	useEffect(() => {
		// Parse the state data from the location object
		const stateData = location.state;

		// Check if state data exists and update the state
		if (stateData) {
			setScript(JSON.parse(stateData));
		}
	}, [location]);
	// useEffect(() => {
	// 	if (!script) {
	// 	const fetchData = async () => {
	// 		try {
	// 			const result = await getRequest("/video/script" + id, setLoading);
	// 			setScript(result);
	// 		} catch (error) {
	// 			console.error("Error fetching data:", error);
	// 		}
	// 	};

	// 	fetchData();
	// 	}
	// }, []);
	console.log(script);
	return (
		<Layout expand={false} hasHeader={false}>
			<div style={{ marginTop: 12 }} className="">
				<div className="flex bg-black justify-center w-full items-start my-0  mx-auto h-52 sm:h-80">
					<p className="text-white mt-24 font-bold text-xl sm:text-2xl">
						{script.title}
					</p>
				</div>
				<div
					className={`${isVisible ? "block" : "hidden"} fixed bottom-5 right-5`}
				>
					<button
						onClick={scrollToTop}
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
					>
						<FaArrowUp />
					</button>
				</div>
				<div className="flex items-center ">
					<div className="w-full h-full -mt-12">
						<div className="items-center justify-center sm:justify-start flex-col sm:flex-row flex h-full sm:px-8 my-4 mx-auto w-full">
							<div className="overflow-hidden  flex justify-center mt--8 items-center">
								<div className="flex justify-center items-center rounded-full bg-white h-16 w-16 sm:h-36 sm:w-36  border-2 p-1 border-white">
									<span className="z-10 text-4xl text-black sm:text-6xl relative">
										{getCapitalizedFirstLetter(script?.author)}
									</span>
								</div>
							</div>
							<div className="overflow-hidden">
								<div className="flex items-center justify-center mb-1 ml-4">
									<h1 className="overflow-hidden text-ellipsis font-extrabold text-base sm:text-2xl mr-4">
										{script.author}
									</h1>
									<svg className=" h-4 sm:h-6" width="23" viewBox="0 0 23 24">
										<path
											fill="#74CC1D"
											fill-rule="evenodd"
											d="M21.2 16a5.7 5.7 0 0 0 0-7.9A28.3 28.3 0 0 0 7.5.1 5.3 5.3 0 0 0 1.3 4 29 29 0 0 0 1 20.3a5.4 5.4 0 0 0 6.4 3.5A27 27 0 0 0 21.1 16Zm-6.5-6.3a1 1 0 0 0-1.4-1.4L8.5 13l-1.8-1.8a1 1 0 0 0-1.4 1.4l2.5 2.5c.4.4 1 .4 1.4 0l5.5-5.5Z"
										></path>
									</svg>
								</div>
								<span className="mb-1 ml-4 text-sm sm:text-xl">Author</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="w-full sm:w-1/2 mx-auto my-4 bg-white text-black rounded-sm p-4">
				<Render htmlString={script?.script} />
			</div>
		</Layout>
	);
};

export default genrepage;
