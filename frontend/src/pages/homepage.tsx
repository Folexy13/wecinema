import React from "react";
import { Gallery, Layout } from "../components";

const Homepage: React.FC = () => {
	return (
		<Layout>
			<Gallery title="Gaming" length={5} isFirst />
			<Gallery title="Sport" length={5} />
			<Gallery title="Horror" length={5} />
			<Gallery title="Action" length={5} />
			<Gallery title="Drama" length={5} />
			<Gallery title="Romance" length={5} />
			<Gallery title="Mystery" length={5} />
			<Gallery title="Comedy" length={5} />
			<Gallery title="Thriller " length={5} />
		</Layout>
	);
};

export default Homepage;
