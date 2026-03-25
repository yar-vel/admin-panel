import { FC, PropsWithChildren } from "react";
import Typography from "@mui/material/Typography";

import { ILayout } from "./types";

export const PanelLayout: FC<PropsWithChildren<ILayout>> = ({
  h1,
  children,
}) => {
  return (
    <>
      <Typography component="h1" variant="h5" sx={{ my: 1 }}>
        {h1}
      </Typography>
      {children}
    </>
  );
};
