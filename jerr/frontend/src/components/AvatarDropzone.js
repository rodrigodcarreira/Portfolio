import { Group, Text, useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { t } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { Photo, Upload, X } from "tabler-icons-react";

function getIconColor(status, theme) {
	return status.accepted
		? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
		: status.rejected
		? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
		: theme.colorScheme === "dark"
		? theme.colors.dark[0]
		: theme.colors.gray[7];
}

function ImageUploadIcon({ status, ...props }) {
	if (status.accepted) {
		return <Upload {...props} />;
	}

	if (status.rejected) {
		return <X {...props} />;
	}

	return <Photo {...props} />;
}

export const dropzoneChildren = (status, theme) => (
	<Group
		position="center"
		spacing="xl"
		style={{ minHeight: 220, pointerEvents: "none" }}
	>
		<ImageUploadIcon
			status={status}
			style={{ color: getIconColor(status, theme) }}
			size={80}
		/>

		<div>
			<Text size="xl" inline>
				{t("dragDropSelectImage")}
			</Text>
			<Text size="sm" color="dimmed" inline mt={7}>
				{t("dragDropSelectImageHint")}
			</Text>
		</div>
	</Group>
);

export const AvatarDropzone = (props) => {
	const theme = useMantineTheme();
	const { t } = useTranslation();
	return (
		<Dropzone
			{...props}
			/*  onDrop={(files) => console.log("accepted files", files)}
      onReject={(files) => console.log("rejected files", files)} */
			maxSize={5 * 1024 ** 2}
			accept={IMAGE_MIME_TYPE}
		>
			{(status) => dropzoneChildren(status, theme)}
		</Dropzone>
	);
};
