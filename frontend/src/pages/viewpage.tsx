import React, { useState } from "react";
import {   Layout, Player } from "../components";
import { FaEye } from "react-icons/fa";
import { categories as CAT } from "../App";

import { useLocation } from "react-router-dom";
import { MdComment } from "react-icons/md";
import { decodeToken } from "../utilities/helperfFunction";

const Viewpage: React.FC<any> = () => {
  const location = useLocation();
	const video  = location.state;
	const [modal, setModal] = useState(0);
const token = localStorage.getItem("token") || null;
	return (
		<Layout hasHeader={false} modalType={modal}>
			<div className="sm:flex flex-col md:flex-row" style={{ marginTop: 12 }}>
				<div className="sm:w-4/5 ">
					<Player
						video={video}
						isLoggedIn={decodeToken(token)}
						toggleModal={() => setModal(1)}
					/>
				</div>
				<div className="min-h-86 sm:w-1/5  ml-2.5 py-10">
					{CAT.map((_, index: number) => (
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
									<i className="bg-white rounded-full w-8 h-8 flex-shrink-0 text-lg mr-1.5 block border border-gray-100"></i>
									<div className="cursor-pointer">
										<h4 className="m-0 sm:text-base text-sm text-cyan-950 leading-4  max-h-3.5 ">
											Rethinking the Dollar
										</h4>
										<small className="text-cyan-800">10 hours ago</small>
									</div>
								</section>
								<h3 className="leading-5 overflow-hidden text-base sm:text-lg my-1 mx-2">
									Back At It Again! US & UK launch Airstrikes in...
								</h3>
								<div className="flex items-center justify-between mx-2">
									<div className="flex items-center text-sm text-cyan-800">
										<div className="flex mr-3 items-center">
											<FaEye className="mr-2" size="20" />
											<span>59.7K </span>
										</div>
										<div className="flex items-center">
											<MdComment className="mr-2" size="20" />
											<span>103</span>
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
