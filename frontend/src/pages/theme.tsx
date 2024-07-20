// import React from 'react'

import { useParams } from "react-router-dom";
import { Theme, Layout } from "../components";
const themepage = () => {
	const {slug} = useParams();

	return (
		<Layout expand={false} hasHeader={false}>
		   <div style={{ marginTop: 12 }} className="">
                <div className="flex bg-grey justify-center w-full items-start my-0 mx-auto h-52 sm:h-80">
                    <img
                        className="w-50 h-45"
                        src="https://scontent.flhe2-3.fna.fbcdn.net/v/t39.30808-6/444216752_345821988607794_6329538777469570636_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGYFCDEJ1QbFUUd1O9lu-MCLkagD0qX1oguRqAPSpfWiP3Oet-k3fSC3nzNN-Ys5ScBx-IItAfH-SZPks5l3M4t&_nc_ohc=_KTwnbQlAB0Q7kNvgGL19pq&_nc_zt=23&_nc_ht=scontent.flhe2-3.fna&oh=00_AYAp4ZpG5Yn9MrzkjwqFPA4awpKnjWdthyTmBGapfnKhvg&oe=6697FD0B"
                        width="1200"
                        height="200"
                        alt="Cover"
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

			<Theme themes={slug} length={5} type="theme"/>
		</Layout>
	);
};

export default themepage;
