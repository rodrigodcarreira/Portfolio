import React from "react";
import {
	createStyles,
	Image,
	Container,
	Title,
	Button,
	Group,
	Text,
	List,
	ThemeIcon,
} from "@mantine/core";
import { Check } from "tabler-icons-react";
import image from "../assets/home_image.svg";
import { AuthHeader } from "../components/AuthHeader";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const useStyles = createStyles((theme) => ({
	inner: {
		display: "flex",
		justifyContent: "space-between",
		paddingTop: theme.spacing.xl * 2,
		paddingBottom: theme.spacing.xl * 2,
	},

	content: {
		maxWidth: 480,
		marginRight: theme.spacing.xl * 3,

		[theme.fn.smallerThan("md")]: {
			maxWidth: "100%",
			marginRight: 0,
		},
	},

	title: {
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		fontSize: 44,
		lineHeight: 1.2,
		fontWeight: 900,

		[theme.fn.smallerThan("xs")]: {
			fontSize: 28,
		},
	},

	topWave: {
		zIndex: -1,
		position: "absolute",
		top: 0,
		right: 0,

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			display: "none",
		},
	},

	control: {
		[theme.fn.smallerThan("xs")]: {
			flex: 1,
		},
	},

	image: {
		flex: 1,
		width: 240,
		marginLeft: "auto",
		marginRight: "auto",

		[theme.fn.smallerThan("md")]: {
			display: "none",
		},
	},

	mobileImage: {
		[theme.fn.largerThan("sm")]: {
			display: "none",
		},
	},

	desktopImage: {
		[theme.fn.smallerThan("sm")]: {
			display: "none",
		},
	},

	highlight: {
		position: "relative",
		backgroundColor:
			theme.colorScheme === "dark"
				? theme.fn.rgba(theme.colors[theme.primaryColor][6], 0.55)
				: theme.colors[theme.primaryColor][0],
		borderRadius: theme.radius.sm,
		padding: "4px 12px",
	},
}));

export function Home() {
	const { classes } = useStyles();
	const { t } = useTranslation();
	let navigate = useNavigate();

	return (
		<div>
			<AuthHeader
				links={[
					{
						link: "/home",
						label: "Home",
					},
					{
						link: "/login",
						label: "Iniciar Sessão",
					},
					{
						link: "/register",
						label: "Registo",
					},
				]}
			/>
			<svg
				id="visual"
				viewBox="0 0 1440 800"
				width="1440"
				height="800"
				xmlns="http://www.w3.org/2000/svg"
				xlink="http://www.w3.org/1999/xlink"
				version="1.1"
				className={classes.topWave}
			>
				<g transform="translate(1527.5033169975059 9.21853953830373)">
					<path
						d="M119.1 -238.8C166.1 -155.1 224 -141.9 321.3 -97.3C418.6 -52.7 555.3 23.4 539.1 71.6C523 119.8 354.1 140.1 260.1 196.1C166.1 252.2 147 343.9 89.9 406.4C32.9 468.9 -62.2 502.1 -119.1 460.4C-176.1 418.7 -195 302 -300.8 231.8C-406.5 161.5 -599.2 137.7 -675.6 55.6C-752 -26.4 -712.1 -166.7 -610.1 -232.4C-508.2 -298 -344.1 -289.1 -232.1 -343.1C-120 -397.1 -60 -514 -12 -495.4C36 -476.8 72.1 -322.5 119.1 -238.8"
						fill="#6741D9"
					></path>
				</g>
			</svg>
			<Container>
				<div className={classes.inner}>
					<div className={classes.content}>
						<Title className={classes.title}>
							Com o<span className={classes.highlight}>JERR</span>{" "}
							tudo
							<br /> tudo é mais facil
						</Title>
						<Text color="dimmed" mt="md">
							Build fully functional accessible web applications
							faster than ever – Mantine includes more than 120
							customizable components and hooks to cover you in
							any situation
						</Text>

						<List
							mt={30}
							spacing="sm"
							size="sm"
							icon={
								<ThemeIcon size={20} radius="xl">
									<Check size={12} />
								</ThemeIcon>
							}
						>
							<List.Item>
								<b>TypeScript based</b> – build type safe
								applications, all components and hooks export
								types
							</List.Item>
							<List.Item>
								<b>Free and open source</b> – all packages have
								MIT license, you can use Mantine in any project
							</List.Item>
							<List.Item>
								<b>No annoying focus ring</b> – focus ring will
								appear only when user navigates with keyboard
							</List.Item>
						</List>

						<Group mt={30}>
							<Button
								radius="xl"
								size="md"
								className={classes.control}
								onClick={() => navigate("/login")}
							>
								{t("login")}
							</Button>
							<Button
								variant="default"
								radius="xl"
								size="md"
								className={classes.control}
								onClick={() => navigate("/register")}
							>
								{t("register")}
							</Button>
						</Group>
					</div>

					<img src={image} alt={"home"} className={classes.image} />
				</div>
			</Container>
		</div>
	);
}

export default Home;
