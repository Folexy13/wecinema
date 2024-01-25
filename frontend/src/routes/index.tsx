import React from "react";
import { BrowserRouter, Route, Routes,  } from "react-router-dom";
import { CategoryPage, Homepage, Viewpage } from "../pages";

const Router: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/video/:slug" element={<Viewpage />} />
				<Route path="/category/:slug" element={<CategoryPage />} />
			</Routes>
		</BrowserRouter>
	);
};
export default Router;
