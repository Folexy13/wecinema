import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
	CategoryPage,
	Homepage,
	ProfilePage,
	ScriptViewPage,
	Viewpage,
	HypeModeProfile,
	HypeMode,
	VideoEditorPage,
	RatingPage,
	CustomerSupportPage,
	PaymentComponent,
	ChatPage,
	ThemePage,
	SearchPage,


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
				<Route path="/themes/:slug" element={<ThemePage />} />
				<Route path="/search/:slug" element={<SearchPage />} />

				<Route path="/hypemode" element={<HypeMode />} />
				<Route path="/payment" element={<PaymentComponent />} />
				<Route path="/hypemodeprofile" element={<HypeModeProfile />} />
				<Route path="/chat/:chatId" element={<ChatPage />} />

				<Route path="/videoeditor" element={<VideoEditorPage />} />
				<Route path="/customersupport" element={<CustomerSupportPage />} />


			</Routes>
		</BrowserRouter>
	);
};
export default Router;
