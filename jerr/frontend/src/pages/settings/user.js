import {
	ActionIcon,
	Avatar,
	Box,
	Button,
	Container,
	Divider,
	Group,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, Check, X } from "tabler-icons-react";
import { AvatarDropzone } from "../../components/AvatarDropzone";
import { ImageEditor } from "../../components/ImageEditor";
import useAuth from "../../context/auth";
import { censorEmail, censorWord } from "../../utils/censor";
import api from "../../services/api";
import { useNotifications } from "@mantine/notifications";

export const UserSettings = () => {
	const { user, update, uploadPhoto, logOut } = useAuth();
	const { t } = useTranslation();
	const notify = useNotifications();

	const modals = useModals();

	const editPhotoRef = useRef();

	const sendRequest = async () => {
		try {
			const { data } = await api.post("/users/newPassword", user);
			notify.showNotification({
				title: t("sendMailRequest"),
				message: t("sendMailRequestBody"),
				color: "green",
				icon: <Check />,
			});
		} catch (error) {
			notify.showNotification({
				title: t("errorSendMailRequest"),
				message: t("errorSendMailRequestBody"),
				color: "red",
				icon: <X />,
			});
		}
	};

	const openAvatarModal = () => {
		const id = modals.openModal({
			title: t("selectImagem"),
			centered: true,

			size: "xl",
			children: (
				<AvatarDropzone
					onDrop={async (files) => {
						const avatar = files[0];
						const tempath = URL.createObjectURL(avatar);

						modals.openConfirmModal({
							title: t("confirm"),
							labels: {
								confirm: t("confirm"),
								cancel: t("back"),
							},
							children: (
								<ImageEditor
									path={tempath}
									editorRef={editPhotoRef}
								/>
							),
							onConfirm: async () => {
								editPhotoRef.current
									.getImageScaledToCanvas()
									.toBlob(
										async (blob) =>
											update({
												photo: await uploadPhoto(
													new File(
														[blob],
														"avatar.png",
														{ type: "image/png" }
													)
												),
											}),
										"image/png"
									);

								modals.closeAll();
							},
						});
					}}
				/>
			),
		});
	};

	const deleteAccount = async () => {
		try {
			const { data } = await api.delete("/users/delete");
			notify.showNotification({
				title: t("deletedAccount"),
				message: t("deletedAccountMessage"),
				color: "green",
				icon: <Check />,
			});
			logOut();
			return;
		} catch (err) {
			notify.showNotification({
				title: t("errorDeletedAccount"),
				message: t("errorDeletedAccountMessage"),
				color: "red",
				icon: <X />,
			});
			throw err.response.data;
		}
	};

	const openDeleteModal = () =>
		modals.openConfirmModal({
			title: t("deleteProfile"),
			centered: true,
			children: <Text size="sm">{t("deleteAccountMessage")}</Text>,
			labels: {
				confirm: t("deleteAccount"),
				cancel: t("noDeleteAccount"),
			},
			confirmProps: { color: "red" },
			onCancel: () => modals.closeModal(),
			onConfirm: () => deleteAccount(),
		});

	const [editData, setEditData] = useState({
		name: false,
		username: false,
		email: false,
		phone: false,
	});

	const [loading, setLoading] = useState({
		name: false,
		username: false,
		email: false,
		phone: false,
	});

	const [showEmail, setShowEmail] = React.useState(false);
	const [showPhone, setShowPhone] = React.useState(false);

	const emailRef = useRef();
	const phoneRef = useRef();
	const nameRef = useRef();
	const usernameRef = useRef();

	const [emailError, setEmailError] = React.useState();
	const [phoneError, setPhoneError] = React.useState();
	const [nameError, setNameError] = React.useState();
	const [usernameError, setUsernameError] = React.useState();

	const updateEmail = async (e) => {
		e.preventDefault();
		setLoading({ ...loading, email: true });
		const res = await update({ email: emailRef.current.value });

		let success = true;

		res.data?.forEach((e) => {
			if (e.field === "email") {
				setEmailError(e.message);
				success = false;
			}
		});

		setEditData({ ...editData, email: !success });
		setLoading({ ...loading, email: false });
	};

	const updateName = async (e) => {
		e.preventDefault();
		setLoading({ ...loading, name: true });
		const res = await update({ fullName: nameRef.current.value });

		let success = true;

		res.data?.forEach((e) => {
			if (e.field === "fullName") {
				setNameError(e.message);
				success = false;
			}
		});

		setEditData({ ...editData, name: !success });
		setLoading({ ...loading, name: false });
	};

	const updatePhone = async (e) => {
		e.preventDefault();
		setLoading({ ...loading, phone: true });
		const res = await update({ phoneNumber: phoneRef.current.value });

		let success = true;

		res.data?.forEach((e) => {
			if (e.field === "phoneNumber") {
				setPhoneError(e.message);
				success = false;
			}
		});

		setEditData({ ...editData, phone: !success });
		setLoading({ ...loading, phone: false });
	};

	const updateUsername = async (e) => {
		e.preventDefault();
		setLoading({ ...loading, username: true });
		const res = await update({ username: usernameRef.current.value });

		let success = true;

		res.data?.forEach((e) => {
			if (e.field === "username") {
				setUsernameError(e.message);
				success = false;
			}
		});

		setEditData({ ...editData, username: !success });
		setLoading({ ...loading, username: false });
	};

	return (
		<Container ml="0" size={"sm"}>
			<Box>
				<Title>{t("myAccount")}</Title>
				<Group my="lg">
					<Avatar
						size="xl"
						radius="50%"
						src={user.photo ? "/assets/" + user.photo : undefined}
						alt={user.fullName + " avatar"}
						sx={(theme) => ({
							cursor: "pointer",
							"&:hover": {
								"&::after": {
									content: `"${t("changeAvatar")}"`,
									fontWeight: "bold",
									textAlign: "center",
									display: "flex",
									alignItems: "center",
									position: "absolute",
									top: 0,
									left: 0,
									width: "100%",
									height: "100%",
									color: "white",
									backgroundColor: "rgba(17.3, 18, 20, 0.5)",

									zIndex: 1,
								},
							},
						})}
						onClick={openAvatarModal}
					/>
					{editData.username ? (
						<>
							<TextInput
								sx={(theme) => ({ width: 300 })}
								type="text"
								defaultValue={user.username}
								error={usernameError}
								ref={usernameRef}
							/>
							<Button
								ml={"auto"}
								onClick={updateUsername}
								loading={loading.username}
							>
								{t("save")}
							</Button>
						</>
					) : (
						<>
							<Title order={2}>{user.username}</Title>
							<Button
								ml={"auto"}
								onClick={() => {
									setEditData({
										...editData,
										username: true,
									});
									setUsernameError(undefined);
								}}
							>
								{t("edit")}
							</Button>
						</>
					)}
				</Group>
				<Title order={4}>{t("name")}</Title>
				{editData.name ? (
					<Group mb="xs">
						<TextInput
							sx={(theme) => ({ width: 300 })}
							type="text"
							defaultValue={user.fullName}
							error={nameError}
							ref={nameRef}
						/>
						<Button
							variant="outline"
							color={"red"}
							ml={"auto"}
							sx={(theme) => ({
								"&:hover": {
									backgroundColor: theme.colors.red[6],
									color: "white",
								},
							})}
							onClick={() =>
								setEditData({ ...editData, name: false })
							}
						>
							{t("cancel")}
						</Button>
						<Button onClick={updateName} loading={loading.name}>
							{t("save")}
						</Button>
					</Group>
				) : (
					<Group mb="xs">
						<Text>{user.fullName}</Text>

						<Button
							variant="subtle"
							ml={"auto"}
							onClick={() => {
								setEditData({ ...editData, name: true });
								setNameError(undefined);
							}}
						>
							{t("edit")}
						</Button>
					</Group>
				)}

				<Title order={4}>{t("email")}</Title>
				{editData.email ? (
					<Group mb="xs">
						<TextInput
							sx={(theme) => ({ width: 300 })}
							type="email"
							defaultValue={user.email}
							error={emailError}
							ref={emailRef}
						/>
						<Button
							variant="outline"
							color={"red"}
							ml={"auto"}
							sx={(theme) => ({
								"&:hover": {
									backgroundColor: theme.colors.red[6],
									color: "white",
								},
							})}
							onClick={() =>
								setEditData({ ...editData, email: false })
							}
						>
							{t("cancel")}
						</Button>
						<Button onClick={updateEmail} loading={loading.email}>
							{t("save")}
						</Button>
					</Group>
				) : (
					<Group mb="xs">
						<Text>
							{showEmail ? user.email : censorEmail(user.email)}
						</Text>

						<ActionIcon
							size={"sm"}
							onClick={() => setShowEmail(!showEmail)}
						>
							{showEmail ? <EyeOff m="auto" /> : <Eye m="auto" />}
						</ActionIcon>
						<Button
							variant="subtle"
							ml={"auto"}
							onClick={() => {
								setEditData({ ...editData, email: true });
								setEmailError(undefined);
							}}
						>
							{t("edit")}
						</Button>
					</Group>
				)}

				<Title order={4}>{t("phoneNumber")}</Title>
				{editData.phone ? (
					<Group mb="xs">
						<TextInput
							sx={(theme) => ({ maxWidth: 300 })}
							type="number"
							defaultValue={user.phoneNumber}
							error={phoneError}
							ref={phoneRef}
						/>
						<Button
							variant="outline"
							color={"red"}
							ml={"auto"}
							sx={(theme) => ({
								"&:hover": {
									backgroundColor: theme.colors.red[6],
									color: "white",
								},
							})}
							onClick={() =>
								setEditData({ ...editData, phone: false })
							}
						>
							{t("cancel")}
						</Button>
						<Button onClick={updatePhone} loading={loading.phone}>
							{t("save")}
						</Button>
					</Group>
				) : (
					<Group mb="xs">
						<Text>
							{showPhone
								? user.phoneNumber
								: censorWord(user.phoneNumber)}
						</Text>
						<ActionIcon
							size={"sm"}
							onClick={() => setShowPhone(!showPhone)}
						>
							{showPhone ? <EyeOff m="auto" /> : <Eye m="auto" />}
						</ActionIcon>
						<Button
							variant="subtle"
							ml={"auto"}
							onClick={() => {
								setEditData({ ...editData, phone: true });
								setPhoneError(undefined);
							}}
						>
							{t("edit")}
						</Button>
					</Group>
				)}
			</Box>
			<Divider my="md" />
			<Box>
				<Title>{t("password")}</Title>
				<Button mt="sm" onClick={sendRequest}>{t("changePassword")}</Button>
			</Box>
			<Divider my="md" />
			<Box>
				<Title order={3}>{t("deleteAccount")}</Title>
				<Button mt="sm" color="red" onClick={openDeleteModal}>
					{t("deleteAccount")}
				</Button>
			</Box>
		</Container>
	);
};
