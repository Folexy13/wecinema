import React, { useEffect, useState } from "react";
import { Gallery, Layout, Render } from "../components/";
import { getRequest } from "../api";
import { useNavigate } from "react-router-dom";

const Homepage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [scripts, setScripts] = useState<any>([]);
	const [data, setData] = useState<any>([]);
	const [showMoreIndex, setShowMoreIndex] = useState<number | null>(null);
	const nav = useNavigate();
	useEffect(() => {
		let isMounted = true; // Flag to track if the component is mounted

		(async () => {
			setLoading(true);
			const result: any = await getRequest("video/author/scripts", setLoading);
			console.log(result);
			if (isMounted && result) {
				// Update state only if the component is still mounted
				setScripts(result.map((res: any) => res.script));
				setData(result); // Assuming a `videos` state variable
				setLoading(false);
			}
		})();

		// Cleanup function to handle unmounting
		return () => {
			isMounted = false;
		};
	}, []);

	const handleScriptMouseEnter = (index: number) => {
		setShowMoreIndex(index);
	};

	const handleScriptMouseLeave = () => {
		setShowMoreIndex(null);
	};

	return (
		<Layout expand={false}>
			<Gallery title="Action" category="Action" length={5} isFirst />
			<Gallery title="Comedy" length={5} category="Comedy" />
			<Gallery title="Horror" length={5} category="Horror" />
			<Gallery title="Drama" length={5} category="Drama" />
			<Gallery title="Romance" length={5} category="Romance" />
			<Gallery title="Mystery" length={5} category="Mystery" />
			<Gallery title="Adventure" length={5} category="Adventure" />
			<Gallery title="Thriller " length={5} category="Thriller" />
			<div className="z-1 relative p-2 flex flex-wrap border-b border-blue-200 sm:mx-4 pb-4">
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
		</Layout>
	);
};

export default Homepage;
