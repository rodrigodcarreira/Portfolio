import {
	Box,
	Button,
	Container,
	createStyles,
	Overlay,
	Text,
	Title,
} from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router";

const useStyles = createStyles((theme) => ({
	hero: {
		width: "100%",
		height: "100%",
		backgroundImage:
			"url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)",
		backgroundSize: "cover",

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			backgroundImage: "none",
		},

		display: "flex",
		flexDirection: "column",
		justifyContent: "end",
	},

	container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-end",
		alignItems: "flex-start",
		paddingBottom: theme.spacing.xl * 6,
		zIndex: 1,
		position: "relative",

		[theme.fn.smallerThan("sm")]: {
			height: 500,
			paddingBottom: theme.spacing.xl * 3,
		},
	},

	title: {
		color: theme.white,
		fontSize: 60,
		fontWeight: 900,
		lineHeight: 1.1,

		[theme.fn.smallerThan("sm")]: {
			fontSize: 40,
			lineHeight: 1.2,
		},

		[theme.fn.smallerThan("xs")]: {
			fontSize: 28,
			lineHeight: 1.3,
		},
	},

	description: {
		color: theme.white,
		maxWidth: 600,

		[theme.fn.smallerThan("sm")]: {
			maxWidth: "100%",
			fontSize: theme.fontSizes.sm,
		},
	},

	control: {
		marginTop: theme.spacing.xl * 1.5,
		marginLeft: theme.spacing.xl * 1.5,

		[theme.fn.smallerThan("sm")]: {
			width: "100%",
		},
	},
}));

export const Workspace = () => {
	const { classes } = useStyles();

	let navigate = useNavigate();

	return (
		<div className={classes.hero}>
			<Overlay
				gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
				opacity={1}
				zIndex={0}
			/>
			<Container className={classes.container}>
				<Title className={classes.title}>
					Obrigado por entrar no {""}
					<Text
						component="span"
						variant="gradient"
						gradient={{ from: "blue", to: "cyan" }}
						inherit
					>
						JERR
					</Text>{" "}
				</Title>

				<Text className={classes.description} size="xl" mt="xl">
					Esta platforma é um projeto para ajudar os alunos a
					organizarem os seus projetos de forma mais eficiente.
				</Text>

				<Box>
					<Button
						variant="gradient"
						size="xl"
						radius="xl"
						className={classes.control}
						onClick={() => navigate("/settings/teams")}
					>
						Equipa
					</Button>
					<Button
						variant="gradient"
						size="xl"
						radius="xl"
						className={classes.control}
						onClick={() => navigate("/settings/projects")}
					>
						Projetos
					</Button>
					<Button
						size="xl"
						radius="xl"
						className={classes.control}
						onClick={() => navigate("/settings/user")}
					>
						Perfil
					</Button>
				</Box>
			</Container>
		</div>
	);
};

export default Workspace;
