import React from "react";
import useSprint from "../../context/sprint";
import {
	Button,
	Collapse,
	TextInput,
	Group,
	Box,
	ActionIcon,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { Plus, X } from "tabler-icons-react";

const AddTask = ({ list }) => {
	const [open, setOpen] = useState(null);

	const { addTaskMutation } = useSprint();

	const inputRef = useRef();

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [open]);

	return (
		<>
			{open ? (
				<Box>
					<TextInput
						ref={inputRef}
						sx={(theme) => ({
							backgroundColor:
								theme.colorScheme == "dark"
									? theme.colors.dark[7]
									: theme.colors.gray[0],

							border: "none",
							borderRadius: theme.radius.sm,
							paddingLeft: theme.spacing.sm,
							paddingRight: theme.spacing.sm,
							boxShadow: theme.shadows.md,
							height: "75px",
						})}
						placeholder={"Insira o titulo da tarefa..."} //TODO: translate
						variant="unstyled"
						size="md"
					/>
					<Group my={"xs"} spacing="xs">
						<Button
							color="violet"
							onClick={() => {
								addTaskMutation.mutate({
									title: inputRef.current.value.trim(),
									list,
								});

								setOpen(null);
								inputRef.current.value = "";
							}}
						>
							Adicionar
						</Button>
						<ActionIcon size="lg" onClick={() => setOpen(false)}>
							<X />
						</ActionIcon>
					</Group>
				</Box>
			) : (
				<Box
					sx={(theme) => ({
						textAlign: "left",
						padding: "0.25rem",
						borderRadius: theme.radius.sm,
						cursor: "pointer",
						color: theme.colors.gray[7],

						"&:hover": {
							color:
								theme.colorScheme === "dark"
									? theme.colors.gray[6]
									: theme.colors.dark[7],
							backgroundColor:
								theme.colorScheme === "dark"
									? theme.colors.dark[8]
									: theme.colors.gray[3],
						},
					})}
					onClick={() => {
						setOpen((o) => !o);
					}}
				>
					<Group spacing="xs">
						<Plus strokeWidth={1.5} />
						Adicionar Tarefa
					</Group>
				</Box>
			)}
		</>
	);
};

export default AddTask;
