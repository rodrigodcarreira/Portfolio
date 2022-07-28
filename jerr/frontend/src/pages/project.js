import { AppShell } from "@mantine/core";
import { Outlet, useParams } from "react-router";
import ProjectShell from "../components/ProjectShell";
import { ProjectProvider } from "../context/project";

export default function ProjectPage() {
	const { projectId } = useParams();

	return (
		<ProjectProvider idProject={projectId}>
			<div
				style={{
					width: "100vw",
					height: "100vh",
					overflow: "hidden",
					position: "relative",
				}}
			>
				<AppShell navbar={<ProjectShell />}>
					<Outlet />
				</AppShell>
			</div>
		</ProjectProvider>
	);
}
