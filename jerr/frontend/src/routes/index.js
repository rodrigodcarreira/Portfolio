import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from "react-router-dom";

import Error404Found from "../pages/error404";

import AuthRoutes from "./auth";
import ProjectRoutes from "./project";

import { useLocalStorage } from "@mantine/hooks";
import Error403Denied from "../pages/error403";
import Workspace from "../pages/workspace";
import { ChatRoutes } from "./chat";
import ProtectedRoute from "./ProtecedRoute";
import SettingsRoutes from "./settings";

function RoutesApp() {
	const [sprintStorage, setSprintStorage] = useLocalStorage({
		key: "sprint",
		defaultValue: null,
	});

	return (
		<Router>
			<Routes>
				<Route path="/settings/*" element={<SettingsRoutes />} />

				<Route path="chat/*" element={<ChatRoutes />} />

				<Route
					exact
					path="/"
					element={
						<ProtectedRoute>
							{sprintStorage ? (
								<Navigate
									to={`/project/${sprintStorage.idProject}/board/${sprintStorage._id}`}
									replace={true}
								/>
							) : (
								<Navigate
									to={`/settings/projects`}
									replace={true}
								/>
							)}
						</ProtectedRoute>
					}
				/>

				<Route
					path="/project/:projectId/*"
					element={<ProjectRoutes />}
				/>
				<Route path="*" element={<AuthRoutes />} />

				<Route path="/403" element={<Error403Denied />} />
				<Route path="*" element={<Error404Found />} />
			</Routes>
		</Router>
	);
}

export default RoutesApp;
