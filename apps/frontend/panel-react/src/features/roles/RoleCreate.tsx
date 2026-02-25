import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { useAppDispatch } from "@/app/store/hooks";
import { addAlert } from "@/app/store/main/main";
import { getErrorText } from "@ap/shared/dist/libs";
import { RoleForm } from "@/entities/role/RoleForm";
import { IRole } from "@ap/shared/dist/types";
import { rolesApi } from "@/entities/role/api";
import { ROUTES } from "@/shared/lib/constants";

export const RoleCreate: FC<{ onCreate?: (data: IRole) => void }> = ({
  onCreate,
}) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [create, createReq] = rolesApi.useCreateMutation();
  const rights = useRights(ROUTES.api.roles._);

  useEffect(() => {
    if (createReq.data) {
      dispatch(addAlert({ type: "success", text: t("success") }));
      onCreate?.(createReq.data);
    }
  }, [createReq.data, dispatch, onCreate, t]);

  useEffect(() => {
    if (createReq.error) {
      dispatch(
        addAlert({
          type: "error",
          text: getErrorText(createReq.error, i18n.language),
        }),
      );
    }
  }, [createReq.error, dispatch, i18n]);

  return (
    <RoleForm
      onCreate={(fields) => create(fields)}
      createDisabled={!rights.creating}
      createLoading={createReq.isLoading || Boolean(createReq.data)}
    />
  );
};
