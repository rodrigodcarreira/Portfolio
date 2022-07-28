import {
	ActionIcon,
	Box,
	Burger,
	Container,
	createStyles,
	Group,
	Header,
	Menu,
	Paper,
	Title,
	Transition,
	useMantineColorScheme,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import React from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Language, MoonStars, Sun } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
	inner: {
		height: 56,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},

	dropdown: {
		position: "absolute",
		top: 56,
		left: 0,
		right: 0,
		zIndex: 0,
		borderTopRightRadius: 0,
		borderTopLeftRadius: 0,
		borderTopWidth: 0,
		overflow: "hidden",
		padding: 0,

		[theme.fn.largerThan("sm")]: {
			display: "none",
		},
	},

	links: {
		[theme.fn.smallerThan("sm")]: {
			display: "none",
		},
	},

	responsiveLinks: {
		[theme.fn.largerThan("sm")]: {
			display: "none",
		},
		padding: 0,
		zIndex: 100,
	},

	link: {
		display: "block",
		lineHeight: 1,
		padding: "8px 12px",
		borderRadius: theme.radius.sm,
		textDecoration: "none",
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[0]
				: theme.colors.gray[0],
		fontSize: theme.fontSizes.sm,
		fontWeight: 500,

		"&:hover": {
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[6]
					: theme.colors.gray[0],
			color: theme.colors.violet[7],
		},

		[theme.fn.smallerThan("sm")]: {
			zIndex: 100,
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[6]
					: theme.colors.gray[0],

			padding: "12px",
			color: theme.colorScheme === "dark" ? theme.white : theme.black,
		},
	},

	icon: {
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[0]
				: theme.colors.gray[0],
		fontSize: theme.fontSizes.sm,
		fontWeight: 500,

		"&:hover": {
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[6]
					: theme.colors.gray[0],
			color: theme.colors.violet[7],
		},
	},

	linkLabel: {
		marginRight: 5,
	},
}));

export const AuthHeader = ({ links }) => {
	const [opened, toggleOpened] = useBooleanToggle(false);
	const { classes } = useStyles();
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const { i18n } = useTranslation();

	const items = links.map((link) => {
		return (
			<Link key={link.label} to={link.link} className={classes.link}>
				{link.label}
			</Link>
		);
	});
	return (
		<Header
			height={56}
			style={{
				backgroundColor: "transparent",
				boxShadow: "none",
				border: "none",
			}}
		>
			<Container size={"xl"}>
				<div className={classes.inner}>
					<Title>JERR</Title>
					<Group spacing={5} className={classes.links}>
						{items}
						<Menu
							control={
								<ActionIcon
									variant="hover"
									size="lg"
									className={classes.icon}
								>
									<Language size={16} />
								</ActionIcon>
							}
						>
							<Menu.Label>Línguas</Menu.Label>
							<Menu.Item
								icon={
									<ReactCountryFlag
										countryCode="PT"
										style={{
											fontSize: "1.25em",
											lineHeight: "1.25em",
										}}
										svg
									/>
								}
								onClick={() => i18n.changeLanguage("pt")}
							>
								Português
							</Menu.Item>
							<Menu.Item
								icon={
									<ReactCountryFlag
										countryCode="US"
										style={{
											fontSize: "1.25em",
											lineHeight: "1.25em",
										}}
										svg
									/>
								}
								onClick={() => {
									i18n.changeLanguage("en");
								}}
							>
								English
							</Menu.Item>
						</Menu>
						<ActionIcon
							variant="hover"
							onClick={() => toggleColorScheme()}
							className={classes.icon}
							size="lg"
						>
							{colorScheme === "dark" ? (
								<Sun size={16} />
							) : (
								<MoonStars size={16} />
							)}
						</ActionIcon>
					</Group>
					<Group spacing={5} className={classes.responsiveLinks}>
						<Menu
							control={
								<ActionIcon variant="hover" size="lg">
									<Language size={16} />
								</ActionIcon>
							}
						>
							<Menu.Label>Línguas</Menu.Label>
							<Menu.Item
								icon={
									<ReactCountryFlag
										countryCode="PT"
										style={{
											fontSize: "1.25em",
											lineHeight: "1.25em",
										}}
										svg
									/>
								}
								onClick={() => i18n.changeLanguage("pt")}
							>
								Português
							</Menu.Item>
							<Menu.Item
								icon={
									<ReactCountryFlag
										countryCode="US"
										style={{
											fontSize: "1.25em",
											lineHeight: "1.25em",
										}}
										svg
									/>
								}
								onClick={() => {
									i18n.changeLanguage("en");
								}}
							>
								English
							</Menu.Item>
						</Menu>
						<ActionIcon
							variant="hover"
							onClick={() => toggleColorScheme()}
							size="lg"
						>
							{colorScheme === "dark" ? (
								<Sun size={16} />
							) : (
								<MoonStars size={16} />
							)}
						</ActionIcon>
						<Burger
							opened={opened}
							onClick={() => toggleOpened()}
							size={16}
							color={colorScheme === "dark" ? "white" : "black"}
						/>
					</Group>
					<Transition
						transition="scale-y"
						duration={200}
						mounted={opened}
					>
						{(styles) => (
							<Paper
								className={classes.dropdown}
								withBorder
								style={{ ...styles, zIndex: 100 }}
							>
								<Box onClick={() => toggleOpened()}>
									{items}
								</Box>
							</Paper>
						)}
					</Transition>
				</div>
			</Container>
		</Header>
	);
};
