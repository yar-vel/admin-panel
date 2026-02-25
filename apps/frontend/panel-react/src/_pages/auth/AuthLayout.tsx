import { FC, PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { TPage } from "../types";

export const AuthLayout: FC<TPage & PropsWithChildren> = ({ h1, children }) => {
  return (
    <>
      <Box component="header">
        <Typography component="h1" variant="h5" align="center" sx={{ my: 1 }}>
          {h1}
        </Typography>
      </Box>
      <Box component="main">{children}</Box>
    </>
  );
};
