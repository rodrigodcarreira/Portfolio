import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";
import { useState } from "react";

const Mantine = ({ children }) => {
	const [colorScheme, setColorScheme] = useLocalStorage({
		key: "mantine-color-scheme",
		defaultValue: "light",
		getInitialValueInEffect: true,
	});

	const toggleColorScheme = (value) =>
		setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
			<MantineProvider
				theme={{
					colorScheme,
					primaryColor: "violet",
					headings: {
						fontFamily:
							"Greycliff CF" /*  sizes: { h1: {fontSize: "44px"} } */,
					},
				}}
				styles={{
					Title: {
						root: {
							color: colorScheme === "light" ? "black" : "white",
						},
					},
				}}
				withNormalizeCSS
				withGlobalStyles
			>
				<ModalsProvider>
					<NotificationsProvider>{children}</NotificationsProvider>
				</ModalsProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	);
};

export default Mantine;
