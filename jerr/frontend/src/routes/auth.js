import { Navigate, Route, Routes } from "react-router";
import useAuth from "../context/auth";
import ConfirmAccount from "../pages/auth/confirmAccount";
import Forgotten from "../pages/auth/forgottenPassword";
import Login from "../pages/auth/login";
import RegisterAcc from "../pages/auth/register";
import Error404Found from "../pages/error404";
import Home from "../pages/home";

export default function AuthRoutes() {
	const { isAuthenticated } = useAuth();
	return (
		<Routes>
			<Route
				path="/register"
				element={
					isAuthenticated ? (
						<Navigate to="/" replace />
					) : (
						<RegisterAcc />
					)
				}
			/>
			<Route path="/verify/:token" element={<ConfirmAccount />} />
			<Route path="/request-password" element={<Forgotten />} />

			<Route
				path="/home"
				element={
					isAuthenticated ? <Navigate to="/" replace /> : <Home />
				}
			/>

			<Route
				path="/login"
				element={
					isAuthenticated ? <Navigate to="/" replace /> : <Login />
				}
			/>
			<Route path="/forgottenPassword" element={<Forgotten />} />
			<Route path="/confirmAccount" element={<ConfirmAccount />} />

			<Route path="*" element={<Error404Found />} />
		</Routes>
	);
}
