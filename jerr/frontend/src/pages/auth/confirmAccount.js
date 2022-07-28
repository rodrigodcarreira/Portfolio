import { useNotifications } from "@mantine/notifications";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Check, X } from "tabler-icons-react";
import api from "../../services/api";

export default function ConfirmAccount() {
	const { token } = useParams();
	const { t } = useTranslation();
	const notify = useNotifications();
	const navigate = useNavigate();

	useEffect(() => {
		requestVerify(token);
	}, []);

	const requestVerify = async (token) => {
		try {
			const { data } = await api.get("/users/verify/" + token);
			notify.showNotification({
				title: t("accountConfirmed"),
				message: t("accountConfirmedMessage"),
				color: "green",
				icon: <Check />,
			});
			navigate("/");
			return;
		} catch (err) {
			notify.showNotification({
				title: t("errorConfirmAccount"),
				message: t("errorConfirmAccountMessage"),
				color: "red",
				icon: <X />,
			});
			throw err.response.data;
		}
	};
	return <div></div>;
}
