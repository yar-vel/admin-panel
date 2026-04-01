import { FC } from "react";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

import { useProfileStore } from "@/entities/profile/store";

export const ProfileRoles: FC = () => {
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);

  return (
    <Typography variant="body1" sx={{ my: 1 }}>
      {profile?.roles?.map((role) => role.name).join(", ") || t("empty")}
    </Typography>
  );
};
