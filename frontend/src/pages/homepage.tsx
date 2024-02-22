import React, { useEffect, useState } from "react";
import { Gallery, Layout, Render } from "../components";
import { getRequest } from "../api";

const Homepage: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const [scripts, setScripts] = useState<any>([]);

	useEffect(() => {
		let isMounted = true; // Flag to track if the component is mounted

		(async () => {
			setLoading(true);
			const result: any = await getRequest("video/author/scripts", setLoading);
			console.log(result);
			if (isMounted && result) {
				// Update state only if the component is still mounted
				setScripts(result.map((res: any) => res.script)); // Assuming a `videos` state variable
				setLoading(false);
			}
		})();
	}, []);

	console.log(scripts);
	return (
		<Layout>
			<Gallery title="Action" category="Action" length={5} isFirst />
			<Gallery title="Comedy" length={5} category="Comedy" />
			<Gallery title="Horror" length={5} category="Horror" />
			<Gallery title="Drama" length={5} category="Drama" />
			<Gallery title="Romance" length={5} category="Romance" />
			<Gallery title="Mystery" length={5} category="Mystery" />
			<Gallery title="Adventure" length={5} category="Adventure" />
			<Gallery title="Thriller " length={5} category="Thriller" />
			<div className="z-1 relative p-2 flex flex-wrap border-b  border-blue-200 sm:mx-4 pb-4">
				{!loading && (
					<h2 className="text-l font-extrabold text-lg sm:text-xl">Scripts</h2>
				)}
				<div className="flex flex-wrap flex-col sm:flex-row sm:gap-4 gap-2 my-2">
					{/* <h2>Scripts</h2> */}

					{!loading &&
						scripts?.map((script: string, index: number) => (
							<div
								key={index}
								className="bg-gray-800 w-5/12 max-h-64 overflow-y-auto text-white p-4 rounded-sm"
							>
								<Render htmlString={script} />
							</div>
						))}
				</div>
			</div>
		</Layout>
	);
};

export default Homepage;
