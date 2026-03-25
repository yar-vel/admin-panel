import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { getErrorText } from "@workspace/shared/dist/libs";
import { IResource, IRole } from "@workspace/shared/dist/types";
import { RoleRightsForm } from "@/entities/role/RoleRightsForm";
import { useUpdateRoleRightsMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { ROUTES } from "@/shared/lib/constants";

export const RoleRightsUpdate: FC<{
  role: IRole;
  resources: IResource[];
}> = ({ role, resources }) => {
  const { t, i18n } = useTranslation();
  const updateRoleRights = useUpdateRoleRightsMutation();
  const rights = useRights(ROUTES.api.roles._);
  const addAlert = useAlertsStore((s) => s.addAlert);

  return (
    <RoleRightsForm
      role={role}
      resources={resources}
      onUpdate={(newRights) =>
        updateRoleRights.mutate(
          { id: role.id, fields: { items: newRights } },
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
      updateDisabled={!rights.updating || role.default}
      updateLoading={updateRoleRights.isPending}
    />
  );
};
