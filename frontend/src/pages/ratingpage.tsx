// import React from 'react'

import { useParams } from "react-router-dom";
import { Rating, Layout } from "../components";
const ratingpage = () => {
	const {slug} = useParams();

	return (
		<Layout hasHeader={false}>
			<div style={{ marginTop: 12 }} className="">
				<div className="flex bg-black justify-center w-full items-start my-0  mx-auto h-52 sm:h-80">
					<img
						className="w-50 h-50"
						src={"https://scontent.fskt1-1.fna.fbcdn.net/v/t39.30808-6/444216752_345821988607794_6329538777469570636_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=qvvn7toE2PUQ7kNvgGVXy_Y&_nc_ht=scontent.fskt1-1.fna&oh=00_AYCqUyb6-ilebDh0cAGpx6nxvVqhC92Lk6IxlCPsmJwSTA&oe=667B344B"}
						alt="..."
						width="1200"
						height="50"
					/>
				</div>
				<div className="flex items-center ">
					<div className="w-full h-full -mt-12">
						<div className="items-center justify-center sm:justify-start flex-col sm:flex-row flex h-full sm:px-8 my-4 mx-auto w-full">
							<div className="overflow-hidden flex-col sm:flex-row flex justify-center mt-12 items-center">
									<span className="z-10 text-black sm:text-6xl relative">
									</span>
								<div className="overflow-hidden">
									<div className="flex items-center  text-left justify-center mb-1 ml-4">
										<h1 className="overflow-hidden text-black text-ellipsis font-extrabold sm:text-6xl mr-4 mt-12 text-base ">
											{slug}
										</h1>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Rating ratings={slug} length={5} type="rating"/>
		</Layout>
	);
};

export default ratingpage;
