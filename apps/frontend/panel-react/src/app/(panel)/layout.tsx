"use client";

import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { usePathname, useRouter } from "next/navigation";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/app/store/hooks";
import { theme, sideBarOpenedWidth, sideBarWidth } from "@/shared/ui/theme";
import { useAppDispatch } from "@/app/store/hooks";
import { addAlert, setProfile } from "@/app/store/main/main";
import { SideBar } from "@/widgets/sidebar/Sidebar";
import { LayoutAlerts } from "@/widgets/alerts/LayoutAlerts";
import { getErrorText } from "@ap/shared/dist/libs";
import { authApi } from "@/entities/auth/api";
import { ROUTES } from "@/shared/lib/constants";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(true);
  const [signOut, { isSuccess, error, isLoading }] =
    authApi.useSignOutMutation();
  const profile = useAppSelector((store) => store.main.profile);
  const pathname = usePathname();

  useEffect(() => {
    if (!profile) {
      signOut();
    }
  }, [profile, signOut]);

  useEffect(() => {
    if (isSuccess || (error && "status" in error && error.status === 401)) {
      router.push(`${ROUTES.ui.signIn}?return=${encodeURIComponent(pathname)}`);
    }
  }, [isSuccess, router, pathname, error]);

  useEffect(() => {
    if (error) {
      dispatch(
        addAlert({
          type: "error",
          text: getErrorText(error, i18n.language),
        }),
      );
    }
  }, [dispatch, error, i18n]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="row">
        <SideBar open={open} setOpen={() => setOpen((prev) => !prev)} />
        <Box flexGrow={1} overflow="hidden">
          <AppBarStyled
            openStyled={open}
            position="fixed"
            variant="elevation"
            elevation={0}
          >
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: "auto" }}
                onClick={() => setOpen((prev) => !prev)}
              >
                <MenuIcon />
              </IconButton>
              <IconButton
                edge="end"
                color="error"
                aria-label="sign out"
                title={t("signOut")}
                disabled={isLoading || isSuccess}
                onClick={() => dispatch(setProfile(null))}
              >
                <LogoutIcon />
              </IconButton>
            </Toolbar>
            <Divider />
          </AppBarStyled>
          <Box component="main" sx={{ py: 1, px: 3, mt: 6 }}>
            {children}
          </Box>
        </Box>
        <LayoutAlerts />
      </Box>
    </ThemeProvider>
  );
};
export default Layout;

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) =>
    !(["openStyled"] as PropertyKey[]).includes(prop),
})<{ openStyled?: boolean }>(({ openStyled }) => ({
  width: "auto",
  left: openStyled ? sideBarOpenedWidth : sideBarWidth,
  transition: theme.transitions.create("left", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.short,
  }),
  [theme.breakpoints.down("md")]: {
    left: 0,
  },
}));
