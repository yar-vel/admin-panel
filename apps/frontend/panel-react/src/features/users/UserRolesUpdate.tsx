import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { IRole, IUser } from "@workspace/shared/dist/types";
import { getErrorText } from "@workspace/shared/dist/libs";
import { UserRolesForm } from "@/entities/user/UserRolesForm";
import { useUpdateUserRolesMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { ROUTES } from "@/shared/lib/constants";

export const UserRolesUpdate: FC<{
  user: IUser;
  roles: IRole[];
}> = ({ user, roles }) => {
  const { t, i18n } = useTranslation();
  const updateUserRoles = useUpdateUserRolesMutation();
  const rights = useRights(ROUTES.api.users._);
  const addAlert = useAlertsStore((s) => s.addAlert);

  return (
    <UserRolesForm
      user={user}
      roles={roles}
      onUpdate={(newUserRoles) =>
        updateUserRoles.mutate(
          { id: user.id, fields: { items: newUserRoles } },
          {
            onSuccess: () => addAlert({ type: "success", text: t("success") }),
            onError: (error) =>
              addAlert({
                type: "error",
                text: getErrorText(error, i18n.language),
              }),
          },
        )
      }
      updateDisabled={!rights.updating}
      updateLoading={updateUserRoles.isPending}
    />
  );
};
