import React from "react";
import { Gallery, Layout } from "../components";

const Homepage: React.FC = () => {
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
		</Layout>
	);
};

export default Homepage;
