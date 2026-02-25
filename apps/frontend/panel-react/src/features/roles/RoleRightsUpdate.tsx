import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { useAppDispatch } from "@/app/store/hooks";
import { addAlert } from "@/app/store/main/main";
import { getErrorText } from "@ap/shared/dist/libs";
import { IResource, IRole } from "@ap/shared/dist/types";
import { RoleRightsForm } from "@/entities/role/RoleRightsForm";
import { rolesApi } from "@/entities/role/api";
import { ROUTES } from "@/shared/lib/constants";

export const RoleRightsUpdate: FC<{
  role: IRole;
  resources: IResource[];
}> = ({ role, resources }) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [update, updateReq] = rolesApi.useUpdateRightsMutation();
  const rights = useRights(ROUTES.api.roles._);

  useEffect(() => {
    if (updateReq.isSuccess) {
      dispatch(addAlert({ type: "success", text: t("success") }));
    }
  }, [updateReq.isSuccess, dispatch, t]);

  useEffect(() => {
    if (updateReq.error) {
      dispatch(
        addAlert({
          type: "error",
          text: getErrorText(updateReq.error, i18n.language),
        }),
      );
    }
  }, [updateReq.error, dispatch, i18n]);

  return (
    <RoleRightsForm
      role={role}
      resources={resources}
      onUpdate={(newRights) =>
        update({
          id: role.id,
          fields: { items: newRights },
        })
      }
      updateDisabled={!rights.updating || role.default}
      updateLoading={updateReq.isLoading}
    />
  );
};
