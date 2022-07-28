import { Container, TextInput, Title, Button, Group } from "@mantine/core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import api from "../../../services/api";
import { formList } from "@mantine/form";
import { useQuery } from "react-query";
import { useNavigate } from "react-router";
import useAuth from "../../../context/auth";
import SelectMember from "../../../components/SelectMember";
import MembersTable from "../../../components/MembersTable";
import { X, Check } from "tabler-icons-react";

export const CreateTeam = () => {
	const { t } = useTranslation();
	const notify = useNotifications();
	const [criteria, setCriteria] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const auth = useAuth();

	const searchUsers = () =>
		criteria.length > 2
			? api.get("/users/search/" + criteria).then((res) => res.data)
			: null;

	const { data: isLoading } = useQuery(["hintUsers", criteria], searchUsers);

	const createTeam = async (values) => {
		try {
			const list = [];
			listMembers.forEach((member) => {
				list.push(member._id);
			});
			values.members = list;
			const { data } = await api.post("/teams", values);

			return data;
		} catch (err) {
			throw err.response.data;
		}
	};

	const [listMembers, setListMembers] = useState([]);

	const form = useForm({
		initialValues: {
			//verificar se os nomes no backend sao iguais aos do frontend
			name: "",
			members: [],
		},

		validate: {
			name: (value) => {
				if (!value) {
					return t("required"); //mensagem de erro
				}
			},
		},
	});

	const addMemMutation = (newMember) => {
		var verify = true;

		if (newMember._id === auth.user._id) {
			notify.showNotification({
				title: t("ownerAlreadyAdded"),
				message: t("ownerAlreadyAddedBody"),
				color: "red",
				icon: <X />,
			});
			verify = false;
		}

		listMembers.forEach((member) => {
			if (member._id === newMember._id) {
				notify.showNotification({
					title: t("memberAlreadyAdded"),
					message: t("memberAlreadyAddedBody"),
					color: "red",
					icon: <X />,
				});
				verify = false;
			}
		});
		if (verify) setListMembers((current) => [...current, newMember]);
	};

	const insertTeam = async (values) => {
		setLoading(true);
		try {
			const create = await createTeam(values);
			notify.showNotification({
				title: t("teamCreated"),
				message: t("messageteamCreated"),
				color: "green",
				icon: <Check />,
			});
			navigate("/settings/teams");
		} catch (err) {
			if (err.code === 422) {
				notify.showNotification({
					title: t("teamAlreadyExists"),
					message: t("messageteamAlreadyExists"),
					color: "red",
					icon: <X />,
				});
			}
		}
		setLoading(false);
	};

	return (
		<Container ml="0" size={"sm"}>
			<Title mb="xl">{t("createTeamTitle")}</Title>
			<form onSubmit={form.onSubmit((values) => insertTeam(values))}>
				<TextInput
					placeholder={t("teamName")}
					mb="xs"
					{...form.getInputProps("name")}
					label={t("name")}
					disabled={loading}
				/>
				<Group position="letf" mt="md">
					<SelectMember
						sx={{ flex: 1 }}
						onChange={(user) => {
							addMemMutation(user);
						}}
					/>
				</Group>
				<MembersTable
					data={
						isLoading
							? Array(5)
									.fill({ loading: true })
									.map((u, i) => {
										u.id = i;
										u.loading = true;
										return u;
									})
							: listMembers
					}
					onDeleteUser={(id) => {
						setListMembers((current) =>
							current.filter((obj) => {
								return obj._id !== id;
							})
						);
					}}
				/>
				<Button ml={"auto"} type="submit" loading={loading} mt="md">
					{t("createTeamButton")}
				</Button>
			</form>
		</Container>
	);
};
