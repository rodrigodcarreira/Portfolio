import {
	ActionIcon,
	Group,
	Menu,
	Title,
	useMantineColorScheme,
} from "@mantine/core";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Language, MoonStars, Sun } from "tabler-icons-react";

export default function ShellHeader({ sx, className }) {
	const { i18n } = useTranslation();
	const { colorScheme, toggleColorScheme } = useMantineColorScheme();

	return (
		<Group sx={sx} className={className} position="apart">
			<Link to={"/"} style={{ textDecoration: "none" }}>
				<Title> JERR</Title>
			</Link>
			<Group>
				<Menu
					control={
						<ActionIcon variant="hover" size={30}>
							<Language size={16} />
						</ActionIcon>
					}
				>
					<Menu.Label>Línguas</Menu.Label>
					<Menu.Item
						icon={
							<ReactCountryFlag
								countryCode="PT"
								style={{
									fontSize: "1.25em",
									lineHeight: "1.25em",
								}}
								svg
							/>
						}
						onClick={() => i18n.changeLanguage("pt")}
					>
						Português
					</Menu.Item>
					<Menu.Item
						icon={
							<ReactCountryFlag
								countryCode="US"
								style={{
									fontSize: "1.25em",
									lineHeight: "1.25em",
								}}
								svg
							/>
						}
						onClick={() => {
							i18n.changeLanguage("en");
						}}
					>
						English
					</Menu.Item>
				</Menu>
				<ActionIcon
					variant="hover"
					onClick={() => toggleColorScheme()}
					size={30}
				>
					{colorScheme === "dark" ? (
						<Sun size={16} />
					) : (
						<MoonStars size={16} />
					)}
				</ActionIcon>
			</Group>
		</Group>
	);
}
