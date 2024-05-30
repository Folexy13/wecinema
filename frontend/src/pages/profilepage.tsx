// import React from 'react'

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Gallery, Layout } from "../components";
import { getRequest } from "../api";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { decodeToken, isUserIdInArray } from "../utilities/helperfFunction";
import '../components/header/drowpdown.css';

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
						src="https://scontent.fskt1-1.fna.fbcdn.net/v/t39.30808-6/444216752_345821988607794_6329538777469570636_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_ohc=_p_NzgeFwVoQ7kNvgG4-MHA&_nc_ht=scontent.fskt1-1.fna&oh=00_AYAcd9_IIg6PaJWiQ_YUW58nmyPlSArCKSPvMm--KnyopA&oe=665B580B"
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
									src="https://scontent.fskt1-1.fna.fbcdn.net/v/t39.30808-6/445203505_345868328603160_4760708580844450177_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=dKPwXW28bEIQ7kNvgHT8IXv&_nc_ht=scontent.fskt1-1.fna&oh=00_AYDHSKGEg5pAanrNyZ7cHK0zRWhxBevGFLLigBc90BqTgw&oe=665B62E1"
									alt="..."
								/>
							</div>
							<div className="overflow-hidden">
								
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
	  <hr className="border-t border-gray-300 w-full my-2" />
    </ul>
			</div>
			<div className="social-media-icons">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
        <FaFacebookF />
      </a>
      <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
        <FaTwitter />
      </a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <FaInstagram />
      </a>
     
    </div>
	
			<Gallery category="" length={5} data={id} />
		</Layout>
	);
};

export default genrepage;

