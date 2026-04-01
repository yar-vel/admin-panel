"use client";

import { styled, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";

import { theme, sideBarOpenedWidth, sideBarWidth } from "@/shared/ui/theme";
import { SideBar } from "@/widgets/sidebar/Sidebar";
import { LayoutAlerts } from "@/widgets/alerts/LayoutAlerts";
import { getErrorText } from "@workspace/shared";
import { ROUTES } from "@workspace/shared";
import { useProfileStore } from "@/entities/profile/store";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { useSignOutMutation } from "@/features/auth/mutations";

const Layout: FC<LayoutProps<"/">> = ({ children }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(true);
  const signOut = useSignOutMutation();
  const profile = useProfileStore((s) => s.profile);
  const isProfileChecked = useProfileStore((s) => s.isProfileChecked);
  const setProfile = useProfileStore((s) => s.setProfile);
  const addAlert = useAlertsStore((s) => s.addAlert);
  const pathname = usePathname();

  useEffect(() => {
    if (isProfileChecked && !profile) {
      router.push(`${ROUTES.ui.signIn}?return=${encodeURIComponent(pathname)}`);
    }
  }, [isProfileChecked, profile, router, pathname]);

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => setProfile(null),
      onError: (error) =>
        addAlert({ type: "error", text: getErrorText(error, i18n.language) }),
    });
  };

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
                disabled={signOut.isPending || signOut.isSuccess}
                onClick={handleSignOut}
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
