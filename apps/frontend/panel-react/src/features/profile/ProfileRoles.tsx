import { FC } from "react";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "@/app/store/hooks";

export const ProfileRoles: FC = () => {
  const { t } = useTranslation();
  const profile = useAppSelector((store) => store.main.profile);

  return (
    <Typography variant="body1" sx={{ my: 1 }}>
      {profile?.roles?.map((role) => role.name).join(", ") || t("empty")}
    </Typography>
  );
};
