import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Delete, Layout,Render } from "../components";
import { getRequest, putRequest } from "../api";
import { decodeToken, isUserIdInArray } from "../utilities/helperfFunction";
import '../components/header/drowpdown.css';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';

let token = localStorage.getItem("token") || null;

interface GenreProps {}

const GenrePage: React.FC<GenreProps> = ({}) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>({});
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ username: "", dob: "" });
    const [userHasPaid, setUserHasPaid] = useState(false);
    const [currentUserHasPaid, setCurrentUserHasPaid] = useState(false);
    const [scripts] = useState([]);
	const [data] = useState<any>([]);
	const [showMoreIndex, setShowMoreIndex] = useState<number | null>(null);
	const nav = useNavigate();
    

    useEffect(() => {
		// let isMounted = true; // Flag to track if the component is mounted

        if (!id) {
            toast.error("Please login first");
            return;
        }
        

        const fetchData = async () => {
            try {
                const result: any = await getRequest("/user/" + id, setLoading);
                setUser(result);
                const response = await axios.get(`https://wecinema.onrender.com/user/payment-status/${id}`);
                setUserHasPaid(response.data.hasPaid);
                const tokenData = decodeToken(token);
                if (tokenData) {
                    const currentUserResponse = await axios.get(`https://wecinema.onrender.com/user/payment-status/${tokenData.userId}`);
                    setCurrentUserHasPaid(currentUserResponse.data.hasPaid);
                }
                setFormData({ username: result.username, dob: result.dob });
			   setLoading(true);
                
                // Fetch user scripts
                // const results: any = await getRequest("video/author/scripts", setLoading);
                // console.log(results);
                // if (isMounted && results) {
                //     // Update state only if the component is still mounted
                //     setScripts(results.map((res: any) => res.script));
                //     setData(results); // Assuming a `videos` state variable
                //     setLoading(false);
                // }
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        // return () => {
		// 	isMounted = false;
		// };
    }, [id]);

    useEffect(() => {
        if (userHasPaid && !currentUserHasPaid) {
        }
    }, [userHasPaid, currentUserHasPaid]);

    const renderAllowedGenres = () => {
        if (!user.allowedGenres) return null;
        
        return user.allowedGenres.map((genre: string) => {
            let bgColor, marginLeft;
            switch (genre) {
                case "G":
                    bgColor = "bg-green-500";
                    marginLeft = "ml-12";
                    break;
                case "PG":
                case "PG-13":
                    bgColor = "bg-blue-500";
                    marginLeft = "ml-4";
                    break;
                case "R":
                    bgColor = "bg-yellow-500";
                    marginLeft = "ml-4";
                    break;
                case "X":
                    bgColor = "bg-red-500";
                    marginLeft = "ml-12";
                    break;
                default:
                    bgColor = "bg-gray-500";
                    marginLeft = "ml-4";
            }
            return (
                <button key={genre} className={`mb-1 ${marginLeft} text-sm sm:text-xl ${bgColor} text-white py-2 px-4 rounded`}>
                    {genre}
                </button>
            );
        });
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await putRequest("/user/edit/" + id, formData, setLoading);
            setUser(result);
            setEditMode(false);
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    }
    const handleScriptMouseEnter = (index: number) => {
		setShowMoreIndex(index);
	};

	const handleScriptMouseLeave = () => {
		setShowMoreIndex(null);
	};

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
                <div className="flex items-center">
                    <div className="w-full h-full -mt-1">
                        <div className="items-center justify-center sm:justify-start flex-col sm:flex-row flex h-full sm:px-8 my-4 mx-auto w-full">
                            <div className="overflow-hidden flex justify-center mt--8 items-center">
                                <img
                                    className="rounded-full bg-white h-16 w-16 sm:h-36 sm:w-36 border-2 p-1 border-white"
                                    src="https://scontent.flhe2-4.fna.fbcdn.net/v/t39.30808-6/445203505_345868328603160_4760708580844450177_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeE8P2dumlbz7izsnsIVcGg8OBz1JUUJV-s4HPUlRQlX6w0dohiahoR1GJWJNrVI7F95g_SqgTiSbotvIX9S-_UU&_nc_ohc=KXBrT5ifmwMQ7kNvgGENLwx&_nc_zt=23&_nc_ht=scontent.flhe2-4.fna&oh=00_AYAhYdSYD9aJQhlbLDin0hTxM4Y6zxbxghYRvSIJxmjuOw&oe=669807E1"
                                    alt="Avatar"
                                />
                            </div>
                            <div>
                                <button className="mb-1 ml-4 text-sm sm:text-xl bg-white-500 text-black py-2 px-4 rounded border-2 border-gray-700">
                                    {user?.followers?.length} Followers
                                </button>
                                <button className="mb-1 ml-4 text-sm sm:text-xl bg-white-500 text-black py-2 px-4 rounded border-2 border-gray-700">
                                    {user?.followers?.length} Videos
                                </button>
                                <button className="mb-1 ml-4 text-sm sm:text-xl bg-white-500 text-black py-2 px-4 rounded border-2 border-gray-700">
                                    {scripts.length} Scripts
                                </button>
                                <button className="mb-1 ml-4 text-sm sm:text-xl bg-white-500 text-black py-2 px-4 rounded border-2 border-gray-700">
                                    {user?.followers?.length} Likes
                                </button>
                                <button className="mb-1 ml-4 text-sm sm:text-xl bg-white-500 text-black py-2 px-4 rounded border-2 border-gray-700">
                                    {user?.bookmarks?.length} Bookmarks
                                </button>

                                {userHasPaid && (
                                    <a href="/hypemodeprofile">
                                        <button className="mb-1 ml-4 text-sm sm:text-xl bg-yellow-500 text-white py-2 px-4 rounded border-2 border-gray-700">
                                            Hypemode
                                        </button>
                                    </a>
                                )}

                                <hr className="border-t border-gray-300 w-full my-2" />
                            </div>
                            {id !== decodeToken(token)?.userId && (
                                <div className="ml-auto flex items-center">
                                    {isUserIdInArray("tokenData?.userId", user?.followers) ? (
                                        <button
                                            disabled={loading}
                                            className="bg-red-600 btn cursor-pointer text-white px-6 md:py-2 py-1 rounded-full"
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
                        {editMode ? (
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="mb-2 p-2 border rounded"
                                />
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="mb-2 p-2 border rounded"
                                />
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded mb-2">
                                    Save
                                </button>
                            </form>
                        ) : (
                            <>
                                <li className="overflow-hidden text-ellipsis font-extrabold text-base sm:text-2xl mb-2">
                                    {user.username}
                                </li>
                                <li className="overflow-hidden text-ellipsis font-normal text-base mb-2">
                                    {user.email}
                                </li>
                                <li className="overflow-hidden text-ellipsis font-normal text-base mb-2">
                                    Date of Birth: {user.dob}
                                </li>
                                <button onClick={handleEdit}>
                                    <FaEdit size="20" />
                                </button>
                            </>
                        )}

                        <hr className="border-t border-gray-300 w-full my-2" />
                    </ul>
                    <ul>
                        <li>
                            <ul>
                                <li>
                                    <h1 style={{ fontSize: '26px', fontFamily: 'Arial, sans-serif', marginBottom: '15px', marginLeft: '50px', marginTop: '10px' }}>Allowed Ratings</h1>
                                    {renderAllowedGenres()}
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div className="right-container">
                    <div style={{ width: '100%' }}>
                        <Delete category="" length={3} data={id} />
                    </div>
                    <div className="left-container">
                    {!loading && (
					<h2 className="text-l font-extrabold text-lg sm:text-xl">Scripts</h2>
				)}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{scripts?.map((script: string, index: number) => (
						<div
							key={index}
							className={`${
								showMoreIndex === index
									? "bg-black text-white bg-opacity-50 overflow-y-auto"
									: "bg-white text-black overflow-y-hidden"
							} overflow-y-hidden hide-scrollbar border w-full max-h-64 text-slate-950 p-4 rounded-sm relative`}
							onMouseEnter={() => handleScriptMouseEnter(index)}
							onMouseLeave={handleScriptMouseLeave}
							onClick={() =>
								nav(`/script/${data[index]._id}`, {
									state: JSON.stringify(data[index]),
								})
							}
						>
							<h2>{data[index].title}</h2>
							{showMoreIndex === index && (
								<button
									className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-2 py-1 rounded-md"
									onClick={() => console.log("Read more clicked")}
								>
									Read More
								</button>
							)}
							<Render htmlString={script} />
						</div>
					))}
				
				</div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default GenrePage;
