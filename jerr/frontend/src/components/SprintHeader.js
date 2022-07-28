import {
	Button,
	Group,
	Modal,
	Skeleton,
	Text,
	Title,
	Select,
	Stack,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { useNavigate, useParams } from "react-router-dom";
import useProject from "../context/project";
import useSprint from "../context/sprint";
import { CreateSprint } from "./createSprint";
import api from "../services/api";
import { Checklist } from "tabler-icons-react";
import dayjs from "dayjs";

const SprintHeader = () => {
	let navigate = useNavigate();
	const { sprintID, sprint, isLoading: isLoadingS } = useSprint();
	/* const { project, isLoading: isLoadingP } = useProject(); */
	const [showS, setShowS] = useState(false);
	const { t } = useTranslation();
	const notify = useNotifications();
	const queryClient = useQueryClient();

	const modals = useModals();
	const { projectId } = useParams();

	const { data: sprints, isLoading: isLoadingSprint } = useQuery(
		["sprints", projectId],
		async () =>
			await api
				.get(`/projects/${projectId}/sprints`)
				.then((res) => res.data)
	);

	const selectSprint = (idSelect) => {
		navigate(`/project/${projectId}/board/${idSelect}`, { replace: true });
	};

	const openConfirmModal = () =>
		modals.openConfirmModal({
			title: "Terminar Sprint!",
			children: (
				<Text size="sm">
					Tem a certeza de querer terminar este sprint?
				</Text>
			),
			labels: { confirm: "Confirm", cancel: "Cancel" },
			onCancel: () => console.log("Cancel"),
			onConfirm: () => finishSprintMutate.mutate(),
		});
	const finishSprintMutate = useMutation(
		async () => await api.put(`/sprints/${sprint._id}/finish`),
		{
			onSuccess: () => {
				notify.showNotification({
					title: t("success"),
					message: t("success"),
				});
			},
			onError: (err) => {
				notify.showNotification({
					title: "Erro",
					message: "Erro ao finalizar sprint",
				});
			},
			onSettled: () => {
				queryClient.invalidateQueries(["sprint", sprintID]);
			},
		}
	);

	return (
		<Group position="apart" mb="md">
			{isLoadingSprint ? (
				<Skeleton
					width="30%"
					height="20px"
					style={{ marginBottom: "10px" }}
				/>
			) : (
				<Group>
					<Select
						allowDeselect
						data={sprints.map((sprint) => ({
							value: sprint._id,
							label: sprint.title,
						}))}
						value={sprintID}
						onChange={(e) => selectSprint(e)}
						variant="unstyled"
						sx={(theme) => ({
							input: {
								...theme.headings.sizes.h1,
								fontFamily: theme.headings.fontFamily,
								fontWeight: theme.headings.fontWeight,
								color: theme.colors.white,
							},

							"&:hover": {
								backgroundColor:
									theme.colorScheme === "dark"
										? theme.colors.dark[6]
										: theme.colors.gray[0],
							},
						})}
					/>
					{isLoadingS ? (
						<Skeleton
							width="30%"
							height="20px"
							style={{ marginBottom: "10px" }}
						/>
					) : (
						<Stack spacing={0}>
							<Text color="dimmed">
								Inicio:{" "}
								{dayjs(sprint.startAt).format("DD/MM/YYYY")}
							</Text>
							<Text color="dimmed">
								Fim estimado:{" "}
								{dayjs(sprint.endAt).format("DD/MM/YYYY")}
							</Text>
						</Stack>
					)}
				</Group>
			)}
			<Group spacing="xl">
				{!isLoadingS &&
					(sprint.finishedAt == null ? (
						<Button onClick={openConfirmModal}>
							{t("concludeSprint")}
						</Button>
					) : (
						<Group spacing="xs">
							<Checklist
								size={30}
								strokeWidth={2}
								color={"green"}
							/>
							<Text
								component="span"
								color={"green"}
								weight={500}
								size="lg"
							>
								{t("terminateSprint")}
							</Text>
						</Group>
					))}

				<Button onClick={() => setShowS(true)}>
					{t("createSprint")}
				</Button>

				{!isLoadingSprint && (
					<Modal
						opened={showS}
						onClose={() => setShowS(false)}
						title={t("createSprint")}
					>
						<CreateSprint
							idProject={projectId}
							close={() => setShowS(false)}
							type="Create"
						/>
					</Modal>
				)}
			</Group>
		</Group>
	);
};
export default SprintHeader;
