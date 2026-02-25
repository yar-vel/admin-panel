"use client";

import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Container from "@mui/material/Container";
import { FC, PropsWithChildren } from "react";

import { theme } from "@/shared/ui/theme";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContainerStyled maxWidth="xs">{children}</AuthContainerStyled>
    </ThemeProvider>
  );
};
export default Layout;

const AuthContainerStyled = styled(Container)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding-block: ${theme.spacing(1)};
`;
