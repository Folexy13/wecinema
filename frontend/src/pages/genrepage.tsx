// import React from 'react'

import { useParams } from "react-router-dom";
import { Gallery, Layout } from "../components";
import { getCapitalizedFirstLetter } from "../utilities/helperfFunction";
const genrepage = () => {
	const {slug} = useParams();

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
							<div className="overflow-hidden flex-col sm:flex-row flex justify-center mt--8 items-center">
								<div className="relative rounded-full bg-black h-16 w-16 sm:h-36 sm:w-36  border-2 p-1 flex justify-center items-center border-white">
									<span className="z-10 text-white sm:text-6xl relative">
										{getCapitalizedFirstLetter(slug ?? "")}
									</span>
								</div>
								<div className="overflow-hidden">
									<div className="flex items-center  justify-center mb-1 ml-4">
										<h1 className="overflow-hidden  text-white text-ellipsis font-extrabold sm:text-5xl mr-4 text-base ">
											{slug}
										</h1>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Gallery category={slug} length={5} type="profile"/>
		</Layout>
	);
};

export default genrepage;
