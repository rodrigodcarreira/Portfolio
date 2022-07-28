import {
	ActionIcon,
	Box,
	Grid,
	Group,
	Menu,
	Skeleton,
	Text,
	TextInput,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Check, Pencil, Trash, X } from "tabler-icons-react";
import useSprint from "../../context/sprint";
import TasksList from "./TasksList";

export default function List({ index, list }) {
	const { deleteListMutation, updateListMutation } = useSprint();
	const { hovered, ref } = useHover();

	const [edit, setEdit] = React.useState(false);
	const inputRef = React.useRef();

	const skeleton = !!list.skeleton;

	return (
		<Draggable draggableId={list._id} index={index}>
			{(provided) => (
				<Box
					sx={(theme) => ({
						backgroundColor:
							theme.colorScheme === "dark"
								? theme.colors.dark[9]
								: theme.colors.gray[1],
						borderRadius: theme.radius.sm,
						padding: "0.5rem",
						width: "275px",

						"> *": {
							userSelect: "none",
						},
					})}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<div ref={ref}>
						{edit ? (
							<Group mb="xs" spacing={5}>
								{skeleton ? (
									<Skeleton
										height={8}
										mt={6}
										width="70%"
										radius="xl"
									/>
								) : (
									<TextInput
										ref={inputRef}
										defaultValue={list.title}
										placeholder="Nome da lista..."
									/>
								)}

								<ActionIcon
									size="md"
									onClick={() => {
										if (inputRef.current.value.trim()) {
											updateListMutation.mutate({
												...list,
												title: inputRef.current.value.trim(),
											});
										}

										setEdit(false);
										inputRef.current.value = "";
									}}
								>
									<Check />
								</ActionIcon>
								<ActionIcon
									size="md"
									onClick={() => setEdit(false)}
								>
									<X />
								</ActionIcon>
							</Group>
						) : skeleton ? (
							<Skeleton height={8} my="xs" width="85%" />
						) : (
							<Grid gutter={0}>
								<Grid.Col span={10}>
									<Text
										color="dimmed"
										size="md"
										mb="md"
										transform="uppercase"
									>
										{list.title}
									</Text>
								</Grid.Col>
								<Grid.Col span={2}>
									<Menu
										sx={{
											float: "right",
											opacity: hovered ? 1 : 0,
										}}
										onClick={(e) => e.stopPropagation()}
									>
										<Menu.Item
											icon={<Pencil size={14} />}
											onClick={() => setEdit(true)}
										>
											Editar Lista
										</Menu.Item>
										<Menu.Item
											color="red"
											icon={<Trash size={14} />}
											onClick={() =>
												deleteListMutation.mutate(list)
											}
										>
											Eliminar Lista
										</Menu.Item>
									</Menu>
								</Grid.Col>
							</Grid>
						)}
					</div>
					<TasksList list={list} />
					{provided.placeholder}
				</Box>
			)}
		</Draggable>
	);
}
