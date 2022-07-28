import {
	ActionIcon,
	Badge,
	Button,
	Divider,
	Grid,
	Group,
	Menu,
	Navbar,
	Popover,
	ScrollArea,
	Skeleton,
	Stack,
	Text,
	TextInput,
	Tooltip,
	UnstyledButton,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import {
	Check,
	LayoutCards,
	Logout,
	Plus,
	Selector,
	Settings,
	Trash,
	X,
	ListDetails,
	Users,
} from "tabler-icons-react";
import useAuth from "../../context/auth";
import useProject from "../../context/project";
import api from "../../services/api";
import ShellHeader from "../ShellHeader";
import UserButton from "../UserButton";
import useStyles from "./styles";

const links = [
	{
		icon: LayoutCards,
		label: "Boards",
		location: "/project/:projectId/board/:sprintID",
		// notifications: 3,
	},
	{
		icon: ListDetails,
		label: "Projetos",
		location: "/settings/projects",
	},
	{
		icon: Users,
		label: "Equipas",
		location: "/settings/teams",
	},
	// { icon: LayoutList, label: "Tasks", notifications: 4 },
	// { icon: User, label: "Contacts" },
];

export default function ProjectShell() {
	const { classes } = useStyles();

	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { user, isLoading: authIsLoading, logOut } = useAuth();
	const { project: dataProject, isLoading: isLoadingProject } = useProject();

	const project = isLoadingProject
		? { _id: "project-skeleton", skeleton: true }
		: dataProject;

	const { data: rooms, isLoading } = useQuery(
		["rooms", { projectId: project._id }],
		async () =>
			await api.get(`/rooms/${project._id}`).then((res) => res.data)
	);

	const { data: projects, isLoading: isLoadingProjects } = useQuery(
		["projects"],
		async () => await api.get("/projects").then((res) => res.data)
	);

	const [newRoom, setNewRoom] = useState("");

	const [showProjectPopper, setShowProjectPopper] = useState(false);

	const addRoomMutation = useMutation(
		async (name) =>
			await api
				.post(`/rooms/${project._id}`, { name })
				.then((res) => res.data),
		{
			onSettled: () => {
				queryClient.invalidateQueries([
					"rooms",
					{ projectId: project._id },
				]);
			},
		}
	);

	const [sprintStorage, setSprintStorage] = useLocalStorage({
		key: "sprint",
		defaultValue: null,
	});

	const [addRoom, setAddRoom] = useState(false);
	const skeleton = !!project.skeleton;

	const mainLinks = links.map((link) => (
		<UnstyledButton
			key={link.label}
			className={classes.mainLink}
			onClick={() => {
				navigate(
					link.location
						.replace(":projectId", project._id)
						.replace(":sprintID", sprintStorage._id)
				);
			}}
		>
			<div className={classes.mainLinkInner}>
				<link.icon size={20} className={classes.mainLinkIcon} />
				<span>{link.label}</span>
			</div>
			{link.notifications && (
				<Badge
					size="sm"
					variant="filled"
					className={classes.mainLinkBadge}
				>
					{link.notifications}
				</Badge>
			)}
		</UnstyledButton>
	));

	const roomsLinks = isLoading
		? Array.from("x".repeat(10)).map((_, i) => (
				<Skeleton key={i} height={16} mt={12} radius="sm" />
		  ))
		: rooms.map((room) => (
				<Link
					to={"chat/" + room._id}
					key={room._id}
					className={classes.roomLink}
				>
					<span style={{ marginRight: 9, fontSize: 16 }}>💬</span>
					{room.name}
				</Link>
		  ));

	return (
		<Navbar
			height={"100vh"}
			width={{ sm: 300 }}
			p="md"
			className={classes.navbar}
		>
			<Navbar.Section
				px="md"
				sx={(theme) => ({
					marginLeft: -theme.spacing.md,
					marginRight: -theme.spacing.md,
					borderBottom: `1px solid ${
						theme.colorScheme === "dark"
							? theme.colors.dark[4]
							: theme.colors.gray[3]
					}`,
				})}
			>
				<ShellHeader
					sx={(theme) => ({
						paddingBottom: theme.spacing.md,
					})}
				/>
			</Navbar.Section>

			<Navbar.Section className={classes.section}>
				{skeleton ? (
					<>
						<Skeleton height={8} width="60%" mb={"sm"} />
						<Skeleton height={8} width="30%" />
					</>
				) : (
					<Popover
						opened={showProjectPopper}
						style={{ width: "100%" }}
						spacing="xs"
						onClose={() =>
							!isLoadingProjects && setShowProjectPopper(false)
						}
						target={
							<UserButton
								name={project.name}
								email={project.description}
								icon={<Selector size={14} />}
								onClick={() =>
									!isLoadingProjects &&
									setShowProjectPopper((o) => !o)
								}
							/>
						}
						position="right"
						placement="end"
						withArrow
					>
						<ScrollArea
							type="hover"
							scrollbarSize={8}
							styles={{
								viewport: { maxHeight: "300px" },
								thumb: { opacity: 0.8 },
							}}
						>
							<Stack style={{ width: 250 }} spacing={0}>
								{projects.map((p) => (
									<UserButton
										key={p._id}
										name={p.name}
										email={p.description}
										icon={<></>}
										onClick={() => {
											setShowProjectPopper(false);
											navigate("/project/" + p._id);
										}}
									/>
								))}
							</Stack>
						</ScrollArea>
					</Popover>
				)}
			</Navbar.Section>

			{/* 	<TextInput
				placeholder="Search"
				size="xs"
				icon={<Search size={12} />}
				rightSectionWidth={70}
				rightSection={
					<Code className={classes.searchCode}>Ctrl + K</Code>
				}
				styles={{ rightSection: { pointerEvents: "none" } }}
				mb="sm"
			/> */}

			<Navbar.Section className={classes.section}>
				<div className={classes.mainLinks}>{mainLinks}</div>
			</Navbar.Section>

			<Navbar.Section
				component={ScrollArea}
				grow
				className={classes.section}
				mb="0"
			>
				<Group className={classes.roomsHeader} position="apart">
					{/* TODO: Fix do scroll */}
					<Text size="xs" weight={500} color="dimmed">
						Salas de Chat {/* TODO: Adicionar tradução */}
					</Text>
					<Tooltip label="Adicionar Sala" withArrow position="right">
						<ActionIcon
							variant="default"
							size={18}
							onClick={() => {
								setAddRoom(true);
							}}
						>
							<Plus size={12} />
						</ActionIcon>
					</Tooltip>
				</Group>

				<div className={classes.rooms}>
					{addRoom && (
						<>
							<TextInput
								size="xs"
								onChange={(event) =>
									setNewRoom(event.currentTarget.value)
								}
							/>
							<Group my="xs">
								<ActionIcon
									onClick={() => {
										addRoomMutation.mutate(newRoom);
										setAddRoom(false);
									}}
								>
									<Check />
								</ActionIcon>
								<ActionIcon onClick={() => setAddRoom(false)}>
									<X />
								</ActionIcon>
							</Group>
						</>
					)}

					{roomsLinks}
				</div>
			</Navbar.Section>

			<Navbar.Section
				sx={(theme) => ({
					marginLeft: -theme.spacing.md,
					marginRight: -theme.spacing.md,
					marginBottom: 0,
				})}
			>
				{authIsLoading ? (
					<Grid>
						<Grid.Col span={3}>
							<Skeleton height={40} circle m={"md"} />
						</Grid.Col>
						<Grid.Col span={9} my={"lg"}>
							<Skeleton height={8} width="60%" mb={"sm"} />
							<Skeleton height={8} width="30%" />
						</Grid.Col>
					</Grid>
				) : (
					<Menu
						withArrow
						placement="start"
						position="right"
						style={{
							width: "100%",
							height: "100%",
						}}
						control={
							<UserButton
								image={"/assets/" + user.image}
								name={user.fullName}
								email={user.email}
							/>
						}
					>
						<Menu.Label>Application</Menu.Label>
						<Menu.Item
							icon={<Settings size={14} />}
							onClick={() => navigate("/settings")}
						>
							Settings
						</Menu.Item>

						<Menu.Item icon={<Logout size={14} />} onClick={logOut}>
							Logout
						</Menu.Item>

						<Divider />

						<Menu.Label>Danger zone</Menu.Label>
						<Menu.Item
							color="red"
							icon={<Trash size={14} />}
							onClick={() => navigate("/settings/user")}
						>
							Delete my account
						</Menu.Item>
					</Menu>
				)}
			</Navbar.Section>
		</Navbar>
	);
}
