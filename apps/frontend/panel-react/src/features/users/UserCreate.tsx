import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useRights } from "@/shared/hooks/useRights";
import { getErrorText, IUser, TUserCreate } from "@workspace/shared";
import { UserForm } from "@/entities/user/UserForm";
import { useCreateUserMutation } from "./mutations";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { ROUTES } from "@workspace/shared";

export const UserCreate: FC<{ onCreate?: (data: IUser) => void }> = ({
  onCreate,
}) => {
  const { t, i18n } = useTranslation();
  const createUser = useCreateUserMutation();
  const rights = useRights(ROUTES.api.users._);
  const addAlert = useAlertsStore((s) => s.addAlert);

  const handleCreate = (fields: TUserCreate) => {
    createUser.mutate(fields, {
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
    <UserForm
      onCreate={handleCreate}
      createDisabled={!rights.creating}
      createLoading={createUser.isPending || Boolean(createUser.data)}
    />
  );
};
