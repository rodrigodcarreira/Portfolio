import { Box, Center, Slider, Text } from "@mantine/core";
import React from "react";
import AvatarEditor from "react-avatar-editor";
import { useTranslation } from "react-i18next";

export const ImageEditor = ({ path, editorRef }) => {
	const [scale, setScale] = React.useState(1);
	const [rotate, setRotate] = React.useState(0);
	const { t } = useTranslation();

	return (
		<Box>
			<Center>
				<AvatarEditor
					ref={editorRef}
					image={path}
					width={250}
					height={250}
					borderRadius={175}
					scale={scale}
					rotate={rotate}
				/>
			</Center>
			<Text>{t("zoom")}</Text>
			<Slider
				value={scale}
				onChange={setScale}
				min={1}
				max={2}
				step={0.1}
			/>
			<Text>{t("rotate")}</Text>
			<Slider
				value={rotate}
				onChange={setRotate}
				min={-180}
				max={180}
				step={45}
			/>
		</Box>
	);
};
