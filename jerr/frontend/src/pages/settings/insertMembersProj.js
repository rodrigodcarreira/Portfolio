import { Button, Container, Divider, Group, Title } from "@mantine/core";
import { useNotifications } from "@mantine/notifications";
import React from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import MembersTable from "../../components/MembersTable";
import SelectMember from "../../components/SelectMember";
import api from "../../services/api";

export const InsertMembersProject = () => {
	const { t } = useTranslation();
	const notify = useNotifications();
	const { projectId } = useParams();

	const queryClient = useQueryClient();

	const rolesData = ["Administrador", "Colaborador", "Estagiário"];

	const { data: project, isLoading } = useQuery("project", () =>
		api.get("/projects/" + projectId).then((res) => res.data)
	);

	const addMemMutation = useMutation(
		(newMember) => {
			return api.put("/projects/" + projectId, {
				members: [...project.members.map((u) => u._id), newMember._id],
			});
		},
		{
			onMutate: async (newMember) => {
				queryClient.cancelQueries("project");

				newMember.loading = true;

				queryClient.setQueryData("project", (old) => ({
					...old,
					members: [...old.members, newMember],
				}));
			},
			onSettled: (data) => {
				queryClient.invalidateQueries("project");
			},
		}
	);

	const removeMemberMutation = useMutation(
		(memberId) => {
			return api.put("/projects/" + projectId, {
				members: project.members
					.map((u) => u._id)
					.filter((id) => id !== memberId),
			});
		},
		{
			onMutate: async (memberId) => {
				queryClient.cancelQueries("project");

				queryClient.setQueryData("project", (old) => ({
					...old,
					members: old.members.filter((u) => u._id !== memberId),
				}));
			},
			onSettled: (data) => {
				queryClient.invalidateQueries("project");
			},
		}
	);

	//TODO: inserir chaves para internacionalização!!!!

	return (
		<Container ml="0" size={"md"} styles={{ position: "relative" }}>
			<Title mb="xl">Inserir Membros</Title>

			<Group position="letf" mt="md">
				<SelectMember
					sx={{ flex: 1 }}
					onChange={(user) => {
						addMemMutation.mutate(user);
					}}
				/>
				<Button>Importar Equipa</Button>
			</Group>
			<Divider mt="md" mb="xs" />
			{/* <LoadingOverlay visible={addMemMutation.isLoading} /> */}
			{/* {isLoading ? (
				<Loader />
			) : ( */}
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
						: project.members
				}
				onDeleteUser={(id) => {
					removeMemberMutation.mutate(id);
				}}
			/>
			{/* )} */}
		</Container>
	);
};
