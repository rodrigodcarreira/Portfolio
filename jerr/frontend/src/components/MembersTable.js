import {
	ActionIcon,
	Anchor,
	Avatar,
	Group,
	ScrollArea,
	Skeleton,
	Table,
	Text,
} from "@mantine/core";
import { t } from "i18next";
import React from "react";
import { Pencil, Trash } from "tabler-icons-react";

export default function MembersTable({ data, onDeleteUser }) {
	const rows = data.map((user, i) => {
		return user.loading ? (
			<tr key={i}>
				<td>
					<Group spacing="sm">
						<Skeleton height={25} circle />
						<Skeleton height={8} radius="xl" width="70%" />
					</Group>
				</td>

				<td>
					<Skeleton height={8} radius="xl" />
				</td>
				<td>
					<Skeleton height={8} radius="xl" />
				</td>
				<td>
					<Skeleton height={8} radius="xl" />
				</td>
				<td>
					<Skeleton height={8} radius="xl" />
				</td>
			</tr>
		) : (
			<tr key={user._id}>
				<td>
					<Group spacing="sm">
						<Avatar
							size={30}
							src={"/assets/" + user.photo}
							radius={30}
						/>
						<Text size="sm" weight={500}>
							{user.fullName}
						</Text>
					</Group>
				</td>

				<td>
					{/* 	<Badge
					color={jobColors[user.job.toLowerCase()]}
					variant={theme.colorScheme === "dark" ? "light" : "outline"}
				>
					{item.job}
				</Badge> */}
				</td>
				<td>
					<Anchor
						size="sm"
						href="#"
						onClick={(event) => event.preventDefault()}
					>
						{user.email}
					</Anchor>
				</td>
				<td>
					<Text size="sm" color="gray">
						{user.phoneNumber}
					</Text>
				</td>
				<td>
					<Group spacing={0} position="right">
						<ActionIcon>
							<Pencil size={16} />
						</ActionIcon>
						<ActionIcon color="red">
							<Trash
								size={16}
								onClick={() => {
									onDeleteUser(user._id);
								}}
							/>
						</ActionIcon>
					</Group>
				</td>
			</tr>
		);
	});

	return (
		<ScrollArea>
			<Table /* sx={{ minWidth: 800 }}  */ verticalSpacing="sm">
				<thead>
					<tr>
						<th>{t("member")}</th>
						<th>{t("function")}</th>
						<th>{t("email")}</th>
						<th>{t("phoneNumber")}</th>
						<th>
							<span
								style={{ float: "right", paddingRight: "5px" }}
							>
								{t("actions")}
							</span>
						</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</Table>
		</ScrollArea>
	);
}
