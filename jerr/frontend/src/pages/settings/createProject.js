import {
	Container,
	Group,
	TextInput,
	Title,
	Box,
	Button,
	Textarea,
	LoadingOverlay,
	Divider,
	Autocomplete,
	Select,
	ActionIcon,
	Text,
	Table,
	Avatar,
} from "@mantine/core";
import React, { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import api from "../../services/api";
import { formList } from "@mantine/form";
import { Trash } from "tabler-icons-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";

export const CreateProject = () => {
	const { t } = useTranslation();
	const notify = useNotifications();
	const [criteria, setCriteria] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const searchUsers = () =>
		criteria.length > 2
			? api.get("/users/search/" + criteria).then((res) => res.data)
			: null;

	const {
		data: users,
		isLoading,
		error,
		isSuccess,
	} = useQuery(["hintUsers", criteria], searchUsers);

	const createproject = async (values) => {
		try {
			const { data } = await api.post("/projects", values);

			return data;
		} catch (err) {
			throw err.response.data;
		}
	};

	const form = useForm({
		initialValues: {
			//verificar se os nomes no backend sao iguais aos do frontend
			name: "",
			description: "",
			employees: formList([
				{
					id: "",
					name: "",
					email: "",
					role: "",
				},
			]),
		},

		validate: {
			name: (value) => {
				if (!value) {
					return t("required"); //mensagem de erro
				}
			},
			description: (value) => {
				//verificar se o campo esta vazio
				if (!value) {
					return t("required"); //mensagem de erro
				}
			},
		},
	});

	const insertProject = async (values) => {
		setLoading(true);
		try {
			const create = await createproject(values);
			notify.showNotification({
				title: t("projectCreated"),
				message: t("messageProjectCreated"),
			});
			navigate("/settings/project/" + create._id + "/addMembers", {
				replace: true,
			});
		} catch (err) {
			err.data?.forEach((e) => {
				form.setFieldError(e.field, t(e.message));
			});
		}
		setLoading(false);
	};
	//TODO: inserir chaves para internacionalização!!!!

	return (
		<Container ml="0" size={"sm"}>
			<Title mb="xl">{t("createProjectTitle")}</Title>
			<form onSubmit={form.onSubmit((values) => insertProject(values))}>
				<TextInput
					placeholder={t("projectName")}
					mb="xs"
					{...form.getInputProps("name")}
					label={t("name")}
					disabled={loading}
				/>
				<Textarea
					placeholder={t("projectDescription")}
					mb="xl"
					{...form.getInputProps("description")}
					label={t("description")}
					disabled={loading}
				/>

				<Button ml={"auto"} type="submit" loading={loading} mt="md">
					{t("createProjectButton")}
				</Button>
			</form>
		</Container>
	);
};
