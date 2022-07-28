import { ActionIcon, Box, Button, Group, TextInput } from "@mantine/core";
import React from "react";
import { Plus, X } from "tabler-icons-react";
import useSprint from "../../context/sprint";

export default function AddList() {
	const { addListMutation } = useSprint();
	const [opened, setOpened] = React.useState(false);
	const inputRef = React.useRef();

	return opened ? (
		<Box
			sx={(theme) => ({
				backgroundColor:
					theme.colorScheme === "dark"
						? theme.colors.dark[9]
						: theme.colors.gray[1],
				borderRadius: theme.radius.sm,
				padding: "0.5rem",
				width: "275px",
			})}
		>
			<TextInput ref={inputRef} placeholder="Nome da lista..." />
			<Group my={"xs"} spacing="xs">
				<Button
					color="violet"
					onClick={() => {
						addListMutation.mutate({
							title: inputRef.current.value.trim(),
						});

						setOpened(false);
						inputRef.current.value = "";
					}}
				>
					Adicionar
				</Button>
				<ActionIcon size="lg" onClick={() => setOpened(false)}>
					<X />
				</ActionIcon>
			</Group>
		</Box>
	) : (
		<Button
			variant="light"
			color="gray"
			onClick={() => setOpened(true)}
			size="xs"
		>
			<Plus size={18} />
		</Button>
	);
}
