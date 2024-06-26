import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-dropdown-select';
import { FaTimes } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GoogleLogin } from 'react-google-login';
import { postRequest } from '../../api';
import { Itoken, decodeToken } from '../../utilities/helperfFunction';
import moment from 'moment';
interface IPopupProps {
	type: string | undefined;
	show?: boolean;
	authorized?: boolean;
	width?: string;
	background?: string;
	height?: string;
	className?: string;
}

const Popup: React.FC<IPopupProps> = React.memo(
	({ type, className, background, show }) => {
		const [token, setToken] = useState<string | null>(
			localStorage.getItem("token") || null
		);
		const [decodedToken, setDecodedToken] = useState<Itoken | null>(null);
		const [isShow, setShow] = useState<boolean>(false);
		const [selectedFile, setSelectedFile] = useState<any>(null);
		const [loading, setLoading] = useState<boolean>(false);
		const [username, setUsername] = useState<string>("");
		const [dob, setDob] = useState("");
		const [rating, setRating] = useState<string>("");
		const [email, setEmail] = useState("");
		const [title, setTitle] = useState("");
		const [description, setDescription] = useState("");
		const [password, setPassword] = useState<string>("");
		const fileInputRef: any = useRef(null);
		const [selectedItems, setSelectedItems] = useState<string[]>([]);
		const clientId = '151531796955-91dinu0eki378anhktdq86mfrbqlhkjj.apps.googleusercontent.com'; // Replace with your Google client ID

		const responseGoogle = async (response: any) => {
			if (response.tokenId) {
			  try {
				setLoading(true);
				const result = await axios.post('/api/auth/google', {
				  token: response.tokenId,
				});
				localStorage.setItem('token', result.data.token);
				setShow(false);
				setTimeout(() => window.location.reload(), 1000);
			  } catch (error) {
				console.error('Login failed:', error);
				toast.error('Google sign-in failed.');
				setLoading(false);
			  }
			}
		  };
		
		  const handleLoginSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			setLoading(true);
			try {
			  const result:any = await postRequest('user/login', { email, password }, setLoading);
			  setToken(result.token);
			  localStorage.setItem('token', result.token);
			  localStorage.setItem('loggedIn', 'true');
			  setShow(false);
			  setTimeout(() => {
				window.location.reload();
			  }, 1000);
			} catch (error) {
			  console.error('Login error:', error);
			  setLoading(false);
			  toast.error('Login failed');
			}
		  };
		
		const handleFileChange = (e: any) => {
			const file = e.target.files[0];

			setSelectedFile(file);

			console.log("Selected File:", selectedFile);
		};
		const handleProcedureContentChange = (content: any) => {
			setDescription(content);
		};
		const handleThumbnailClick = () => {
			fileInputRef?.current.click();
		};
		useEffect(() => {
			setShow(!!type);
			console.log("This is refreshing");
		}, [type]);
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
				setShow(false);
			} catch (error) {
				setLoading(false);

				console.error("Post error:", error);
			}
		};

		const handleVideoUploadSubmit = async (e: any) => {
			e.preventDefault();
			if (decodedToken?.userId) {
				try {
					const formData = new FormData();
					setLoading(true);
					formData.append("file", selectedFile);
					formData.append("upload_preset", "zoahguuq");

					axios
						.post(
							"https://api.cloudinary.com/v1_1/folajimidev/video/upload",
							formData
						)
						.then(async (res: any) => {
							let payload = {
								title,
								description,
								genre: selectedItems.map((category: any) => category.value),
								rating,
								file: res.data["secure_url"],
								author: decodedToken?.userId ?? "33",
							};
							await postRequest("video/create", payload, setLoading);
							setShow(false);
						});
				} catch (error) {
					setLoading(false);

					console.error("Post error:", error);
				}
			} else {
				toast.error("You must log in first before uploading!");
			}
		};
		// console.log(isShow, show);
		const handleScriptUploadSubmit = async (e: any) => {
			e.preventDefault();
			if (decodedToken?.userId) {
				try {
					setLoading(true);
					let payload = {
						title,
						script: description,
						genre: selectedItems.map((category: any) => category.value),
						author: decodedToken?.username ?? "",
					};
					await postRequest("video/scripts", payload, setLoading);
					setShow(false);
				} catch (error) {
					setLoading(false);

					console.error("Post error:", error);
				}
			} else {
				toast.error("You must log in first before uploading!");
			}
		};
		const CAT: any = [
			{ value: "Action", label: "Action" },
			{ value: "Adventure", label: "Adventure" },
			{ value: "Comedy", label: "Comedy" },
			{ value: "Documentary", label: "Documentary" },
			{ value: "Drama", label: "Drama" },
			{ value: "Horror", label: "Horror" },
			{ value: "Mystery", label: "Mystery" },
			{ value: "Romance", label: "Romance" },
			{ value: "Thriller", label: "Thriller" },
		];
		const formats = [
			"header",
			"height",
			"bold",
			"italic",
			"underline",
			"strike",
			"blockquote",
			"list",
			"color",
			"bullet",
			"indent",
			"link",
			"image",
			"align",
			"size",
		];
		const modules = {
			toolbar: [
				[{ size: ["small", false, "large", "huge"] }],
				["bold", "italic", "underline", "strike", "blockquote"],
				[{ list: "ordered" }, { list: "bullet" }],
				["link", "image"],
				[
					{ list: "ordered" },
					{ list: "bullet" },
					{ indent: "-1" },
					{ indent: "+1" },
					{ align: [] },
				],
				[
					{
						color: [
							"#000000",
							"#e60000",
							"#ff9900",
							"#ffff00",
							"#008a00",
							"#0066cc",
							"#9933ff",
							"#ffffff",
							"#facccc",
							"#ffebcc",
							"#ffffcc",
							"#cce8cc",
							"#cce0f5",
							"#ebd6ff",
							"#bbbbbb",
							"#f06666",
							"#ffc266",
							"#ffff66",
							"#66b966",
							"#66a3e0",
							"#c285ff",
							"#888888",
							"#a10000",
							"#b26b00",
							"#b2b200",
							"#006100",
							"#0047b2",
							"#6b24b2",
							"#444444",
							"#5c0000",
							"#663d00",
							"#666600",
							"#003700",
							"#002966",
							"#3d1466",
							"custom-color",
						],
					},
				],
			],
		};

		if (type === "script") {
			return (
				<div
					style={{ background }}
					className={`fixed sm:top-0 z-50 left-0 h-screen w-full flex justify-center items-center ${
						isShow && show ? "visible" : "invisible"
					} ${className}`}
				>
					<div
						className={`fixed top-0 left-0 h-full w-full  ${
							background ?? "bg-black "
						} bg-opacity-90 backdrop-filter backdrop-blur-15 flex items-center justify-center transition-opacity ease-in-out duration-300`}
					>
						<div
							className={`sm:w-2/6 modal min-h-2/6 w-5/6 bg-white rounded-md p-6
              transition-transform transform translate-y-0 ease-in-out relative cursor-pointer shadow-md
              }`}
						>
							<header className="flex gap-4 justify-between items-center">
								<h2>Upload Script</h2>
								<FaTimes onClick={() => setShow(false)} />
							</header>
							<form onSubmit={handleScriptUploadSubmit}>
								<input
									className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
									placeholder="Title"
									// autoFocus
									type="text"
									value={title}
									onChange={(e: any) => setTitle(e.target.value)}
								/>

								<div
									className="rounded-md  w-full mt-3  outline-none"
									style={{ height: "204px" }}
								>
									<ReactQuill
										theme="snow"
										modules={modules}
										formats={formats}
										placeholder="write your script here...."
										onChange={handleProcedureContentChange}
										style={{ height: "109px", width: "100%" }}
										className="rounded-md"
									></ReactQuill>
								</div>
								<Select
									values={selectedItems}
									options={CAT}
									placeholder="Select gener(s)..."
									required
									multi
									className="rounded-md px-4 py- w-full mt- border outline-none"
									onChange={(values: any) => {
										setSelectedItems(values);
									}}
								/>
								  
								<button
									disabled={loading}
									className="rounded-md px-4 py-2 w-full my-3 bg-blue-500 text-white"
								>
									Upload
								</button>
							</form>
						</div>
					</div>
				</div>
			);
		}
		if (type === 'login') {
			return (
			  <div className={`fixed sm:top-0 z-50 left-0 sm:h-screen w-full flex justify-center items-center ${isShow && show ? 'visible' : 'invisible'} ${className}`} style={{ background }}>
				<div className="fixed top-0 left-0 h-full w-full bg-black bg-opacity-90 backdrop-filter backdrop-blur-15 flex items-center justify-center transition-opacity ease-in-out duration-300">
				  <div className="sm:w-2/6 modal min-h-2/6 w-5/6 bg-white rounded-md p-6 transition-transform transform translate-y-0 ease-in-out relative cursor-pointer shadow-md">
					<header className="flex gap-4 justify-between items-center">
					  <h2>Sign in to Wecinema</h2>
					  <FaTimes onClick={() => setShow(false)} />
					</header>
					<form onSubmit={handleLoginSubmit}>
					  <input className="rounded-md px-4 py-2 w-full mt-3 border outline-none" placeholder="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
					  <input className="rounded-md px-4 py-2 w-full mt-3 border outline-none" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
					  <button disabled={loading} className="rounded-md px-4 py-2 w-full my-3 bg-blue-500 text-white">Sign in</button>
					</form>
					<GoogleLogin
					  clientId={clientId}
					  buttonText="Login with Google"
					  onSuccess={responseGoogle}
					  onFailure={responseGoogle}
					  cookiePolicy={'single_host_origin'}
					  style={{ width: '100%', justifyContent: 'center' }}
					/>
				  </div>
				</div>
			  </div>
			);
		  }
		if (type === "video") {
			return (
				<div
					style={{ background }}
					className={`fixed sm:top-0 z-50 left-0 sm:h-screen w-full flex justify-center items-center ${
						isShow && show ? "visible" : "invisible"
					} ${className}`}
				>
					<div
						className={`fixed top-0 left-0 h-full w-full  ${
							background ?? "bg-black "
						} bg-opacity-90 backdrop-filter backdrop-blur-15 flex items-center justify-center transition-opacity ease-in-out duration-300`}
					>
						<div
							className={`sm:w-2/6 modal min-h-2/6 w-5/6 bg-white rounded-md p-6
              transition-transform transform translate-y-0 ease-in-out relative cursor-pointer shadow-md
              }`}
						>
							<header className="flex gap-4 justify-between items-center">
								<h2>Upload Video</h2>
								<FaTimes onClick={() => setShow(false)} />
							</header>
							<form onSubmit={handleVideoUploadSubmit}>
								<input
									className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
									placeholder="Title"
									// autoFocus
									type="text"
									value={title}
									onChange={(e: any) => setTitle(e.target.value)}
								/>
								<textarea
									className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
									placeholder="Description..."
									// autoFocus
									rows={5}
									value={description}
									onChange={(e: any) => setDescription(e.target.value)}
								/>
							    {/* <label htmlFor="rating">Select Rating:</label> */}

								<Select
									values={selectedItems}
									options={CAT}
									placeholder="Select genr(s).."

									required
									multi
									className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
									onChange={(values: any) => {
										setSelectedItems(values);
									}}
								/>
								
								<div>
    {/* <label htmlFor="rating">Select Rating:</label> */}
    <select
        id="rating"
		required
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
    >
        <option value="">Select Rating</option>
        <option value="p">G</option>
        <option value="pg">PG</option>
        <option value="pg-13">PG-13</option>
        <option value="RS">RS</option>
        <option value="	X">X</option>


    </select>
</div>
								<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px', margin: 'auto', marginTop: '10PX' }}>
									<div className="relative">
										<input
											// autoFocus
											type="file"
											accept="video/*"
											className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
											onChange={handleFileChange}
											ref={fileInputRef}
										/>
										<div
											className="bg-gray-100 p-4 rounded-md mt-5 cursor-pointer"
											onClick={handleThumbnailClick}
										>
											{selectedFile ? (
												<video
													src={URL.createObjectURL(selectedFile)}
													height={100}
													width={100}
													className=" object-cover"
												/>
											) : (
												<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#555" className="bi bi-upload" viewBox="0 0 16 16">
												<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
												<path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
											  </svg>
											)}
										</div>
									</div>
									<span
										onClick={handleThumbnailClick}
										className="text-gray-600 mt-5"
									>
										{selectedFile ? "Change Video" : "Browser to upload movie"}
									</span>
									<span
										onClick={handleThumbnailClick}
										className="text-gray-600 mt-5"
									>
										{selectedFile ? "" : "No file Selected"}
									</span>
								</div>
								
								<button
									disabled={loading}
									className="rounded-md px-4 py-2 w-full my-3 bg-blue-500 text-white"
								>
									Upload
								</button>
							</form>{" "}
						</div>
					</div>
				</div>
			);
		}
		if (type === "register") {
			return (
				<div
					style={{ background }}
					className={`fixed sm:top-0 z-50 left-0 sm:h-screen w-full flex justify-center items-center ${
						isShow && show ? "visible" : "invisible"
					} ${className}`}
				>
					<div
						className={`fixed top-0 left-0 h-full w-full  ${
							background ?? "bg-black "
						} bg-opacity-90 backdrop-filter backdrop-blur-15 flex items-center justify-center transition-opacity ease-in-out duration-300`}
					>
						<div
							className={`sm:w-2/6 modal min-h-2/6 w-5/6 bg-white rounded-md p-6
              transition-transform transform translate-y-0 ease-in-out relative cursor-pointer shadow-md
              }`}
						>
							<header className="flex gap-4 justify-between items-center">
								<h2>Sign up to Wecinema</h2>
								<FaTimes onClick={() => setShow(false)} />
							</header>
							<form onSubmit={handleRegisterSubmit}>
								<input
									className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
									placeholder="Username"
									type="text"
									// autoFocus
									value={username}
									onChange={(e: any) => setUsername(e.target.value)}
								/>
								<input
									className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
									placeholder="email "
									type="email "
									// autoFocus
									value={email}
									onChange={(e: any) => setEmail(e.target.value)}
								/>
								<input
									className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
									placeholder="**************** "
									type="password "
									// autoFocus
									value={password}
									onChange={(e: any) => setPassword(e.target.value)}
								/>
								<input
									className="rounded-md px-4 py-2 w-full mt-3 border outline-none"
									placeholder="date of birth"
									type="date"
									// autoFocus
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
									<a
										href="#"
										className=" my-3 text-center italic hover:text-blue-600"
									>
										Already have an account?
									</a>
								</div>
							</form>
						</div>
					</div>
				</div>
			);
		}
		if (type === "logout") {
			return (
				<div
					style={{ background }}
					className={`fixed sm:top-0 z-50 left-0 sm:h-screen w-full flex justify-center items-center ${
						isShow && show ? "visible" : "invisible"
					} ${className}`}
				>
					<div
						className={`fixed top-0 left-0 h-full w-full  ${
							background ?? "bg-black "
						} bg-opacity-90 backdrop-filter backdrop-blur-15 flex items-center justify-center transition-opacity ease-in-out duration-300`}
					>
						<div
							className={`sm:w-2/6 modal min-h-2/6 w-5/6 bg-white rounded-md p-6
              transition-transform transform translate-y-0 ease-in-out relative cursor-pointer shadow-md
              }`}
						>
							<header className="flex  gap-4 justify-between items-center my-3">
								<h2>Are you sure you want to log Out?</h2>
							</header>
							<form onSubmit={handleLogoutSubmit} className="flex gap-2">
								<button
									type="button"
									className="rounded-md px-4 py-2 w-full my-3 bg-white 500"
									onClick={() => {
										setShow(false);
									}}
								>
									No
								</button>
								<button className="rounded-md px-4 py-2 w-full my-3 bg-blue-500 text-white">
									Yes
								</button>
							</form>
						</div>
					</div>
				</div>
			);
		}
		if (type === "") {
			return <div>Helloo</div>;
		}
	}
);
Popup.defaultProps = {
	background: "linear-gradient(to right, #ffd700, #ffff00)",
	type: "",
}; 

export default Popup;