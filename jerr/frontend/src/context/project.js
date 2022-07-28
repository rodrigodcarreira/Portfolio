import React, { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import api from "../services/api";

export const ProjectContext = createContext();

export const ProjectProvider = ({ idProject, children }) => {
	const queryClient = useQueryClient();

	const { data: project, isLoading } = useQuery(
		["project", idProject],
		async () =>
			await api.get(`/projects/${idProject}`).then((res) => res.data)
	);

	return (
		<ProjectContext.Provider value={{ project, isLoading }}>
			{children}
		</ProjectContext.Provider>
	);
};

const useProject = () => useContext(ProjectContext);
export default useProject;
