import {
	Avatar,
	AvatarsGroup,
	Grid,
	Menu,
	Modal,
	Paper,
	Skeleton,
	Stack,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { React, useState } from "react";
import { Trash } from "tabler-icons-react";
import useSprint from "../../context/sprint";
import TaskDetails from "../TaskDetails";

export default function Task({ task, provided, snapshot }) {
	const { deleteTaskMutation } = useSprint();
	const [opened, setOpened] = useState(false);
	const modals = useModals();

	const skeleton = !!task.skeleton;

	const openDeleteModal = () =>
		modals.openConfirmModal({
			title: "Delete task",
			centered: true,
			children: "Are you sure you want to delete this task?",
			confirmProps: { color: "red" },
			onConfirm: () => {
				deleteTaskMutation.mutate(task);
				setOpened(false);
			},
			labels: { confirm: "Delete task", cancel: "No don't delete it" },
		});

	return (
		<div
			ref={provided.innerRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
		>
			<Paper
				shadow="md"
				p="sm"
				sx={(theme) => ({
					backgroundColor: snapshot.isDragging
						? theme.colorScheme === "dark"
							? theme.colors.dark[6]
							: theme.colors.gray[0]
						: theme.colors.white,

					"&:hover, &:focus": {
						backgroundColor:
							theme.colorScheme === "dark"
								? theme.colors.dark[6]
								: theme.colors.gray[0],
					},

					"&:active": {
						transform: snapshot.isDragging
							? "rotate(5deg)"
							: "unset",
					},

					"&:hover ": {
						"*": {
							opacity: 1,
						},
					},

					transition: "all 0.1s ease-in-out",
				})}
				onClick={() => {
					if (!task.loading) setOpened(true);
				}}
			>
				{skeleton ? (
					<>
						<Skeleton height={8} mt={6} width="70%" radius="xl" />
						<Skeleton height={8} mt={6} width="40%" radius="xl" />
						<Skeleton
							height={40}
							circle
							style={{ marginLeft: "auto" }}
						/>
					</>
				) : (
					<Stack spacing={0}>
						<Grid gutter={0}>
							<Grid.Col span={10}>
								<div>{task.title}</div>
							</Grid.Col>
							<Grid.Col span={2}>
								<Menu
									sx={{
										float: "right",
										opacity: 0,
									}}
									onClick={(e) => e.stopPropagation()}
								>
									<Menu.Item
										color="red"
										icon={<Trash size={14} />}
										onClick={() => openDeleteModal()}
									>
										Eliminar Tarefa
									</Menu.Item>
								</Menu>
							</Grid.Col>
						</Grid>

						{task?.assignees && task.assignees?.length > 0 && (
							<AvatarsGroup
								limit={10}
								style={{ marginLeft: "auto" }}
							>
								{task.assignees.map((assignee) => (
									<Avatar
										radius="50%"
										key={assignee._id}
										name={assignee.fullName}
										alt={assignee.fullName}
										src={
											assignee.photo
												? "/assets/" + assignee.photo
												: undefined
										}
									></Avatar>
								))}
							</AvatarsGroup>
						)}
					</Stack>
				)}
			</Paper>
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				size="75%"
				// overflow="inside"
				withCloseButton={false}
			>
				<TaskDetails
					task={task}
					setOpened={setOpened}
					openDeleteModal={openDeleteModal}
				/>
			</Modal>
		</div>
	);
}
