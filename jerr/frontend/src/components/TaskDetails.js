import {
	ActionIcon,
	Avatar,
	Button,
	Grid,
	Group,
	ScrollArea,
	Select,
	Stack,
	Text,
	TextInput,
	Title,
	useMantineTheme,
} from "@mantine/core";
import { Dropzone, FullScreenDropzone } from "@mantine/dropzone";
import { RichTextEditor } from "@mantine/rte";
import React, { forwardRef, useRef, useState } from "react";
import {
	FileDownload,
	Paperclip,
	Trash,
	Upload,
	User,
	X,
} from "tabler-icons-react";
import useProject from "../context/project";
import useSprint from "../context/sprint";
import api from "../services/api";

export const dropzoneChildren = (status, theme) => (
	<Group
		position="center"
		spacing="xl"
		style={{ minHeight: 220, pointerEvents: "none" }}
	>
		<Upload size={48} strokeWidth={2} color={"black"} />
		<div>
			<Text size="xl" inline>
				Arraste o seu arquivo para aqui
			</Text>
			<Text size="sm" color="dimmed" inline mt={7}>
				Zona de upload de arquivos
			</Text>
		</div>
	</Group>
);

export default function TaskDetails({ task, setOpened, openDeleteModal }) {
	const { updateTaskMutation } = useSprint();
	const theme = useMantineTheme();
	const [dropFile, setDropFile] = useState(false);
	const openRef = useRef();

	const { project } = useProject();

	const [title, setTitle] = useState(task.title);
	const [description, setDescription] = useState(task?.description);
	const [editKey, setEditKey] = useState(new Date());
	const [editDescription, setEditDescription] = useState(false);

	const editorRef = React.useRef(null);

	const assignees = task.assignees.map((assignee) => assignee._id);

	const uploadFile = async (file) => {
		const formData = new FormData();
		formData.append("file", file);

		const res = await api.post("/upload", formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		return res.data;
	};

	const projectmembers = project.members
		.map((member) => ({
			value: member._id,
			label: member.fullName,
			email: member.email,
			image: member.photo,
		}))
		.filter((member) => !assignees.includes(member.value));

	const SelectItem = forwardRef(({ image, label, email, ...others }, ref) => (
		<div ref={ref} {...others}>
			<Group noWrap>
				<Avatar src={image} />

				<div>
					<Text>{label}</Text>
					<Text size="xs" color="dimmed">
						{email}
					</Text>
				</div>
			</Group>
		</div>
	));

	return (
		<>
			<Grid>
				<Grid.Col span={8}>
					<Group>
						<TextInput
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
								width: "100%",
								marginBottom: theme.spacing.sm,
							})}
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							onBlur={(e) => {
								task.title = title;
								updateTaskMutation.mutate(task);
							}}
						/>
					</Group>
					<Title order={5}>Descrição</Title>
					<ScrollArea
						style={{ height: "55vh", maxHeight: "70vh" }}
						offsetScrollbars
					>
						<RichTextEditor
							key={editKey}
							readOnly={!editDescription}
							value={task.description}
							sticky
							ref={editorRef}
							sx={(theme) => ({
								minHeight: "55vh",
								width: "100%",
								border: !editDescription && "none",

								"&:hover": {
									backgroundColor: !editDescription
										? theme.colorScheme === "dark"
											? theme.colors.dark[5]
											: theme.colors.gray[0]
										: "unset",
								},
							})}
							onChange={setDescription}
							onClick={() => setEditDescription(true)}
						/>
					</ScrollArea>
					{editDescription && (
						<Group mt={"sm"} spacing={"xs"}>
							<Button
								size="xs"
								onClick={() => {
									task.description = description;
									updateTaskMutation.mutate(task);
									setEditDescription(false);
								}}
							>
								Salvar
							</Button>
							<Button
								size="xs"
								variant="subtle"
								onClick={() => {
									setDescription("");
									setEditDescription(false);
									setEditKey(new Date());
								}}
							>
								Cancelar
							</Button>
						</Group>
					)}
				</Grid.Col>
				<Grid.Col span={4}>
					<Group position="right" sx={{ width: "100%" }} mb="md">
						<ActionIcon variant="hover" color="red" size={"lg"}>
							<Trash
								size={24}
								onClick={() => {
									setOpened(false);
									openDeleteModal();
								}}
							/>
						</ActionIcon>
						<ActionIcon onClick={() => openRef.current()}>
							<Paperclip />
						</ActionIcon>
						<ActionIcon
							variant="hover"
							size={"lg"}
							onClick={() => setOpened(false)}
						>
							<X size={24} />
						</ActionIcon>
					</Group>
					<Title order={5}>{"Responsáveis"}</Title>
					<Stack spacing={"sm"}>
						<Select
							icon={<User size={20} />}
							data={projectmembers}
							// label="Membros"
							value={""}
							clearable
							placeholder="Escolha os membros a inserir"
							searchable
							nothingFound="Não foi encontrado nenhum membro"
							itemComponent={SelectItem}
							maxDropdownHeight={160}
							onChange={(value) => {
								if (!value) return;
								task.assignees.push(
									project.members.find(
										(member) => member._id === value
									)
								);
								updateTaskMutation.mutate(task);
							}}
						/>
						<ScrollArea
							style={{ height: "23vh", width: "100%" }}
							offsetScrollbars
						>
							{task.assignees.map((assignee) => (
								<Grid
									key={assignee._id}
									gutter="xl"
									align={"center"}
									style={{
										width: "100%",
									}}
								>
									<Grid.Col span={10}>
										<Group noWrap>
											<Avatar
												radius="50%"
												name={assignee.fullName}
												alt={assignee.fullName}
												src={
													assignee.photo
														? "/assets/" +
														  assignee.photo
														: undefined
												}
											/>
											<Text lineClamp={1}>
												{assignee.fullName}
											</Text>
										</Group>
									</Grid.Col>
									<Grid.Col span={2}>
										<ActionIcon
											color="red"
											onClick={() => {
												task.assignees =
													task.assignees.filter(
														(a) =>
															a._id !==
															assignee._id
													);
												updateTaskMutation.mutate(task);
											}}
										>
											<Trash />
										</ActionIcon>
									</Grid.Col>
								</Grid>
							))}
						</ScrollArea>
					</Stack>
					<Title order={6}>Anexos</Title>
					<Stack spacing={"sm"}>
						<ScrollArea
							style={{ height: "23vh", width: "100%" }}
							offsetScrollbars
						>
							{task.attachments.map((attachment, i) => (
								<Grid
									key={i}
									gutter="xl"
									align={"center"}
									style={{
										width: "100%",
									}}
								>
									<Grid.Col span={9}>
										<Group noWrap>
											<Text lineClamp={1}>
												{attachment}
											</Text>
										</Group>
									</Grid.Col>
									<Grid.Col span={2}>
										<Group noWrap>
											<ActionIcon
												component="a"
												target={"_blank"}
												href={`/assets/${attachment}`}
												download
											>
												<FileDownload />
											</ActionIcon>
											<ActionIcon
												color="red"
												onClick={() => {
													task.attachments =
														task.attachments.filter(
															(a) =>
																a._id !==
																attachment._id
														);
													updateTaskMutation.mutate(
														task
													);
												}}
											>
												<Trash />
											</ActionIcon>
										</Group>
									</Grid.Col>
								</Grid>
							))}
						</ScrollArea>
					</Stack>
				</Grid.Col>
			</Grid>
			<Dropzone
				openRef={openRef}
				onDrop={async (files) => {
					const file = files[0];
					const res = await uploadFile(file);

					task.attachments.push(res);
					updateTaskMutation.mutate(task);
				}}
				style={{ display: "none" }}
			>
				{(status) => dropzoneChildren(status, theme)}
			</Dropzone>
			<FullScreenDropzone
				onDrop={async (files) => {
					const file = files[0];
					const res = await uploadFile(file);

					task.attachments.push(res);
					updateTaskMutation.mutate(task);
				}}
			>
				{(status) => dropzoneChildren(status, theme)}
			</FullScreenDropzone>
		</>
	);
}
