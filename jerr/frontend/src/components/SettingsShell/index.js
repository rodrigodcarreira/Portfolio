import { AppShell, Center, Loader, ScrollArea } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { Layout, User, Users } from "tabler-icons-react";
import Header from "../../components/Header";
import useAuth from "../../context/auth";
import SettingsNavbar from "./SettingsNavbar";

export const SettingsShell = () => {
	const { isLoading } = useAuth();

	const largeScreen = useMediaQuery("(max-width:992px)");
	const { t } = useTranslation();

	const data = [
		{ link: "/settings/user", label: t("user"), icon: User },
		{ link: "/settings/teams", label: t("team"), icon: Users },
		{
			link: "/settings/projects",
			label: t("project"),
			icon: Layout,
		},
	];

	return (
		<AppShell
			padding={0}
			fixed
			navbarOffsetBreakpoint="md"
			// sx={(theme) => ({ backgroundColor: theme.colors.dark[6] })}
			header={
				<Header
					data={data}
					sx={{
						display: largeScreen ? "block" : "none",
					}}
				/>
			}
			navbar={
				<SettingsNavbar
					hiddenBreakpoint="md"
					hidden={true}
					data={data}
					fixed
				/>
			}
		>
			{isLoading ? (
				<Center style={{ height: "100%" }}>
					<Loader />
				</Center>
			) : (
				<ScrollArea
					style={{ width: "100%", height: "100%" }}
					p={"sm"}
					type="auto"
				>
					<Outlet />
				</ScrollArea>
			)}
		</AppShell>
	);
};
