import React from "react";
import { IoMdHome } from "react-icons/io";
import { RiMovie2Line } from "react-icons/ri";
import { LiaSignInAltSolid } from "react-icons/lia";
import { HiUserAdd } from "react-icons/hi";
import { FaMoon} from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md"
import { BiCameraMovie } from "react-icons/bi";
import { IoSunnyOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Link} from "react-router-dom";
import { TbVideoPlus } from "react-icons/tb";
import { decodeToken } from "../../utilities/helperfFunction";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

interface SidebarProps {
	expand: boolean;
	darkMode: boolean;
	toggleSigninModal?: any;
	toggleSignupModal?: any;
	toggleUploadScriptModal?: any;
	toggleUploadModal?: any;
	setDarkMode: any;
	isLoggedIn: any;
	toggleSignoutModal?: any;
	setLightMode: any;
}

const Sidebar: React.FC<SidebarProps> = ({
	expand,
	toggleSigninModal,
	toggleSignupModal,
	toggleSignoutModal,
	setLightMode,
	setDarkMode,
	darkMode,
	isLoggedIn,
	toggleUploadScriptModal,
	toggleUploadModal,
}) => {
	const token = localStorage.getItem("token") || null;
	const tokenData = decodeToken(token);

	console.log(tokenData);

	return (
		<section
			// style={{ marginTop: 67 }}
			className={`text-blue inset-0 desktop-sidebar overflow-auto mt-16  fixed border-r border-gray-200 ${
				expand ? "w-1/6" : "w-1/12 attach"
			} ${darkMode ? "bg-dark" : "bg-light"}  ${
				darkMode ? "text-dark" : "text-light"
			} `}
		>
			<nav className={` flex items-center justify-between p-2 my-3 pb-6 `}>
				<ul className={`border-b  w-full border-gray-200 pb-4 `}>
					<Link
						to="/"
						className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center margin-top:20px ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						}`}
						style={{ marginTop: '30px' }}
					>
						<IoMdHome size="20" margin-top="10" />
						<Link to="/" className="text-sm ">
							Home
						</Link>
					</Link>
					<Link
						to="/hypemode"
						className={`duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						} `}
					>
						<RiMovie2Line size="20" />
						<Link to="/hypemode" className="text-sm ">
							Hype mode
						</Link>
					</Link>
					<Link
						to="/videoeditor"
						className={`duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						} `}
					>
						<TbVideoPlus size="20" />
						<Link to="/videoeditor" className="text-sm ">
							Video Editor
						</Link>
					</Link>
					<Link
						to="/"
						className={`duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						} `}
						onClick={toggleUploadModal}
					>
						<BiCameraMovie size="20" />
						<span className="text-sm ">{`Upload ${
							expand ? "Movie" : ""
						}`}</span>
					</Link>
					<Link
						to="/"
						className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						}`}
						onClick={toggleUploadScriptModal}
					>
						<MdOutlineDescription size="20" />
						<span className="text-sm ">{`${
							expand ? "Upload scripts" : "Add Scripts"
						}`}</span>
					</Link>
					<Link
						to={tokenData ? `/user/${tokenData.userId}` : "#"}
						onClick={(event) => {
							if (!tokenData) {
								toast.error("Please login!!");
								event.preventDefault(); // Prevent the default link behavior if condition is not met
							}
						}}
						className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						}`}
					>
						<CgProfile size="20" />
						<Link
							to={tokenData ? `/user/${tokenData.userId}  ` : "#"}
							onClick={(event) => {
								if (!tokenData) {
									toast.error("Please login!!");
									event.preventDefault(); // Prevent the default link behavior if condition is not met
								}
							}}
							className="text-sm"
						>
							Profile
						</Link>
					</Link>
					
				</ul>
			</nav>
			 
			<nav className="container mx-auto  items-center justify-between p		-2 my-3">
				<h2 className={`font-bold ${expand ? "ml-4" : "text-sm text-center"} `}>
					Theme
				</h2>
				<ul className="border-b  w-full border-gray-200 pb-4">
					<div
						className={`flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							darkMode ? "text-active" : ""
						} ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						}`}
						onClick={setDarkMode}
					>
						<FaMoon size="15" color={darkMode ? "green" : ""} />
						<span className={`cursor-pointer text-sm ${expand ?? "w-full"}`}>
							Dark mode
						</span>
					</div>
					<div
						className={`flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							!darkMode ? "text-active" : ""
						} ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						}`}
						onClick={setLightMode}
					>
						<IoSunnyOutline size="15" color={!darkMode ? "green" : ""} />
						<span className={` text-sm ${expand ?? "w-full"}`}>Light mode</span>
					</div>
			
					{isLoggedIn ? (
						<>
						<Link
						to="/"
						className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						}`}
						
					>
						<FaUser size="20" />
						<span className="text-sm ">
							 {isLoggedIn.username}
						</span>
						
					</Link>
							<Link
						to="/"
						className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						}`}
						onClick={toggleSignoutModal}
					>
						<FaSignOutAlt size="20" />
						<span className="text-sm ">{`${
							expand ? "Sign out" : "Sign out"
						}`}</span>
					</Link>
						</>
					) : (
						<>
						<Link
						to="/"
						className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						}`}
						onClick={toggleSigninModal}
					>
						<LiaSignInAltSolid size="20" />
						<span className="text-sm ">{`${
							expand ? "Sign in" : "Sign in"
						}`}</span>
					</Link>
					<Link
						to="/"
						className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
							expand ? "" : "flex-col justify-center text-xs gap-1 specific"
						}`}
						onClick={toggleSignupModal}
					>
						<HiUserAdd size="20" />
						<span className="text-sm ">{`${
							expand ? "Sign up" : "Sign up"
						}`}</span>
					</Link>
						</>
					)}
				</ul>
			
				
			</nav>
		</section>
	);
};

export default Sidebar;
