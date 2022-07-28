import { useLocalStorage } from "@mantine/hooks";
import { createContext, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../services/api";

export const SprintContext = createContext();

export const SprintProvider = ({ idProject, sprintID, children }) => {
	const queryClient = useQueryClient();

	const [sprintStorage, setSprintStorage] = useLocalStorage({
		key: "sprint",
		defaultValue: null,
	});

	const { data: sprint, isLoading } = useQuery(
		["sprint", sprintID],
		async () =>
			await api.get(`/sprints/${sprintID}`).then((res) => res.data),
		{
			onSuccess: (data) => {
				setSprintStorage(data);
			},
		}
	);

	const updateSprintMutation = useMutation(
		async (sprint) =>
			await api
				.put(`/sprints/${sprintID}`, {
					...sprint,
					lists: sprint.lists.map((list) => list._id),
				})
				.then((res) => res.data),
		{
			onMutate: async (sprint) => {
				await queryClient.cancelQueries(["sprint", sprintID]);

				const previousSprint = await queryClient.getQueryData([
					"sprint",
					sprintID,
				]);

				queryClient.setQueryData(["sprint", sprintID], sprint);

				return { previousSprint };
			},
			onSuccess: (result, variables, context) => {
				queryClient.setQueryData(["sprint", sprintID], result);
			},
			onError: (error, variables, context) => {
				queryClient.setQueryData(
					["sprint", sprintID],
					context.previousSprint
				);
			},
		}
	);

	const addListMutation = useMutation(
		async (list) =>
			await api
				.post(`/lists`, {
					...list,
					sprint: sprintID,
				})
				.then((res) => res.data),
		{
			onMutate: async (list) => {
				await queryClient.cancelQueries(["sprint", sprintID]);

				const previousSprint = await queryClient.getQueryData([
					"sprint",
					sprintID,
				]);

				list.tasks = [];

				queryClient.setQueryData(["sprint", sprintID], {
					...previousSprint,
					lists: [
						...previousSprint.lists,
						{ ...list, _id: "new" + Math.random() + Math.random() },
					],
				});

				return { previousSprint };
			},
			onSettled: () => {
				queryClient.invalidateQueries(["sprint", sprintID]);
			},
			onError: (error, variables, context) => {
				queryClient.setQueryData(
					["sprint", sprintID],
					context.previousSprint
				);
			},
		}
	);

	const updateListMutation = useMutation(
		async (list) =>
			await api
				.put(`/lists/${list._id}`, {
					...list,
					tasks: list.tasks.map((task) => task._id),
				})
				.then((res) => res.data),
		{
			onMutate: async (list) => {
				await queryClient.cancelQueries(["sprint", sprintID]);

				const previousSprint = await queryClient.getQueryData([
					"sprint",
					sprintID,
				]);

				queryClient.setQueryData(["sprint", sprintID], {
					...previousSprint,
					lists: previousSprint.lists.map((l) =>
						l._id === list._id ? list : l
					),
				});

				return { previousSprint };
			},
			onError: (err, newtask, context) => {
				queryClient.setQueryData(
					["sprint", sprintID],
					context.previousSprint
				);
			},
			onSettled: () => {
				queryClient.invalidateQueries(["sprint", sprintID]);
			},
		}
	);

	const deleteListMutation = useMutation(
		async (list) =>
			await api.delete(`/lists/${list._id}`).then((res) => res.data),
		{
			onMutate: async (list) => {
				await queryClient.cancelQueries(["sprint", sprintID]);

				const previousSprint = await queryClient.getQueryData([
					"sprint",
					sprintID,
				]);

				queryClient.setQueryData(["sprint", sprintID], {
					...previousSprint,
					lists: previousSprint.lists.filter(
						(l) => l._id !== list._id
					),
				});

				return { previousSprint };
			},
			onError: (error, variables, context) => {
				queryClient.setQueryData(
					["sprint", sprintID],
					context.previousSprint
				);
			},
			onSettled: () => {
				queryClient.invalidateQueries(["sprint", sprintID]);
			},
		}
	);

	const addTaskMutation = useMutation(
		async (task) =>
			await api
				.post(`/tasks`, { ...task, list: task.list._id })
				.then((res) => res.data),
		{
			onMutate: async (newtask) => {
				await queryClient.cancelQueries(["sprint", sprintID]);

				const previousSprint = await queryClient.getQueryData([
					"sprint",
					sprintID,
				]);

				queryClient.setQueryData(["sprint", sprintID], (old) => ({
					...old,
					lists: old.lists.map((list) =>
						newtask.list._id == list._id
							? {
									...list,
									tasks: [
										...list.tasks,
										{
											...newtask,
											_id:
												"new" +
												Math.random() +
												Math.random(),

											loading: true,
										},
									],
							  }
							: list
					),
				}));

				return { previousSprint };
			},
			onError: (err, newtask, context) => {
				queryClient.setQueryData(
					["sprint", sprintID],
					context.previousSprint
				);
			},
			onSettled: () => {
				queryClient.invalidateQueries(["sprint", sprintID]);
			},
		}
	);

	const updateTaskMutation = useMutation(
		async (task) =>
			await api
				.put(`/tasks/${task._id}`, {
					...task,
					assignees: task.assignees.map((a) => a._id),
				})
				.then((res) => res.data),
		{
			onMutate: async (updatedTask) => {
				await queryClient.cancelQueries(["sprint", sprintID]);

				const previousSprint = await queryClient.getQueryData([
					"sprint",
					sprintID,
				]);

				queryClient.setQueryData(["sprint", sprintID], (old) => ({
					...old,
					lists: old.lists.map((list) =>
						updatedTask.list == list._id
							? {
									...list,
									tasks: list.tasks.map((task) =>
										task._id == updatedTask._id
											? updatedTask
											: task
									),
							  }
							: list
					),
				}));

				return { previousSprint };
			},
			onError: (err, updatedTask, context) => {
				queryClient.setQueryData(
					["sprint", sprintID],
					context.previousSprint
				);
			},
			onSettled: () => {
				queryClient.invalidateQueries(["sprint", sprintID]);
			},
		}
	);

	const deleteTaskMutation = useMutation(
		async (task) =>
			await api.delete(`/tasks/${task._id}`).then((res) => res.data),
		{
			onMutate: async (deletedTask) => {
				await queryClient.cancelQueries(["sprint", sprintID]);

				const previousSprint = await queryClient.getQueryData([
					"sprint",
					sprintID,
				]);

				/* queryClient.setQueryData(["sprint", sprintID], (old) => ({
					...old,
					lists: old.lists.map((list) =>
						deletedTask.list == list._id
							? {
									...list,
									tasks: list.tasks.filter(
										(task) => task._id != deletedTask._id
									),
							  }
							: list
					),
				})); */

				return { previousSprint };
			},

			onError: (err, deletedTask, context) => {
				queryClient.setQueryData(
					["sprint", sprintID],
					context.previousSprint
				);
			},
			onSettled: () => {
				queryClient.invalidateQueries(["sprint", sprintID]);
			},
		}
	);

	return (
		<SprintContext.Provider
			value={{
				sprintID,
				sprint,
				isLoading,
				updateSprintMutation,
				addListMutation,
				updateListMutation,
				deleteListMutation,
				addTaskMutation,
				updateTaskMutation,
				deleteTaskMutation,
			}}
		>
			{children}
		</SprintContext.Provider>
	);
};

const useSprint = () => useContext(SprintContext);
export default useSprint;
