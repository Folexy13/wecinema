// import React from "react";

import { MdMenu } from "react-icons/md";
import logo from "../../assets/wecinema.png";
import { useNavigate } from "react-router-dom";
interface HeaderProps {
	darkMode: boolean;
	toggler: any;
	toggleSigninModal: any;
	toggleSignoutModal: any;
	toggleSignupModal: any;
	expand: boolean;
	isMobile: boolean;
	isLoggedIn: any;
}
const Header: React.FC<HeaderProps> = ({
	darkMode,
	toggler,
	toggleSignoutModal,
	toggleSigninModal,
	toggleSignupModal,
	expand,
	isLoggedIn,
	isMobile,
}) => {
	const nav = useNavigate();
	return (
		<header
			className={`text-blue z-50 border-b fixed w-screen border-gray-200 ${
				darkMode ? "bg-dark" : "bg-light"
			}  ${darkMode ? "text-dark" : "text-light"} `}
		>
			<nav
				className={`mx-auto flex gap-4 items-center justify-between p-4 sm:pr-12 ${
					expand && !isMobile ? " px-4" : "sm:px-12 "
				} `}
			>
				<ul className="flex gap-4 items-center">
					<MdMenu size={30} className="cursor-pointer" onClick={toggler} />
					<li
						className="cursor-pointer flex-col sm:flex-row flex gap-2 items-center"
						onClick={() => nav("/")}
					>
						<img src={logo} alt="logo" width={70} title="wecinema"/>
						{
							!isMobile &&(
								<p className=" text-xl sm:text-2xl mt-3 font-mono">
									<b>We </b>Cinema
								</p>
							)
						}
					</li>
				</ul>
				<form className="w-full md:w-2/3">
					<input
						type="search"
						placeholder="Search anything..."
						className="w-full md:w-2/3 flex mx-auto border rounded-xl cursor-pointer p-2 outline-none"
					/>
				</form>
				<ul className="flex gap-2 auth items-center">
					{isLoggedIn ? (
						<>
							<img
								src={isLoggedIn.avatar}
								className="rounded-full"
								alt=""
								width={50}
								height={50}
							/>
							<li>{isLoggedIn.username}</li>
							<li
								onClick={toggleSignoutModal}
								className="bg-red-600 whitespace-nowrap text-white hover:border-red-600 py-1  rounded-xl px-4  cursor-pointer"
							>
								Logout
							</li>
						</>
					) : (
						<>
							<li
								onClick={toggleSigninModal}
								className="hover:bg-green-700 whitespace-nowrap hover:text-white hover:border-green-700 py-1  rounded-xl px-4  cursor-pointer"
							>
								Sign In
							</li>
							<li
								onClick={toggleSignupModal}
								className="hover:bg-green-700 whitespace-nowrap hover:text-white hover:border-green-700 border border-green-700 rounded-xl px-4 py-1 cursor-pointer"
							>
								Sign Up
							</li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default Header;
