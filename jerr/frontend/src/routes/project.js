import { LoadingOverlay } from "@mantine/core";
import { Navigate, Route, Routes, useParams } from "react-router";
import Board from "../components/Board";
import NoSprint from "../components/Board/NoSprint";
import { CreateSprint } from "../components/createSprint";
import SprintHeader from "../components/SprintHeader";
import useProject from "../context/project";
import { SprintProvider } from "../context/sprint";
import Error404Found from "../pages/error404";
import ProjectPage from "../pages/project";
import ChatRoutes from "./chat";
import ProtectedRoute from "./ProtecedRoute";

export default function ProjectRoutes() {
	return (
		<Routes>
			<Route
				element={
					<ProtectedRoute>
						<ProjectPage />
					</ProtectedRoute>
				}
			>
				<Route path="/chat/*" element={<ChatRoutes />} />

				<Route path="/sprints" element={<CreateSprint />} />

				<Route
					path="/board/:sprintId/*"
					element={
						<SprintProviderWrapper>
							<SprintHeader />
							<Board />
						</SprintProviderWrapper>
					}
				/>
				<Route path="/" exact element={<SprintFinder />} />
				<Route path="/no-sprint" element={<NoSprint />} />
			</Route>
			<Route path="*" element={<Error404Found />} />
		</Routes>
	);
}

const SprintFinder = () => {
	const { project, isLoading } = useProject();

	if (isLoading) return <LoadingOverlay visible={"true"} />;

	if (!project.sprints || project.sprints.length === 0)
		return <Navigate to={`/project/${project._id}/no-sprint`} replace />;

	const sprint = project.sprints.at(-1);

	return <Navigate to={`/project/${project._id}/board/${sprint}`} replace />;
};

const SprintProviderWrapper = ({ children }) => {
	const params = useParams();

	return (
		<SprintProvider sprintID={params.sprintId}>{children}</SprintProvider>
	);
};
