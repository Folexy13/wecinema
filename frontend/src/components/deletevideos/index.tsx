import React, { useEffect, useState } from "react";
import { MdVerifiedUser } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import VideoThumbnail from "react-video-thumbnail";
import { getRequest, deleteRequest, patchRequest } from "../../api";
import {
    formatDateAgo,
    generateSlug,
    truncateText,
} from "../../utilities/helperfFunction";

interface DeleteProps {
    title?: string;
    type?: string;
    data?: any;
    category?: string;
    length?: number;
    isFirst?: boolean;
    isGalleryPage?: boolean; // New prop to indicate if it's a gallery page
}

const Delete: React.FC<DeleteProps> = ({
    title,
    isFirst,
    data,
    category,
    isGalleryPage = true, // Default to false if not provided
}) => {
    const nav = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [videos, setVideos] = useState<any>([]);
    const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true; 

        (async () => {
            setLoading(true);
            const result = !data
                ? await getRequest("video/all", setLoading)
                : await getRequest("video/all/" + data, setLoading);

            if (isMounted && result) {
                setVideos(result);
                setLoading(false);
            }
        })();

        return () => {
            isMounted = false;
        };
    }, [category]);

    const filteredVideo = (category?: string) => {
        return videos.filter((v: any) =>
            category ? v.genre.includes(category) : v
        );
    };

    const handleVideoClick = (video: any) => {
        nav(video.slug ?? "/video/" + generateSlug(video._id), {
            state: video,
        });
        localStorage.setItem("video", JSON.stringify(video));
    };

    const handleSelectVideo = (videoId: string) => {
        setSelectedVideos((prevSelected) =>
            prevSelected.includes(videoId)
                ? prevSelected.filter((id) => id !== videoId)
                : [...prevSelected, videoId]
        );
    };

    const handleOpenDeleteConfirmation = () => {
        setShowDeleteConfirmation(true);
    };

    const handleDeleteSelectedVideos = async () => {
        handleOpenDeleteConfirmation();
    };
    const handlePublishVideo = async (videoId: string) => {
        try {
            setLoading(true);
            await patchRequest(`/video/publish/${videoId}`, setLoading,setLoading);
            setVideos((prevVideos:any) =>
                prevVideos.map((video: any) =>
                    video._id === videoId ? { ...video, status: true } : video
                )
            );
        } catch (error) {
            console.error("Error publishing video:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnpublishVideo = async (videoId: string) => {
        try {
            setLoading(true);
            await patchRequest(`/video/unpublish/${videoId}`, setLoading,setLoading);
            setVideos((prevVideos:any) =>
                prevVideos.map((video: any) =>
                    video._id === videoId ? { ...video, status: false } : video
                )
            );
        } catch (error) {
            console.error("Error unpublishing video:", error);
        } finally {
            setLoading(false);
        }
    };

    
    const handleConfirmDelete = async () => {
        try {
            setLoading(true);
            for (const videoId of selectedVideos) {
                await deleteRequest(`/video/delete/${videoId}`, setLoading);
            }
            setVideos((prevVideos:any) => prevVideos.filter((video: any) => !selectedVideos.includes(video._id)));
            setSelectedVideos([]);
        } catch (error) {
            console.error("Error deleting videos:", error);
        } finally {
            setLoading(false);
            setShowDeleteConfirmation(false);
        }
    };

    return (
        <div className={`${isFirst ? "mt-20" : ""} z-1 relative p-2 flex flex-wrap border-b border-blue-200 sm:mx-4 pb-4`}>
            <div className="mt-1 w-full sm:px-4 py-2 flex justify-between items-center">
                <h2 className="text-l font-extrabold text-lg sm:text-xl">{title}</h2>
                {filteredVideo(category).length > 6 && title && (
                    <a
                        href="#"
                        className={` ${!title && "float-right"} hover:bg-green-700 whitespace-nowrap hover:text-white hover:border-green-700 border border-green-700 py-1 rounded-xl px-4 cursor-pointer`}
                    >
                        View all
                    </a>
                )}
            </div>
            <div className="flex flex-wrap w-full">
    {filteredVideo(category).map((video: any, index: any) => (
        <div key={index} style={{ maxWidth: "30%" }} className="cursor-pointer gallery relative flex-wrap border-gray-200 w-full p-2">
            <div onClick={() => handleVideoClick(video)} className="thumbnail relative overflow-hidden">
                <VideoThumbnail videoUrl={video.file} className="border-gray-200 rounded-xl w-full" />
            </div>
            <div className="footer flex-1 block">
              
                <a href="#" className="inline-flex max-w-max overflow-hidden">
                    <h3 className="text-base font-semibold leading-5 my-2">{truncateText(video.title, 60)}</h3>
                </a>
                {isGalleryPage && (
                    <input
                        type="checkbox"
                        checked={selectedVideos.includes(video._id)}
                        onChange={() => handleSelectVideo(video._id)}
                        className="mr-2 mx-2"
                    />
                )}
                <address className="flex items-center justify-between mt-8px">
                    
                    <a href="#" className="flex w-full overflow-hidden relative items-center">
                        
                        <div className="relative rounded-full w-32px box-border flex-shrink-0 block">
                            <div
                                className="items-center rounded-full flex-shrink-0 justify-center bg-center bg-no-repeat bg-cover flex"
                                style={{
                                    width: 32,
                                    height: 32,
                                    backgroundImage: `url(${video?.author?.avatar})`,
                                }}
                                title={video?.author?.username}
                            ></div>
                        </div>
                        <div style={{ fontSize: 13 }} className="w-full">
                            <div className="flex items-center ml-2 flex-grow">
                                <span className="overflow-hidden -webkit-box">{video?.author?.username}</span>
                                <MdVerifiedUser size="12" color="green" className="flex-shrink-0 ml-2" />
                            </div>
                            <div className="ml-2 w-full">
                                <span>{formatDateAgo(video.createdAt ?? video.updatedAt)} <BsDot className="inline-flex items-center" /> 155k Views</span>
                            </div>
                        </div>
                    </a>
                </address>
                <div className="mt-2">
                                {video.status ? (
                                    <button
                                        onClick={() => handleUnpublishVideo(video._id)}
                                        className="bg-red-600 text-white py-1 px-2 rounded"
                                    >
                                        Unpublish
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handlePublishVideo(video._id)}
                                        className="bg-green-600 text-white py-1 px-2 rounded"
                                    >
                                        Publish
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {selectedVideos.length > 0 && (
                <div className="mt-4">
                    <button
                        onClick={handleDeleteSelectedVideos}
                        className="text-white bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
                        disabled={loading}
                    >
                        Delete Selected Video
                    </button>
                </div>
            )}
            {showDeleteConfirmation && (
                <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="relative w-80 bg-white p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Confirm Deletion</h3>
                        <p>Are you sure you want to delete the selected video(s)?</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowDeleteConfirmation(false)}
                                className="text-gray-500 hover:text-gray-800 mr-4"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleConfirmDelete()}
                                className="text-red-500 hover:text-red-800"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Delete;