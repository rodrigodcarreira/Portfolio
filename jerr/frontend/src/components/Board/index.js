import { Group, ScrollArea } from "@mantine/core";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import useSprint from "../../context/sprint";
import AddList from "./AddList";
import List from "./List";

const skeletonData = [
	{
		_id: "1",
		title: "List 1",
		skeleton: true,
		tasks: [
			{ _id: "1", title: "Task1", description: "Task 1", skeleton: true },
			{ _id: "2", title: "Task2", description: "Task 2", skeleton: true },
			{ _id: "3", title: "Task3", description: "Task 3", skeleton: true },
			{ _id: "4", title: "Task4", description: "Task 4", skeleton: true },
		],
	},
	{
		_id: "2",
		title: "List 2",
		skeleton: true,
		tasks: [
			{ _id: "1", title: "Task1", description: "Task 1", skeleton: true },
			{ _id: "2", title: "Task2", description: "Task 2", skeleton: true },
		],
	},
	{
		_id: "3",
		title: "List 3",
		skeleton: true,
		tasks: [
			{ _id: "1", title: "Task1", description: "Task 1", skeleton: true },
			{ _id: "2", title: "Task2", description: "Task 2", skeleton: true },
			{ _id: "3", title: "Task3", description: "Task 3", skeleton: true },
		],
	},
];

export default function Board(props) {
	const { sprint, isLoading, updateSprintMutation, updateListMutation } =
		useSprint();

	const lists = isLoading ? skeletonData : sprint.lists;

	const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}

		const { source, destination } = result;

		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		if (result.type === "LIST") {
			const newSprint = { ...sprint };
			const sourceList = newSprint.lists[source.index];

			newSprint.lists.splice(source.index, 1);
			newSprint.lists.splice(destination.index, 0, sourceList);
			updateSprintMutation.mutate(newSprint);
			return;
		}

		if (result.type === "TASK") {
			const sourceList = sprint.lists.find(
				(list) => list._id === source.droppableId
			);
			const destinationList = sprint.lists.find(
				(list) => list._id === destination.droppableId
			);

			const sourceTask = sourceList.tasks[source.index];

			sourceList.tasks.splice(source.index, 1);
			destinationList.tasks.splice(destination.index, 0, sourceTask);

			updateListMutation.mutate(sourceList);
			updateListMutation.mutate(destinationList);
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable
				droppableId={isLoading ? "sprint_id" : sprint._id}
				type="LIST"
				direction="horizontal"
			>
				{(provided) => (
					<ScrollArea
						type="always"
						style={{
							height: "100%",
							width: "100%",
						}}
					>
						<Group
							// align="stretch"
							align="flex-start"
							//Set  style unselected to true for all children
							style={{
								height: "100%",
								width: "100%",
							}}
							noWrap
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{lists.map((list, i) => (
								<List key={list._id} index={i} list={list} />
							))}

							{provided.placeholder}

							<AddList />
						</Group>
					</ScrollArea>
				)}
			</Droppable>
		</DragDropContext>
	);
}
