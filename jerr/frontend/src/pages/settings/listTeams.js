import {
	Avatar,
	AvatarsGroup,
	Button,
	Center,
	Container,
	Group,
	Input,
	Loader,
	Table,
	Title,
} from "@mantine/core";
import { Search } from "tabler-icons-react";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export const ListTeams = () => {
	const [loading, setLoading] = useState(false);

	const { t } = useTranslation();
	const [search, setSearch] = useState("");

	let navigate = useNavigate();

	const { data: datas, isFetching } = useQuery(
		"repoData",
		async () => await api.get("/teams/list").then((res) => res.data)
	);

	return (
		<Container ml="0">
			<Group position="apart">
				<Title mb="xl">{t("listTeams")}</Title>

				<Button
					type="submit"
					loading={loading}
					onClick={() => navigate("/settings/team/add")}
				>
					{t("createTeamButton")}
				</Button>
			</Group>

			<Input
				icon={<Search />}
				variant="filled"
				placeholder={t("searchTeam")}
				radius="xl"
				onChange={(e) => setSearch(e.target.value)}
			/>

			{isFetching ? (
				<Center style={{ height: "200px" }}>
					<Loader />
				</Center>
			) : (
				<Table highlightOnHover>
					<thead>
						<tr>
							<th>{t("name")}</th>
							<th>{t("manager")}</th>
							<th>{t("members")}</th>
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
									onClick={() =>
										navigate(
											`/settings/project/${data._id}` //mudar para team
										)
									}
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
								</tr>
							))}
					</tbody>
				</Table>
			)}
		</Container>
	);
};
