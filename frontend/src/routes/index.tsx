import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
	CategoryPage,
	Homepage,
	ProfilePage,
	ScriptViewPage,
	Viewpage,
	HypemodePage,
	VideoEditorPage,
	RatingPage,
} from "../pages";

const Router: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/video/:slug" element={<Viewpage />} />
				<Route path="/category/:slug" element={<CategoryPage />} />
				<Route path="/user/:id" element={<ProfilePage />} />
				<Route path="/script/:id" element={<ScriptViewPage />} />
				<Route path="/ratings/:slug" element={<RatingPage />} />
				<Route path="/hypemode" element={<HypemodePage />} />
				<Route path="/videoeditor" element={<VideoEditorPage />} />

			</Routes>
		</BrowserRouter>
	);
};
export default Router;
