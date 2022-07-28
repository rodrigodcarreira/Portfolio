import React, { forwardRef, useState } from "react";
import api from "../services/api";
import {
	Group,
	Select,
	Text,
	Avatar,
	Loader,
	useMantineTheme,
} from "@mantine/core";
import { useQuery } from "react-query";
import { ChevronDown, Search } from "tabler-icons-react";

const MemberOption = forwardRef(({ user, ...others }, ref) => (
	<div key={user._id} ref={ref} {...others}>
		<Group noWrap>
			<Avatar
				src={user.photo ? "/assets/" + user.photo : null}
				radius="50%"
			/>

			<div>
				<Text size="sm">{user.username}</Text>
				<Text size="xs" color="dimmed">
					{user.email}
				</Text>
			</div>
		</Group>
	</div>
));

export default function SelectMember({ onChange, styles, ...props }) {
	const [criteria, setCriteria] = useState("");
	const theme = useMantineTheme();
	const [value, setValue] = useState();
	const searchUsers = () =>
		criteria.length > 2
			? api.get("/users/search/" + criteria).then((res) => res.data.rows)
			: null;

	const { data: users, isFetching } = useQuery(
		["hintUsers", criteria],
		searchUsers,
		{
			keepPreviousData: true,
		}
	);
	return (
		<Select
			placeholder="Pesquisar por Nome, Email ou Usuário"
			styles={{
				rightSection: {
					pointerEvents: "none",
					color: theme.colors.gray[4],
				},
				...styles,
			}}
			data={
				users
					? users.map((user) => ({
							label: user.username,
							value: user._id,
							user,
					  }))
					: []
			}
			searchable
			icon={<Search />}
			rightSection={isFetching ? <Loader size={"xs"} /> : <ChevronDown />}
			rightSectionWidth={40}
			onSearchChange={(e) => setCriteria(e)}
			onChange={(id) => {
				setCriteria("");
				onChange(users.find((user) => user._id === id));
				setValue("");
			}}
			itemComponent={MemberOption}
			nothingFound={users ? "Nenhum utilizador encontrado" : ""}
			filter={(value, item) =>
				item.user.fullName
					.toLowerCase()
					.includes(value.toLowerCase().trim()) ||
				item.user.username
					.toLowerCase()
					.includes(value.toLowerCase().trim()) ||
				item.user.email
					.toLowerCase()
					.includes(value.toLowerCase().trim())
			}
			value={value}
			{...props}
		/>
	);
}
