import {
	Avatar,
	createStyles,
	Group,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { forwardRef } from "react";
import { ChevronRight } from "tabler-icons-react";

const useStyles = createStyles((theme) => ({
	user: {
		display: "block",
		width: "100%",
		padding: theme.spacing.md,
		color:
			theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

		"&:hover": {
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[8]
					: theme.colors.gray[0],
		},
	},
}));

const UserButton = forwardRef(
	({ image, name, email, icon, ...others }, ref) => {
		const { classes } = useStyles();

		return (
			<UnstyledButton className={classes.user} ref={ref} {...others}>
				<Group>
					{image && <Avatar src={image} radius="xl" />}

					<div style={{ flex: 1 }}>
						<Text size="sm" weight={500}>
							{name}
						</Text>

						<Text color="dimmed" size="xs">
							{email}
						</Text>
					</div>

					{icon || <ChevronRight size={14} />}
				</Group>
			</UnstyledButton>
		);
	}
);

export default UserButton;
