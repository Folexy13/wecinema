import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Header, Modal, Sidebar } from "..";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { GoogleLogin } from "@react-oauth/google";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import { FaSignInAlt, FaSignOutAlt, FaTimes, FaUserCircle } from "react-icons/fa";
import { categories as CAT } from "../../App";
import { MdOutlineHome } from "react-icons/md";
import {SlGraph } from "react-icons/sl";
import { GrUpload } from "react-icons/gr";
import { FaMoon } from "react-icons/fa6";
import { IoSunnyOutline } from "react-icons/io5";
import { postRequest } from "../../api";
import moment from "moment";
import { Itoken, decodeToken } from "../../utilities/helperfFunction";

export const categories = [
	"Picks",
	"My Feed",
	"Gaming",
	"Live",
	"Sports",
	"Virals",
	"Podcasts",
	"Finance",
	"Leaderboard",
	"Vlogs",
	"News",
	"Science",
	"Music",
	"Entertainment",
	"Cooking",
];
interface LayoutProps {
	hasHeader?: boolean;
	children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children, hasHeader }) => {
	const fileInputRef: any = useRef(null);

	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const handleThumbnailClick = () => {
		fileInputRef?.current.click();
	};
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("token") || null
	);
	const [decodedToken, setDecodedToken] = useState<Itoken | null>(null);
	const isDarkMode = localStorage.getItem("isDarkMode") ?? false;
	const [darkMode, setDarkMode] = useState<boolean>(!!isDarkMode);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [show, setShow] = useState<boolean>(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const handleFileChange = (e: any) => {
		const file = e.target.files[0];

		setSelectedFile(file);

		console.log("Selected File:", selectedFile);
	};
	// Update screenWidth when the window is resized
	const handleResize = () => {
		setScreenWidth(window.innerWidth);
	};
	// Attach event listener for window resize
	useEffect(() => {
		window.addEventListener("resize", handleResize);

		// Clean up the event listener on component unmount
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []); // Empty dependency array ensures the effect runs only once on mount
	useEffect(() => {
		// Decode token when the component mounts or when the token changes
		const decoded = decodeToken(token);
		setDecodedToken(decoded);
	}, [token]);
	const [show2, setShow2] = useState<boolean>(false);
	const [modal, setModal] = useState<number>(0);
	const [show3, setShow3] = useState<boolean>(false);
	const [show4, setShow4] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [username, setUsername] = useState<string>("");
	const [dob, setDob] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const setLightMode = () => {
		localStorage.removeItem("isDarkMode");
		setDarkMode(false);
		console.log(modal);
	};
	
	const setDarkiMode = () => {
		localStorage.setItem("isDarkMode", "dark");

		setDarkMode(true);
	};
	const handleLoginSubmit = async (e: any) => {
		e.preventDefault();
		try {
			setLoading(true);
			let payload = {
				email,
				password,
			};
			const result: any = await postRequest("user/login", payload, setLoading);
			console.log("Post success:", result);
			setShow(false);
			setToken(result.token);
			localStorage.setItem("token", result.token);
			localStorage.setItem("loggedIn", "true");
		} catch (error) {
			setLoading(false);

			console.error("Post error:", error);
		}
	};
	const handleLogoutSubmit = async (e: any) => {
		e.preventDefault();
		localStorage.removeItem("token");
		localStorage.removeItem("loggedIn");
		setTimeout(() => {
			window.location.reload();
		}, 500);
	};
	const handleRegisterSubmit = async (e: any) => {
		e.preventDefault();
		try {
			setLoading(true);
			let payload = {
				email,
				password,
				username,
				dob: moment(dob, "DD-MM-YYYY").format("MMM DD, YYYY"),
			};
			const result = await postRequest("user/register", payload, setLoading);
			console.log("Post success:", result);
			setShow2(false);
		} catch (error) {
			setLoading(false);

			console.error("Post error:", error);
		}
	};
	const handleUploadSubmit = async (e: any) => {
		e.preventDefault();
		try {
			setLoading(true);
			let payload = {
				email,
				password,
			};
			const result = await postRequest("user/login", payload, setLoading);
			console.log("Post success:", result);
			setShow3(false);
		} catch (error) {
			setLoading(false);

			console.error("Post error:", error);
		}
	};
	const LoginModal: React.FC = () => (
		<Modal
			show={show}
			background="linear-gradient(to right, #ffd700, #ffff00)"
		>
			<header className="flex  gap-4 justify-between items-center">
				<h2>Sign in to Wecinema</h2>
				<FaTimes
					onClick={() => {
						setShow(false), setModal(0);
					}}
				/>
			</header>
			<form onSubmit={handleLoginSubmit}>
				<input
					className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
					placeholder="email "
					type="email"
					value={email}
					onChange={(e: any) => setEmail(e.target.value)}
				/>
				<input
					className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
					placeholder="**************** "
					type="password"
					value={password}
					onChange={(e: any) => setPassword(e.target.value)}
				/>
				<button
					disabled={loading}
					className="rounded-md px-4 py-2 w-full my-3 bg-blue-500 text-white"
				>
					Sign in
				</button>
				<div className="flex sm:flex-row flex-col gap-4 justify-between items-center">
					<a
						href="#"
						className=" sm:my-3 text-center italic hover:text-blue-600"
					>
						Forgot password?
					</a>
					<a
						href="#"
						className=" sm:my-3 text-center italic hover:text-blue-600"
					>
						Don't have an account?
					</a>
				</div>
				<hr className="my-4" />
				<p className="text-center my-2 ">Alternatively Log in with:</p>
				{/* <GoogleOAuthProvider clientId="<your_client_id>">
					<GoogleLogin
						onSuccess={(credentialResponse) => {
							console.log(credentialResponse);
						}}
						onError={() => {
							console.log("Login Failed");
						}}
					/>
				</GoogleOAuthProvider> */}
			</form>
		</Modal>
	);
	const LogoutModal: React.FC = () => (
		<Modal show={show4}>
			<header className="flex  gap-4 justify-between items-center my-3">
				<h2>Are you sure you want to log Out?</h2>
			</header>
			<form onSubmit={handleLogoutSubmit} className="flex gap-2">
				<button
					type="button"
					className="rounded-md px-4 py-2 w-full my-3 bg-white 500"
					onClick={() => {
						setShow4(false);
					}}
				>
					No
				</button>
				<button className="rounded-md px-4 py-2 w-full my-3 bg-blue-500 text-white">
					Yes
				</button>
			</form>
		</Modal>
	);
	const RegisterModal: React.FC = () => (
		<Modal show={show2}>
			<header className="flex gap-4 justify-between items-center">
				<h2>Sign up to Wecinema</h2>
				<FaTimes onClick={() => setShow2(false)} />
			</header>
			<form onSubmit={handleRegisterSubmit}>
				<input
					className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
					placeholder="Username"
					type="text"
					value={username}
					onChange={(e: any) => setUsername(e.target.value)}
				/>
				<input
					className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
					placeholder="email "
					type="email "
					value={email}
					onChange={(e: any) => setEmail(e.target.value)}
				/>
				<input
					className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
					placeholder="**************** "
					type="password "
					value={password}
					onChange={(e: any) => setPassword(e.target.value)}
				/>
				<input
					className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
					placeholder="date of birth"
					type="date"
					value={dob}
					onChange={(e: any) => setDob(e.target.value)}
				/>
				<button
					disabled={loading}
					className="rounded-md px-4 py-2 w-full my-3 bg-blue-500 text-white"
				>
					Sign up
				</button>
				<div className="flex gap-4 justify-between items-center">
					<a href="#" className=" my-3 text-center italic hover:text-blue-600">
						Already have an account?
					</a>
				</div>
			</form>
		</Modal>
	);
	const UploadVideoModal: React.FC = () => (
		<Modal show={show3}>
			<header className="flex gap-4 justify-between items-center">
				<h2>Upload Video</h2>
				<FaTimes onClick={() => setShow3(false)} />
			</header>
			<form onSubmit={handleUploadSubmit}>
				<input
					className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
					placeholder="Title"
					type="text"
				/>
				<textarea
					className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
					placeholder="Description..."
					rows={10}
				/>
				<select className="rounded-md px-4 py-2 w-full mt-3 border outline-none">
					<option value="" selected disabled>
						Select a category
					</option>
					{CAT.map((val: string, index: number) => (
						<option key={index}>{val}</option>
					))}
				</select>
				<div className="flex items-center space-x-2">
					<div className="relative">
						<input
							type="file"
							accept="image/*"
							className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
							onChange={handleFileChange}
							ref={fileInputRef}
						/>
						<div
							className="bg-gray-100 p-4 rounded-md cursor-pointer"
							onClick={handleThumbnailClick}
						>
							{selectedFile ? (
								<img
									src={URL.createObjectURL(selectedFile)}
									alt="Thumbnail Preview"
									height={100}
									width={100}
									className=" object-cover rounded-full"
								/>
							) : (
								<svg
									className="w-6 h-6 text-gray-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
							)}
						</div>
					</div>
					<span onClick={handleThumbnailClick} className="text-gray-600">
						{selectedFile ? "Change Thumbnail" : "Add Thumbnail"}
					</span>
				</div>
				<button className="rounded-md px-4 py-2 w-full my-3 bg-blue-500 text-white">
					Upload
				</button>
			</form>
		</Modal>
	);
	return (
		<div className=" text-lg md:text-sm sm:text-xs">
			<ToastContainer />
			<Header
				expand={expanded}
				isMobile={screenWidth <= 1120}
				toggler={() => setExpanded(!expanded)}
				darkMode={darkMode}
				toggleSigninModal={() => setShow(!show)}
				toggleSignupModal={() => setShow2(!show2)}
				toggleSignoutModal={() => setShow4(!show4)}
				isLoggedIn={decodedToken}
			/>
			{expanded && screenWidth <= 1120 && (
				<div className="fixed  top-0 left-0 z-40 h-full w-full  bg-black bg-opacity-90 backdrop-filter backdrop-blur-15 flex items-center justify-center transition-opacity ease-in-out duration-300">
					<section
						// style={{ marginTop: 67 }}
						className={`text-blue bar mt-16 inset-0 sm:w-1/5 overflow-auto fixed border-r border-gray-200 
						w-1/6
					 ${darkMode ? "bg-dark" : "bg-light"}  ${
							darkMode ? "text-dark" : "text-light"
						} `}
					>
						<nav
							className={` flex items-center justify-between p-2 my-3 pb-6 `}
						>
							<ul className={`border-b  w-full border-gray-200 pb-4 `}>
								<li
									className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
									}`}
								>
									<MdOutlineHome size="20" />
									<a href="#" className="text-sm ">
										Home
									</a>
								</li>
								<li
									className={`duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
									} `}
								>
									<SlGraph size="20" />
									<a href="#" className="text-sm ">
										Hype mode
									</a>
								</li>
								<li
									className={`duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
									} `}
									onClick={()=>setShow3(!show3)}
								>
									<GrUpload size="20" />
									<span className="text-sm ">{`Upload ${
										expanded ? "Movie" : ""
									}`}</span>
								</li>
								<li
									className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
									}`}
								>
									<FaUserCircle size="20" />
									<a href="#" className="text-sm ">
										Profile
									</a>
								</li>
							</ul>
						</nav>
						<nav className="container mx-auto  items-center justify-between  p-2 my-3 ">
							<h2 className={`font-bold `}>Generes</h2>
							<ul className="border-b   border-gray-200 pb-4">
								{categories.map((val: string, index: number) => (
									<li
										key={index}
										className={`duration-75 flex gap-4  mx-4 my-2 items-center  `}
									>
										<div className="relative rounded-full w-32px h-32px box-border flex-shrink-0 block">
											<div
												className="items-center rounded-full flex-shrink-0 justify-center bg-center bg-no-repeat bg-cover flex"
												style={{
													width: 32,
													height: 32,
													backgroundImage:
														"url('data:image/jpeg;base64,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')",
												}}
												title="Fresh and Fit"
											></div>
										</div>
										<a href="#" className="text-sm">
											{val}
										</a>
									</li>
								))}
							</ul>
						</nav>
						<nav className="container mx-auto  items-center justify-between p-2 my-3 ">
							<h2 className={`font-bold`}>Theme</h2>
							<ul className="border-b  w-full border-gray-200 pb-4">
								<li
									className={`flex gap-4  mx-4 my-2 items-center ${
										darkMode ? "text-active" : ""
									}`}
									onClick={setDarkiMode}
								>
									<FaMoon size="20" color={darkMode && "green"} />
									<a href="#" className="text-sm w-full">
										Dark mode
									</a>
								</li>
								<li
									className={`flex gap-4  mx-4 my-2 items-center ${
										!darkMode ? "text-active" : ""
									}`}
									onClick={setLightMode}
								>
									<IoSunnyOutline size="20" color={!darkMode && "green"} />
									<a href="#" className="text-sm w-full">
										Light mode
									</a>
								</li>
							</ul>
						</nav>
						<nav className="container mx-auto  items-center justify-between p-2 my-3 ">
							<ul className="border-b  w-full border-gray-200 pb-4 ">
								<li
									onClick={() => setShow(!show)}
									className={`flex gap-4  mx-4 my-2 items-center text-sm hover:text-green-500`}
								>
									<FaSignInAlt size="16" className="hover:text-green-500" />
									Sign In
								</li>
								<li
									onClick={() => setShow2(!show2)}
									className={`flex gap-4  mx-4 my-2 items-center text-sm hover:text-green-500`}
								>
									<FaSignOutAlt size="16" className="hover:text-green-500" />
									Sign Up
								</li>
							</ul>
						</nav>
					</section>
				</div>
			)}
			<div className="flex">
				<Sidebar
					expand={expanded && screenWidth > 1120}
					setLightMode={setLightMode}
					setDarkMode={setDarkiMode}
					darkMode={darkMode}
					toggleUploadModal={() => setShow3(!show3)}
				/>
				<main
					className={`block main min-h-screen mt-12 ${
						darkMode ? "body-dark text-dark" : "body-light text-light"
					}  bg-gray-200 w-full `}
					style={{ marginLeft: `${expanded ? "16.8%" : "150px"}` }}
				>
					{hasHeader && (
						<header
							style={{
								width: `${expanded && screenWidth > 1120 ? "83.3%" : "91.6%"}`,
								marginTop: 41,
							}}
							className={`z-30 flex gap-2 p-3 hh bg-white fixed overflow-x-auto ${
								expanded && screenWidth > 1120 ? "" : "w-full"
							} ${darkMode && "bg-dark"}`}
						>
							{categories.map((val: string, i: number) => (
								<div
									key={i}
									className={`${
										darkMode && "text-dark body-dark cursor-pointer"
									}  flex whitespace-nowrap w-full items-center text-xs rounded-xl px-4 py-1 border bg-gray-200`}
								>
									{val}
								</div>
							))}
						</header>
					)}
					<LoginModal />
					<RegisterModal />
					<UploadVideoModal />
					<LogoutModal />
					{children}

					{/* //header */}
				</main>
			</div>
		</div>
	);
};

Layout.defaultProps = {
	hasHeader: true,
};

export default Layout;
