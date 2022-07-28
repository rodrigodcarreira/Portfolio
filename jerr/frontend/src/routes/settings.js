import { Navigate, Route, Routes } from "react-router";
import { SettingsShell } from "../components/SettingsShell";
import Error404Found from "../pages/error404";
import { CreateProject } from "../pages/settings/createProject";
import { InsertMembersProject } from "../pages/settings/insertMembersProj";
import { ListProject } from "../pages/settings/listProject";
import { ListTeams } from "../pages/settings/listTeams";
import { CreateTeam } from "../pages/settings/team/createTeam";
import { UserSettings } from "../pages/settings/user";
import ProtectedRoute from "./ProtecedRoute";

export default function SettingsRoutes() {
	return (
		<Routes>
			<Route
				element={
					<ProtectedRoute>
						<SettingsShell />
					</ProtectedRoute>
				}
			>
				<Route path="user" element={<UserSettings />} />
				<Route path="teams" element={<ListTeams />} />
				<Route path="team/add" element={<CreateTeam />} />
				<Route path="project/add" element={<CreateProject />} />
				<Route path="projects" element={<ListProject />} />
				<Route
					path="project/:projectId/addMembers"
					element={<InsertMembersProject />}
				/>

				<Route path="*" element={<Navigate to="user" replace />} />
			</Route>
			<Route path="*" element={<Error404Found />} />
		</Routes>
	);
}
