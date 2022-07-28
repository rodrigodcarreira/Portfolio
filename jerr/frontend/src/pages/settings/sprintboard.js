import React from "react";
import TopBar from "../../components/Taskcomp/TopBar";

export default function sprintboard(props) {
	projectid = props.projectid;
	projectname = props.projectname;
	const [nameProject, setNameProject] = useState("Project example");

	return (
		<div>
			<TopBar text={nameProject} />
		</div>
	);
}
