import {
	Avatar,
	Container,
	Group,
	LoadingOverlay,
	ScrollArea,
	TextInput,
	ThemeIcon
} from "@mantine/core";
import { RichTextEditor } from "@mantine/rte";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { Send } from "tabler-icons-react";
import api from "../services/api";
import socket from "../services/socket";

export const Chat = () => {
	const [isConnected, setIsConnected] = React.useState(socket.connected);
	const [room, setRoom] = React.useState({});
	const params = useParams();
	const roomId = params.room;

	const [isLoading, setIsLoading] = React.useState(true);

	const msgField = useRef();
	const viewport = useRef();

	const scrollToBottom = () =>
		viewport.current.scrollTo({
			top: viewport.current.scrollHeight,
			behavior: "smooth",
		});

	useEffect(() => {
		api.get(`/rooms/messages/${roomId}`).then((res) => setRoom(res.data));

		socket.on("connect", () => {
			setIsConnected(true);
			socket.emit("call", "rooms.join", { roomId });
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
			// socket.emit("call", "room.leave", { roomId });
		});

		socket.on("room.message", (message) => {
			setRoom((prev) => ({
				...prev,
				messages: [...prev.messages, message],
			}));
		});

		return () => {
			socket.emit("call", "rooms.leave", { roomId });
			socket.off("connect");
			socket.off("disconnect");
			socket.off("message");
		};
	}, []);

	useEffect(() => {
		api.get(`/rooms/messages/${roomId}`).then((res) => {
			setRoom(res.data);
			setIsLoading(false);
		});
	}, [roomId]);

	useEffect(() => {
		scrollToBottom();
	}, [room]);

	const sendMessage = async () => {
		const value = msgField.current.value.trim();
		msgField.current.value = "";
		if (!value) return;

		msgField.current.setAttribute("disabled", true);
		msgField.current.blur();

		socket.emit(
			"call",
			"rooms.addMessage",
			{
				id: roomId,
				message: value,
			},
			(err, res) => {
				//TODO: Handle error
				msgField.current.value = "";
				msgField.current.removeAttribute("disabled");
			}
		);
		// await api.post(`/rooms/messages/${roomId}`, { message });
	};

	return (
		<Container fluid style={{ position: "relative" }}>
			<LoadingOverlay visible={isLoading} />
			<ScrollArea
				style={{
					height: "90vh",
					paddingRight: "10px",
					paddingLeft: "10px",
				}}
				viewportRef={viewport}
				offsetScrollbars
			>
				{room &&
					room.messages &&
					room.messages.map((m, i) => (
						<Group key={i} py={"xs"}>
							<Avatar radius={"50%"} />
							<RichTextEditor value={m.message} readOnly />
						</Group>
					))}
			</ScrollArea>

			<TextInput
				ref={msgField}
				size={"md"}
				placeholder="Escreva uma mensagem..."
				rightSection={
					<ThemeIcon radius={"xl"} size="lg" onClick={sendMessage}>
						<Send size={22} />
					</ThemeIcon>
				}
			/>
		</Container>
	);
};
