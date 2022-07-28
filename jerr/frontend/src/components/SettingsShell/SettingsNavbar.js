import { Box, createStyles, Navbar } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Logout } from "tabler-icons-react";
import useAuth from "../../context/auth";
import ShellHeader from "../ShellHeader";

const useStyles = createStyles((theme, _params, getRef) => {
	const icon = getRef("icon");
	return {
		header: {
			paddingBottom: theme.spacing.md,
			marginBottom: theme.spacing.md * 1.5,
			borderBottom: `1px solid ${
				theme.colorScheme === "dark"
					? theme.colors.dark[4]
					: theme.colors.gray[2]
			}`,
		},

		footer: {
			paddingTop: theme.spacing.md,
			marginTop: theme.spacing.md,
			borderTop: `1px solid ${
				theme.colorScheme === "dark"
					? theme.colors.dark[4]
					: theme.colors.gray[2]
			}`,
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

		linkIcon: {
			ref: icon,
			color:
				theme.colorScheme === "dark"
					? theme.colors.dark[2]
					: theme.colors.gray[6],
			marginRight: theme.spacing.sm,
		},

		linkActive: {
			"&, &:hover": {
				backgroundColor:
					theme.colorScheme === "dark"
						? theme.fn.rgba(
								theme.colors[theme.primaryColor][8],
								0.25
						  )
						: theme.colors[theme.primaryColor][0],
				color:
					theme.colorScheme === "dark"
						? theme.white
						: theme.colors[theme.primaryColor][7],
				[`& .${icon}`]: {
					color: theme.colors[theme.primaryColor][
						theme.colorScheme === "dark" ? 5 : 7
					],
				},
			},
		},
	};
});

export default function SettingsNavbar({ data, ...props }) {
	const { t } = useTranslation();

	const { classes, cx } = useStyles();
	const { logOut } = useAuth();

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
		<Navbar {...props} width={{ sm: 300 }} height="100vh" p="md">
			<Navbar.Section grow>
				<ShellHeader className={classes.header} />
				{links}
			</Navbar.Section>
			<Navbar.Section className={classes.footer}>
				<Box
					style={{ cursor: "pointer" }}
					className={classes.link}
					onClick={(event) => {
						event.preventDefault();
						logOut();
					}}
				>
					<Logout className={classes.linkIcon} />
					<span>{t("logout")}</span>
				</Box>
			</Navbar.Section>
		</Navbar>
	);
}
