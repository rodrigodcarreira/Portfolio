import { Button, createStyles, Group } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";

const useStyles = createStyles((theme) => ({
	wrapper: {
		backgroundSize: "cover",
		backgroundImage:
			"url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",

		width: "75%",
	},

	form: {
		maxWidth: 450,
		paddingTop: 40,
		marginLeft: "auto",

		[`@media (max-width: ${theme.breakpoints.sm}px)`]: {
			maxWidth: "100%",
		},
	},

	content: {
		//width: "100%",
		boxSizing: "border-box",
		position: "absolute",
	},

	title: {
		color: theme.colorScheme === "dark" ? theme.white : theme.black,
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
	},
}));

function PhotoForm({ styles }) {
	const { t } = useTranslation();
	const insertPhoto = async ({ photo }) => {
		try {
			const { data } = await api.post("/api/users", {
				photo,
			});
			console.log(data);
		} catch (err) {
			console.log(err.response.data);
			err.response.data.data.forEach((e) => {
				form.setFieldError(e.field, e.message);
			});
		}
	};

	const form = useForm({
		initialValues: {
			photo: "",
		},
	});

	const { classes } = useStyles();
	const openRef = useRef();
	return (
		<div className={classes.content} style={styles}>
			<form onSubmit={form.onSubmit((values) => insertPhoto(values))}>
				<Dropzone openRef={openRef} {...form.getInputProps("username")}>
					{(styles) => {}}{" "}
				</Dropzone>
				<Group position="center" mt="md">
					<Button onClick={() => openRef.current()}>
						{t("uploadPhoto")}
					</Button>
				</Group>
			</form>
		</div>
	);
}

export default PhotoForm;
