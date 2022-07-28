import {
	Button,
	Input,
	Title,
	Container,
	Box,
	Group,
	Space,
	Table,
	Avatar,
	AvatarsGroup,
	Loader,
	Center,
	ActionIcon,
} from "@mantine/core";
import { Edit, Search, Eye, Trash } from "tabler-icons-react";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export const ListProject = () => {
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();
	const { t } = useTranslation();
	const notify = useNotifications();
	const [search, setSearch] = useState("");

	let navigate = useNavigate();

	const { data: datas, isFetching } = useQuery(
		"repoData",
		async () => await api.get("/projects").then((res) => res.data)
	);

	const mutationDeleteProject = useMutation(
		async (id) =>
			await api.delete(`/projects/${id}`).then((res) => res.data),
		{
			onSuccess: () => {
				notify.showNotification({
					title: t("success"),
					message: t("success"),
				});
			},
			onSettled: () => {
				queryClient.invalidateQueries("repoData");
			},

			onError: (err) => {
				notify.showNotification({
					title: t("error"),
					message: t("error"),
				});
			},
		}
	);

	return (
		<Container ml="0">
			<Group position="apart">
				<Title mb="xl">{t("listProject")}</Title>

				<Button
					type="submit"
					loading={loading}
					onClick={() => navigate("/settings/project/add")}
				>
					{t("addProject")}
				</Button>
			</Group>
			<Input
				icon={<Search />}
				variant="filled"
				placeholder={t("searchProject")}
				radius="xl"
				onChange={(e) => setSearch(e.target.value)}
			/>
			{isFetching ? (
				<Center style={{ height: "200px" }}>
					<Loader />
				</Center>
			) : (
				//todo: verificar se o projecto existe
				<Table highlightOnHover>
					<thead>
						<tr>
							<th>{t("name")}</th>
							<th>{t("manager")}</th>
							<th>{t("members")}</th>
							<th
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<span>Ações</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{datas
							.filter((data) =>
								data.name
									.toLowerCase()
									.includes(search.toLowerCase())
							)
							.map((data) => (
								<tr
									key={data._id}
									/* onClick={() =>
										navigate(`/project/${data._id}`)
									} */
								>
									<td>{data.name}</td>
									<td>
										<Group spacing="sm">
											<Avatar
												radius="xl"
												src={
													data.owner.photo
														? "/assets/" +
														  data.owner.photo
														: undefined
												}
												alt={data.owner.fullName}
											/>
											{data.owner.fullName}
										</Group>
									</td>

									<td>
										<AvatarsGroup limit={3}>
											{data.members.map((member) => (
												<Avatar
													radius="xl"
													src={
														member.photo
															? "/assets/" +
															  member.photo
															: undefined
													}
													alt={member.fullName}
													key={member._id}
												/>
											))}
										</AvatarsGroup>
									</td>
									<td>
										<Group position="right">
											<ActionIcon
												size="l"
												title="Ver Projeto"
												component={Link}
												to={`/project/${data._id}`}
											>
												<Eye />
											</ActionIcon>
											<ActionIcon
												size="l"
												title={t("edit")}
												component={Link}
												to={`/settings/project/${data._id}/addMembers`}
											>
												<Edit />
											</ActionIcon>
											<ActionIcon
												size="l"
												title="Eliminar Projeto"
												onClick={() =>
													mutationDeleteProject.mutate(
														data._id
													)
												}
												color="red"
											>
												<Trash />
											</ActionIcon>
										</Group>
									</td>
								</tr>
							))}
					</tbody>
				</Table>
			)}
		</Container>
	);
};
