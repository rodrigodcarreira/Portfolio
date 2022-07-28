import { Route, Routes } from "react-router";
import { Chat } from "../pages/chat";
import Error404Found from "../pages/error404";

export const ChatRoutes = () => {
	return (
		<Routes>
			<Route path=":room" element={<Chat />} />
			<Route path="*" element={<Error404Found />} />
		</Routes>
	);
};
