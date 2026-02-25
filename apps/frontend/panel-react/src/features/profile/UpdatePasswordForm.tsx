import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormButton } from "@/shared/ui/form/FormButton";
import { useRights } from "@/shared/hooks/useRights";
import { useAppDispatch } from "@/app/store/hooks";
import { addAlert } from "@/app/store/main/main";
import { FormPassword } from "@/shared/ui/form/FormPassword";
import { getErrorText, PASSWORD_REGEX, testString } from "@ap/shared/dist/libs";
import { profileApi } from "@/entities/profile/api";
import { ROUTES } from "@/shared/lib/constants";

export const UpdatePasswordForm: FC = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [update, { isSuccess, isLoading, error }] =
    profileApi.useUpdatePasswordMutation();
  const rights = useRights(ROUTES.api.profile._);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const passwordIsValid = useMemo(
    () => testString(PASSWORD_REGEX, newPassword),
    [newPassword],
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passwordIsValid) {
      if (oldPassword === newPassword) {
        dispatch(addAlert({ type: "warning", text: t("nothingToUpdate") }));
      } else {
        update({ oldPassword, newPassword });
      }
    } else {
      dispatch(addAlert({ type: "warning", text: t("unknownError") }));
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(
        addAlert({
          type: "error",
          text: getErrorText(error, i18n.language),
        }),
      );
    }
  }, [dispatch, error, i18n]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(addAlert({ type: "success", text: t("success") }));
    }
  }, [isSuccess, dispatch, t]);

  return (
    <FormBase onSubmit={submitHandler}>
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
        loading={isLoading}
      >
        {t("update")}
      </FormButton>
    </FormBase>
  );
};
