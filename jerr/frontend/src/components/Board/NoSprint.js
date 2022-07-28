import { Box, Button, Center, Grid, Group, Text } from "@mantine/core";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { CreateSprint } from "../createSprint";
import { Modal } from "@mantine/core";

const NoSprint = () => {
	const { projectId } = useParams();
	const [showS, setShowS] = useState(false);
	const { t } = useTranslation();
	return (
		<Box
			sx={(theme) => ({
				textAlign: "center",
				width: "100%",
				height: "100%",
			})}
		>
			<Center
				sx={(theme) => ({
					width: "100%",
					height: "100%",
				})}
			>
				<Grid>
					<Grid.Col span={12}>
						<Text color="dimmed" size="xl">
							Ups... Não existem sprints criados! Crie o seu
							primeiro Sprint!
						</Text>
					</Grid.Col>
					<Grid.Col span={12}>
						<Button onClick={() => setShowS(true)}>
							{t("createSprint")}
						</Button>
					</Grid.Col>
				</Grid>
			</Center>
			<Modal
				opened={showS}
				onClose={() => setShowS(false)}
				title={t("createSprint")}
			>
				<CreateSprint
					idProject={projectId}
					close={() => setShowS(false)}
					type="firstCreate"
				/>
			</Modal>
		</Box>
	);
};

export default NoSprint;
