import React, { ReactNode, useEffect, useState } from "react";
import { Header, Modal, Sidebar } from "..";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { GoogleLogin } from "@react-oauth/google";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { TbVideoPlus } from "react-icons/tb";
import { FaMoon} from "react-icons/fa6";
import { IoSunnyOutline } from "react-icons/io5";
import "quill/dist/quill.snow.css";
import { Itoken, decodeToken } from "../../utilities/helperfFunction";
import { Link,useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { RiMovie2Line } from "react-icons/ri";
import { MdOutlineDescription } from "react-icons/md"
import { BiCameraMovie } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";

export const theme = [
	"Love",
	"Redemption",
	"Family",
	"Death",
	"Oppression",
	"Corruption",
	"Survival",
	"Revenge",
	"Death",
	"Justice",
	"Perseverance",
	"War",
	"Bravery",
	"Freedom",
	"Friendship",
	"Hope",
	"Society",
	"Isolation",
	"Peace",
];
interface LayoutProps {
	hasHeader?: boolean;
	children: ReactNode;
	expand: boolean;
}
const Layout: React.FC<LayoutProps> = ({ children, hasHeader,expand, }) => {
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);

	const [token, _] = useState<string | null>(
		localStorage.getItem("token") || null
	);
	const [decodedToken, setDecodedToken] = useState<Itoken | null>(null);
	const isDarkMode = localStorage.getItem("isDarkMode") ?? false;
	const [darkMode, setDarkMode] = useState<boolean>(!!isDarkMode);
	const [expanded, setExpanded] = useState<boolean>(false);
	const [modalShow, setModalShow] = useState(false);
	const [type, setType] = useState("");
	const [show, setShow] = useState<boolean>(false);
    const nav = useNavigate();

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

		// Clean-up function
		return () => {
			// Clear the decoded token when the component unmounts
			setDecodedToken(null);
		};
	}, [token]);

	const setLightMode = () => {
		localStorage.removeItem("isDarkMode");
		setDarkMode(false);
	};
	console.log(show, type);
	const setDarkiMode = () => {
		localStorage.setItem("isDarkMode", "dark");
		setDarkMode(true);
	};
	const handleType = (str: string) => {
		setType(str);
		setModalShow(!modalShow);
	};

	useEffect(() => {
		setShow(!!type);
		console.log("This is gbangbadun");
	}, [type, modalShow]);

	return (
		<div className=" text-lg md:text-sm sm:text-xs">
			<ToastContainer />
			<Header
				expand={expanded}
				isMobile={screenWidth <= 420}
				toggler={() => setExpanded(!expanded)}
				darkMode={darkMode}
				
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
								<Link
									to="/"
									className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
									}`}
								>
									<IoMdHome size="20" />
									<Link to="/" className="text-sm ">
										Home
									</Link>
								</Link>
								<Link
									to="/hypemode"
									className={`duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
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
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
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
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
									} `}
									onClick={() => handleType("video")}
								>
									<BiCameraMovie size="20" />
									<span className="text-sm ">{`Upload ${
										expanded ? "Movie" : ""
									}`}</span>
								</Link>
								<Link
									to="/"
									className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
									}`}
									onClick={() => handleType("script")}
								>
									<MdOutlineDescription size="20" />
									<span className="text-sm ">{`${
										expanded ? "Upload scripts" : "Add Scripts"
									}`}</span>
								</Link>
								<Link
									to={"/user/" + decodedToken?.userId}
									className={` duration-75 flex gap-4  mx-4 my-2 cursor-pointer items-center ${
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
									}`}
								>
									<CgProfile size="20" />
									<Link
										to={"/user/" + decodedToken?.userId}
										className="text-sm "
									>
										Profile
									</Link>
								</Link>
							</ul>
						</nav>
						{/* <nav className="container mx-auto  items-center justify-between  p-2 my-3">
							<h2
								className={`font-bold ${
									expanded ? "" : "text-sm text-center"
								} `}
							>
								Generes
							</h2>
							<ul className="border-b   border-gray-200 pb-4">
								{categories.map((val: string, index: number) => (
									<li
										key={index}
										className={`duration-75 flex gap- mx-4 my-2 cursor-pointer items-center ${
											expanded
												? ""
												: "flex-col justify-center text-xs gap-1 specific"
										} `}
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
										<Link to="#" className="text-sm">
											{val}
										</Link>
									</li>
								))}
							</ul>
						</nav> */}
						<nav className="container mx-auto  items-center justify-between p-2 my-3">
							<h2
								className={`font-bold ${
									expanded ? "ml-4" : "text-sm text-center ml-4"
								} `}
							>
								Theme
							</h2>
							<ul className="border-b  w-full border-gray-200 pb-4">
								<div
									onClick={setDarkiMode}
									className={`flex gap-4  mx-4 my-2 cursor-pointer items-center ${
										darkMode ? "text-active" : ""
									} ${
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
									}`}
								>
									<FaMoon size="20" color={darkMode ? "green" : ""} />
									<span
										className={`cursor-pointer text-sm ${expanded ?? "w-full"}`}
									>
										Dark mode
									</span>
								</div>
								<div
									className={`flex gap-4  mx-4 my-2 cursor-pointer items-center ${
										!darkMode ? "text-active" : ""
									} ${
										expanded
											? ""
											: "flex-col justify-center text-xs gap-1 specific"
									}`}
									onClick={setLightMode}
								>
									<IoSunnyOutline size="20" color={!darkMode ? "green" : ""} />
									<span className={` text-sm ${expanded ?? "w-full"}`}>
										Light mode
									</span>
								</div>
							</ul>
						</nav>
						<nav className="container mx-auto  items-center justify-between p-2 my-3 ">
							<ul className="border-b  w-full border-gray-200 pb-4 ">
								<li
									onClick={() => handleType("login")}
									className={`flex gap-4  mx-4 my-2 items-center text-sm hover:text-green-500`}
								>
									<FaSignInAlt size="16" className="hover:text-green-500" />
									Sign In
								</li>
								<li
									onClick={() => handleType("register")}
									className={`flex gap-4  mx-4 my-2 items-center text-sm hover:text-green-500`}
								>
									<FaSignOutAlt size="16" className="hover:text-green-500" />
									Sign Up
								</li>
								<li
									onClick={() => handleType("logout")}
									className={`flex gap-4  mx-4 my-2 items-center text-sm hover:text-green-500`}
								>
									<FaSignOutAlt size="16" className="hover:text-green-500" />
									Log out
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
					toggleSigninModal={() => handleType("login")}
					toggleSignupModal={() => handleType("register")}
					toggleSignoutModal={() => handleType("logout")}
					darkMode={darkMode}
					toggleUploadModal={() => handleType("video")}
					toggleUploadScriptModal={() => handleType("script")}
					isLoggedIn={decodedToken}
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
								marginTop: 25,
							}}
							className={`z-30 flex gap-2 p-3 hh bg-white fixed overflow-x-auto ${
								expanded && screenWidth > 1120 ? "" : "w-full"
							} ${darkMode && "bg-dark"}`}
						>
						   {theme.map((val: string, index: number) => (
                                    <li
                                        key={index}
                                        className={`duration-75 flex gap-4 mx-4 my-2 cursor-pointer items-center ${
                                            expand ? "" : "flex-col justify-center text-xs gap-1 specific"
                                        } `}
                                    >
                                        <div
                                            onClick={() => nav("/themes/" + val)}
                                            className="relative rounded-full w-32px h-32px box-border flex-shrink-0 block"
                                        >
                                            <div
                                                className="items-center rounded-full flex-shrink-0 justify-center bg-center bg-no-repeat bg-cover flex"
                                                style={{
                                                    width: 12,
                                                    height: 6,
                                                }}
                                                title="Fresh and Fit"
                                            ></div>
                                        </div>
                                        <Link to="#" className="text-sm">
                                            {val}
                                        </Link>
                                    </li>
                                ))}
						</header>
					)}
					<Modal type={type} authorized={!!token} show={modalShow} />
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
