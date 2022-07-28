import { Stack } from "@mantine/core";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddTask from "./AddTask";
import Task from "./Task";

export default function TasksList({ list }) {
	return (
		<Droppable droppableId={list._id} type="TASK">
			{(provided, snapshot) => (
				<Stack
					spacing="xs"
					style={{ height: "100%" }}
					{...provided.droppableProps}
					ref={provided.innerRef}
				>
					{list.tasks.map((task, index) => (
						<Draggable
							key={task._id}
							draggableId={task._id}
							index={index}
						>
							{(dragProvided, dragSnapshot) => (
								<Task
									task={task}
									provided={dragProvided}
									snapshot={dragSnapshot}
								/>
							)}
						</Draggable>
					))}
					{provided.placeholder}
					{!list.skeleton && <AddTask list={list} />}
				</Stack>
			)}
		</Droppable>
	);
}
