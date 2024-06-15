// import React from 'react'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Delete, Layout } from "../components";
import { getRequest } from "../api";
import { decodeToken, isUserIdInArray } from "../utilities/helperfFunction";
import '../components/header/drowpdown.css';
import { FaEdit } from 'react-icons/fa'; // Importing the edit icon
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
			}

			fetchData();
		}
	}, []);
	useEffect(() => {
		if (!id) {
			toast.error("Please login first");
			return;
		} else {
			const fetchData = async () => {
				try {
					const result = await getRequest("/video/" + id, setLoading);
					setUser(result);
				} catch (error) {
					console.error("Error fetching data:", error);
				}
			}

			fetchData();
		}
	}, []);
	return (
		<Layout hasHeader={false}>
			<div style={{ marginTop: 12 }} className="">
				<div className="flex bg-grey justify-center w-full items-start my-0  mx-auto h-52 sm:h-80">
					{ <img
						className="w-50 h-45"
						src="https://scontent.fskt1-1.fna.fbcdn.net/v/t39.30808-6/444216752_345821988607794_6329538777469570636_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=2okqw2b2yRgQ7kNvgGoimHb&_nc_ht=scontent.fskt1-1.fna&oh=00_AYA6KaJWPkrNSp9maFEvHlJ8XBKAZpatuQPqV_FDN2hL_w&oe=6673BBCB"
						width="1200"
						height="200"
					/> }
				</div>
				<div className="flex items-center ">
					<div className="w-full h-full -mt-1">
						<div className="items-center justify-center sm:justify-start flex-col sm:flex-row flex h-full sm:px-8 my-4 mx-auto w-full">
							<div className="overflow-hidden  flex justify-center mt--8 items-center">
								<img
									className="rounded-full bg-white h-16 w-16 sm:h-36 sm:w-36  border-2 p-1 border-white"
									src="https://scontent.fskt1-1.fna.fbcdn.net/v/t39.30808-6/445203505_345868328603160_4760708580844450177_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=WxbqXef-6b8Q7kNvgE_NB3g&_nc_ht=scontent.fskt1-1.fna&oh=00_AYCEQmqkOmLp-CUiw9LV91Q-woIEWIdJBOYQCFMslAL3cw&oe=6673C6A1"
									alt="..."
								/>
							</div>
							<div>
     
    </div>
							<div className="overflow-hidden">
								
							<button 
            className="mb-1 ml-4 text-sm sm:text-xl bg-purple-500 text-white py-2 px-4 rounded"
        >
            {user?.followers?.length} Followers
        </button>
		<button 
            className="mb-1 ml-4 text-sm sm:text-xl bg-purple-500 text-white py-2 px-4 rounded"
        >
            {user?.followers?.length} Videos
        </button>
		<button 
            className="mb-1 ml-4 text-sm sm:text-xl bg-purple-500 text-white py-2 px-4 rounded"
        >
            {user?.followers?.length} Likes
        </button>
		<button 
            className="mb-1 ml-4 text-sm sm:text-xl bg-purple-500 text-white py-2 px-4 rounded"
        >
            {user?.followers?.length} Bookmark
        </button>
		<hr className="border-t border-gray-300 w-full my-2" />

							
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
				<div className="left-container">
				<ul className="flex flex-col items-left justify-left px-10 mt-5 mb-1 ml-4">
      <li className="overflow-hidden text-ellipsis font-extrabold text-base sm:text-2xl mb-2">
        {user.username}
      </li>
      <li className="overflow-hidden text-ellipsis font-normal text-base  mb-2">
        {user.email}
      </li>
      <li className="overflow-hidden text-ellipsis font-normal text-base  mb-2">
       Date of Birth: {user.dob}
      </li>
	  <button >
        <FaEdit size="20"/>
      </button>
	  <hr className="border-t border-gray-300 w-full my-2" />
    </ul>
    <ul>
<li>
<ul>
					<li>
						<h1 style={{ fontSize: '26px', fontFamily: 'Arial, sans-serif', marginBottom: '15px', marginLeft: '50px', marginTop: '10px' }}>Allowed Ratings</h1>
						<button className="mb-1 ml-12 text-sm sm:text-xl bg-green-500 text-white py-2 px-4 rounded">G</button>
						<button className="mb-1 ml-4 text-sm sm:text-xl bg-blue-500 text-white py-2 px-4 rounded">PG</button>
						<button className="mb-1 ml-4 text-sm sm:text-xl bg-blue-500 text-white py-2 px-4 rounded">PG-13</button>
						<button className="mb-1 ml-4 text-sm sm:text-xl bg-yellow-500 text-white py-2 px-4 rounded">RS</button>
						<button className="mb-1 ml-12 text-sm sm:text-xl bg-red-500 text-white py-2 px-4 rounded">X</button>
					</li>
				</ul>
		
		</li>
		</ul>

      </div>
      <div className="right-container">
	  <div style={{ width: '100%' }}>
  <Delete category="" length={3} data={id} />
</div>



      </div>
				

			</div>
		
	
		</Layout>
	);
};

export default genrepage;

