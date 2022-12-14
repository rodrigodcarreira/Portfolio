import React from "react";
import { createStyles, Container, Group, Anchor } from "@mantine/core";
import { MantineLogo } from "../../shared/MantineLogo";

const useStyles = createStyles((theme) => ({
  footer: {
    color: theme,
    marginTop: 120,
    borderTop: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export function FooterSimple() {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <MantineLogo />
        <Group className={classes.links}></Group>
      </Container>
    </div>
  );
}
