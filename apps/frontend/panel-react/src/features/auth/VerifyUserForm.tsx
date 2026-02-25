import { FC, FormEvent, useEffect, useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormAlert } from "@/shared/ui/form/FormAlert";
import { getErrorText } from "@ap/shared/dist/libs";
import { authApi } from "@/entities/auth/api";

export const VerifyUserForm: FC<{
  email: string;
  onClose?: () => void;
  onSuccess?: () => void;
}> = ({ email, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const [verifyUser, { isSuccess, error, isFetching }] =
    authApi.useLazyVerifyUserQuery();
  const [errorText, setErrorText] = useState<string | null>(null);
  const [code, setCode] = useState("");

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verifyUser({ email, code });
  };

  useEffect(() => {
    if (isFetching) {
      setErrorText(null);
    }
  }, [isFetching]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          setErrorText(t("wrongCode"));
          break;
        default:
          setErrorText(getErrorText(error, i18n.language));
          break;
      }
    }
  }, [error, t, i18n]);

  useEffect(() => {
    if (isSuccess) {
      onClose?.();
      onSuccess?.();
    }
  }, [isSuccess, onClose, onSuccess]);

  return (
    <FormBase onSubmit={submitHandler}>
      {errorText && <FormAlert severity="error">{errorText}</FormAlert>}
      <FormField
        required
        autoComplete="off"
        name="code"
        label={t("code")}
        value={code}
        onChange={(event) => setCode(event.target.value)}
        helperText={`${t("codeFromEmail")} (${email})`}
      />
      <FormButton type="submit" fullWidth loading={isFetching || isSuccess}>
        {t("confirm")}
      </FormButton>
      <FormButton color="error" onClick={onClose} fullWidth>
        {t("close")}
      </FormButton>
    </FormBase>
  );
};
