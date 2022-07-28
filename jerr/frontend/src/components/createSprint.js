import { Button, Container, Group, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useNotifications } from "@mantine/notifications";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { Calendar } from "tabler-icons-react";
import api from "../services/api";

export const CreateSprint = ({ idProject, close, type }) => {
	const { t } = useTranslation();
	const notify = useNotifications();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const createSprintMutate = useMutation(
		async (sprint) =>
			await api
				.post(`/projects/${idProject}/sprints`, sprint)
				.then((res) => res.data),

		{
			onSuccess: (sprint) => {
				notify.showNotification({
					title: t("success"),
					message: t("success"),
				});
				type === "firstCreate" &&
					navigate(`/project/${idProject}/board/${sprint._id}`);
			},
			onError: (err) => {
				notify.showNotification({
					title: "Erro",
					message: "Erro ao criar sprint",
				});
			},
			onSettled: () => {
				queryClient.invalidateQueries(["sprints", idProject]);
				close();
			},
		}
	);

	const form = useForm({
		initialValues: {
			//verificar se os nomes no backend sao iguais aos do frontend
			title: "",
			startAt: "",
			endAt: "",
		},

		validate: {
			title: (value) => {
				if (!value) {
					return t("required"); //mensagem de erro
				}
			},
			startAt: (value) => {
				//verificar se o campo esta vazio
				if (!value) {
					return t("required"); //mensagem de erro
				}
			},
			endAt: (value) => {
				//verificar se o campo esta vazio
				if (!value) {
					return t("required"); //mensagem de erro
				}
			},
		},
	});

	//TODO: inserir chaves para internacionalização!!!!

	return (
		<Container ml="0" size={"sm"}>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (!form.validate().hasErrors)
						createSprintMutate.mutate(form.values);
				}}
			>
				<TextInput
					placeholder={t("sprintName")}
					mb="xs"
					{...form.getInputProps("title")}
					label={t("name")}
				/>

				<Group position="apart" grow>
					<DatePicker
						placeholder={t("pickDate")}
						label={t("dateStart")}
						inputFormat="MM/DD/YYYY"
						labelFormat="MM/DD/YYYY"
						{...form.getInputProps("startAt")}
						icon={<Calendar size={16} />}
					/>

					<DatePicker
						placeholder={t("pickDate")}
						label={t("dateEnd")}
						inputFormat="MM/DD/YYYY"
						labelFormat="MM/DD/YYYY"
						{...form.getInputProps("endAt")}
						icon={<Calendar size={16} />}
					/>
				</Group>

				<Button
					ml={"auto"}
					type="submit"
					mt="md"
					loading={createSprintMutate.isLoading}
				>
					{t("createSprint")}
				</Button>
			</form>
		</Container>
	);
};
