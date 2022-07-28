import {
	ActionIcon,
	Burger,
	Container,
	createStyles,
	Group,
	Header as MantineHeader,
	Menu,
	Paper,
	Title,
	Transition,
	useMantineColorScheme,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import React from "react";
import { ReactCountryFlag } from "react-country-flag";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { Language, MoonStars, Sun } from "tabler-icons-react";

const useStyles = createStyles((theme, _params, getRef) => {
	const icon = getRef("icon");
	return {
		root: {
			position: "relative",
			zIndex: 10,
		},
		dropdown: {
			position: "absolute",
			top: HEADER_HEIGHT,
			left: 0,
			right: 0,
			zIndex: 0,
			borderTopRightRadius: 0,
			borderTopLeftRadius: 0,
			borderTopWidth: 0,
			overflow: "hidden",
		},

		link: {
			...theme.fn.focusStyles(),
			display: "flex",
			alignItems: "center",
			textDecoration: "none",
			fontSize: theme.fontSizes.sm,
			color:
				theme.colorScheme === "dark"
					? theme.colors.dark[1]
					: theme.colors.gray[7],
			padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
			borderRadius: theme.radius.sm,
			fontWeight: 500,

			"&:hover": {
				backgroundColor:
					theme.colorScheme === "dark"
						? theme.colors.dark[6]
						: theme.colors.gray[0],
				color: theme.colorScheme === "dark" ? theme.white : theme.black,

				[`& .${icon}`]: {
					color:
						theme.colorScheme === "dark"
							? theme.white
							: theme.black,
				},
			},
		},

		linkActive: {
			"&, &:hover": {
				backgroundColor:
					theme.colorScheme === "dark"
						? theme.fn.rgba(
								theme.colors[theme.primaryColor][9],
								0.25
						  )
						: theme.colors[theme.primaryColor][0],
				color: theme.colors[theme.primaryColor][
					theme.colorScheme === "dark" ? 3 : 7
				],
			},
		},

		linkIcon: {
			ref: icon,
			color:
				theme.colorScheme === "dark"
					? theme.colors.dark[2]
					: theme.colors.gray[6],
			marginRight: theme.spacing.sm,
		},
	};
});

const HEADER_HEIGHT = 60;

function Header({ data, ...props }) {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();
	const [opened, toggleOpened] = useBooleanToggle(false);
	const { i18n } = useTranslation();
	const { classes, cx } = useStyles();

	const links = data.map((item) => (
		<NavLink
			className={({ isActive }) =>
				cx(classes.link, { [classes.linkActive]: isActive })
			}
			to={item.link}
			key={item.label}
		>
			<item.icon className={classes.linkIcon} />
			<span>{item.label}</span>
		</NavLink>
	));

	return (
		<MantineHeader {...props} className={classes.root}>
			<Container
				sx={{
					height: HEADER_HEIGHT,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Burger
					opened={opened}
					onClick={() => toggleOpened()}
					size="sm"
					sx={(theme) => ({
						marginRight: theme.spacing.md,
						...theme.fn.focusStyles(),
					})}
				/>

				<Link to={"/"} style={{ textDecoration: "none" }}>
					<Title>JERR</Title>
				</Link>

				<Group spacing={0} position="right" noWrap>
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
				</Group>

				<Transition transition="fade" duration={200} mounted={opened}>
					{(styles) => (
						<Paper
							className={classes.dropdown}
							withBorder
							style={styles}
						>
							<Container onClick={() => toggleOpened()}>
								{links}
							</Container>
						</Paper>
					)}
				</Transition>
			</Container>
		</MantineHeader>
	);
}

export default Header;
