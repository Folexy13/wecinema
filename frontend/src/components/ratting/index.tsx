import React, { useEffect, useState } from "react";
import { MdVerifiedUser } from "react-icons/md";
import { BsDot } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import VideoThumbnail from "react-video-thumbnail";
import { getRequest } from "../../api";
import {
    formatDateAgo,
    generateSlug,
    truncateText,
} from "../../utilities/helperfFunction";
import { Skeleton } from "..";

interface RatingProps {
    title?: string;
    type?: string;
    data?: any;
    ratings?: string;
    length?: number;
    isFirst?: boolean;
}

const Rating: React.FC<RatingProps> = ({
    title,
    isFirst,
    ratings,
    type,
}) => {
    const nav = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [videos, setVideos] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchVideos = async () => {
            setLoading(true);
            try {
                console.log("Fetching videos...");
                const result:any = ratings
                    ? await getRequest(`video/ratings/${ratings}`, setLoading)
                    : await getRequest("video/all", setLoading);

                if (isMounted && result) {
                    console.log("Videos fetched:", result);
                    setVideos(result);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
                setLoading(false);
            }
        };

        fetchVideos();

        return () => {
            isMounted = false;
        };
    }, [ratings]);

    const filterVideos = (ratings?: string) => {
        return videos.filter((v: any) =>
            ratings ? v.rating.includes(ratings) : v
        );
    };

    const handleVideolick = (video: any) => {
        nav(video.slug ?? "/video/" + generateSlug(video._id), {
            state: video,
        });
        localStorage.setItem("video", JSON.stringify(video));
    };

    if (loading) {
        return (
            <div
                className={` ${
                    isFirst ? "mt-5" : ""
                } z-1 relative p-2 flex flex-wrap border-b overflow-hidden border-blue-200 sm:mx-4 pb-4`}
            >
                <div className="flex flex-wrap w-full ">
                    {Array(7)
                        .fill("")
                        .map((_, index: any) => (
                            <Skeleton
                                key={index}
                                width={400}
                                style={{ maxWidth: "20%" }}
                                className="cursor-pointer gallery relative flex-wrap  border-gray-200  w-full   p-2 "
                            />
                        ))}
                </div>
            </div>
        );
    }

    if (videos.length === 0 && !loading && type === "profile") {
        return (
            <div
                className={` ${
                    isFirst ? "mt-5" : ""
                } z-1 relative p-2 flex text-center flex-wrap border-b overflow-hidden border-blue-200 sm:mx-4 pb-4`}
            >
                <div className="flex flex-wrap w-full ">No Video Uploaded</div>
            </div>
        );
    }

    return (
        <div
            className={` ${
                isFirst ? "mt-20" : ""
            } z-1 relative p-2 flex flex-wrap border-b  border-blue-200 sm:mx-4 pb-4`}
        >
            <div className="mt-1 w-full sm:px-4 py-2 flex justify-between items-center">
                <h2 className="text-l font-extrabold text-lg sm:text-xl">{title}</h2>
                {filterVideos(ratings).length > 6 && title && (
                    <a
                        href="#"
                        className={` ${
                            !title && "float-right"
                        } hover:bg-green-700 whitespace-nowrap hover:text-white hover:border-green-700 border border-green-700 py-1  rounded-xl px-4  cursor-pointer	`}
                    >
                        View all
                    </a>
                )}
            </div>
            <div className="flex flex-wrap w-full">
                {filterVideos(ratings).map((video: any, index: any) => (
                    <div
                        key={index}
                        style={{ maxWidth: "20%" }}
                        className="cursor-pointer gallery relative flex-wrap  border-gray-200  w-full   p-2 "
                    >
                        <div
                            onClick={() => handleVideolick(video)}
                            className="thumbnail relative overflow-hidden"
                        >
                            <VideoThumbnail
                                videoUrl={video.file}
                                className="border-gray-200 rounded-xl w-full"
                            />
                        </div>
                        <div
                            className="footer flex-1 block"
                            onClick={() => {
                                nav("/user/" + video?.author?._id);
                            }}
                        >
                            <a href="#" className="inline-flex max-w-max overflow-hidden">
                                <h3 className="text-base font-semibold leading-5 my-2">
                                    {truncateText(video.title, 60)}
                                </h3>
                            </a>
                            <address className="flex items-center justify-between mt-8px">
                                <a
                                    href="#"
                                    className="flex w-full overflow-hidden relative items-center"
                                >
                                    <div className="relative rounded-full w-32px  box-border flex-shrink-0 block">
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
                                            <span className="overflow-hidden -webkit-box">
                                                {video?.author?.username}
                                            </span>
                                            <MdVerifiedUser
                                                size="12"
                                                color="green"
                                                className="flex-shrink-0 ml-2"
                                            />
                                        </div>
                                        <div className="ml-2 w-full">
                                            <span>
                                                {formatDateAgo(video.createdAt ?? video.updatedAt)}
                                                <BsDot className="inline-flex items-center" /> 155k
                                                Views
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </address>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rating;
