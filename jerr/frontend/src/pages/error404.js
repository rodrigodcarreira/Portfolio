import {
	Button,
	Container,
	createStyles,
	SimpleGrid,
	Text,
	Title,
} from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import image from "../assets/404.svg";

const useStyles = createStyles((theme) => ({
	root: {
		paddingTop: 80,
		paddingBottom: 80,
	},

	title: {
		fontWeight: 900,
		fontSize: 34,
		marginBottom: theme.spacing.md,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,

		[theme.fn.smallerThan("sm")]: {
			fontSize: 32,
		},
	},

	control: {
		[theme.fn.smallerThan("sm")]: {
			width: "100%",
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
}));

export function Error404Found() {
	const { classes } = useStyles();

	const { t } = useTranslation();
	const navigate = useNavigate();

	return (
		<Container className={classes.root}>
			<SimpleGrid
				spacing={80}
				cols={2}
				breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}
			>
				<img src={image} alt={"404"} className={classes.mobileImage} />
				<div>
					<Title className={classes.title}>
						Something is not right...
					</Title>
					<Text color="dimmed" size="lg">
						Page you are trying to open does not exist. You may have
						mistyped the address, or the page has been moved to
						another URL. If you think this is an error contact
						support.
					</Text>
					<Button
						variant="outline"
						size="md"
						mt="xl"
						className={classes.control}
						onClick={() => navigate("/")}
					>
						{t("backHome")}
					</Button>
				</div>
				<img src={image} alt={"404"} className={classes.desktopImage} />
			</SimpleGrid>
		</Container>
	);
}

export default Error404Found;
