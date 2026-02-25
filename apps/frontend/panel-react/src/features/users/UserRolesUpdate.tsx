import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { useAppDispatch } from "@/app/store/hooks";
import { addAlert } from "@/app/store/main/main";
import { IRole, IUser } from "@ap/shared/dist/types";
import { getErrorText } from "@ap/shared/dist/libs";
import { UserRolesForm } from "@/entities/user/UserRolesForm";
import { usersApi } from "@/entities/user/api";
import { ROUTES } from "@/shared/lib/constants";

export const UserRolesUpdate: FC<{
  user: IUser;
  roles: IRole[];
}> = ({ user, roles }) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [update, updateReq] = usersApi.useUpdateRolesMutation();
  const rights = useRights(ROUTES.api.users._);

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
    <UserRolesForm
      user={user}
      roles={roles}
      onUpdate={(newUserRoles) =>
        update({
          id: user.id,
          fields: { items: newUserRoles },
        })
      }
      updateDisabled={!rights.updating}
      updateLoading={updateReq.isLoading}
    />
  );
};
