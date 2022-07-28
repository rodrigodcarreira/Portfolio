import { Button, Container, createStyles, Group, Title } from "@mantine/core";
import { t } from "i18next";
import React from "react";

const useStyles = createStyles((theme) => ({
	root: {
		paddingTop: 30,
		paddingBottom: 30,
	},

	label: {
		textAlign: "center",
		fontWeight: 900,
		fontSize: 220,
		lineHeight: 1,
		marginBottom: theme.spacing.xl * 0.5,
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[4]
				: theme.colors.gray[2],

		[theme.fn.smallerThan("sm")]: {
			fontSize: 20,
		},
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		textAlign: "center",
		fontWeight: 900,
		fontSize: 38,
		marginBottom: theme.spacing.xl * 0.5,

		[theme.fn.smallerThan("sm")]: {
			fontSize: 12,
		},
	},

	button: {
		fontSize: 32,
	},
}));

function Error403Denied() {
	const { classes } = useStyles();

	return (
		<Container className={classes.root}>
			<div className={classes.label}>403</div>
			<Title className={classes.title}>{t("permissionDenided")}</Title>
			<Group position="center">
				<Button size="xl" className={classes.button} variant="subtle">
					{t("backHome")}
				</Button>
			</Group>
		</Container>
	);
}

export default Error403Denied;
