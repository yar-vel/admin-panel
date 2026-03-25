import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { getErrorText } from "@workspace/shared/dist/libs";
import { RoleForm } from "@/entities/role/RoleForm";
import { IRole, TRoleCreate } from "@workspace/shared/dist/types";
import { useCreateRoleMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { ROUTES } from "@/shared/lib/constants";

export const RoleCreate: FC<{ onCreate?: (data: IRole) => void }> = ({
  onCreate,
}) => {
  const { t, i18n } = useTranslation();
  const createRole = useCreateRoleMutation();
  const rights = useRights(ROUTES.api.roles._);
  const addAlert = useAlertsStore((s) => s.addAlert);

  const handleCreate = (fields: TRoleCreate) => {
    createRole.mutate(fields, {
      onSuccess: (data) => {
        addAlert({ type: "success", text: t("success") });
        onCreate?.(data);
      },
      onError: (error) =>
        addAlert({
          type: "error",
          text: getErrorText(error, i18n.language),
        }),
    });
  };

  return (
    <RoleForm
      onCreate={handleCreate}
      createDisabled={!rights.creating}
      createLoading={createRole.isPending || Boolean(createRole.data)}
    />
  );
};
