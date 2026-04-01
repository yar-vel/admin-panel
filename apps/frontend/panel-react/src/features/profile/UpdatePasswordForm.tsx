import { FC, SubmitEventHandler, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormButton } from "@/shared/ui/form/FormButton";
import { useRights } from "@/shared/hooks/useRights";
import { FormPassword } from "@/shared/ui/form/FormPassword";
import {
  getErrorText,
  PASSWORD_REGEX,
  testString,
} from "@workspace/shared";
import { ROUTES } from "@workspace/shared";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { useUpdatePasswordMutation } from "./mutations";

export const UpdatePasswordForm: FC = () => {
  const { t, i18n } = useTranslation();
  const updatePassword = useUpdatePasswordMutation();
  const rights = useRights(ROUTES.api.profile._);
  const addAlert = useAlertsStore((s) => s.addAlert);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const passwordIsValid = useMemo(
    () => testString(PASSWORD_REGEX, newPassword),
    [newPassword],
  );

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (passwordIsValid) {
      if (oldPassword === newPassword) {
        addAlert({ type: "warning", text: t("nothingToUpdate") });
      } else {
        updatePassword.mutate(
          { oldPassword, newPassword },
          {
            onSuccess: () => addAlert({ type: "success", text: t("success") }),
            onError: (error) =>
              addAlert({
                type: "error",
                text: getErrorText(error, i18n.language),
              }),
          },
        );
      }
    } else {
      addAlert({ type: "warning", text: t("unknownError") });
    }
  };

  return (
    <FormBase onSubmit={handleSubmit}>
      <FormPassword
        name="old-password"
        label={t("oldPassword")}
        value={oldPassword}
        onChange={(event) => setOldPassword(event.target.value)}
      />
      <FormPassword
        required
        name="new-password"
        label={t("newPassword")}
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        helperText={t("passwordValidation")}
        color={passwordIsValid ? "success" : "error"}
        error={!passwordIsValid && newPassword.length > 0}
      />
      <FormButton
        type="submit"
        color="success"
        disabled={!rights.updating}
        loading={updatePassword.isPending}
      >
        {t("update")}
      </FormButton>
    </FormBase>
  );
};
