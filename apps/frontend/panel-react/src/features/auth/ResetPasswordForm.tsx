import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormAlert } from "@/shared/ui/form/FormAlert";
import { FormField } from "@/shared/ui/form/FormField";
import { FormPassword } from "@/shared/ui/form/FormPassword";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { getErrorText, PASSWORD_REGEX, testString } from "@ap/shared/dist/libs";
import { authApi } from "@/entities/auth/api";
import { ROUTES } from "@/shared/lib/constants";

export const ResetPasswordForm: FC<{
  email: string;
  onClose?: () => void;
}> = ({ email, onClose }) => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [resetPassword, { isSuccess, error, isLoading }] =
    authApi.useLazyResetPasswordQuery();
  const [errorText, setErrorText] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const passwordIsValid = useMemo(
    () => testString(PASSWORD_REGEX, password),
    [password],
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email && code && passwordIsValid) {
      resetPassword({ email, code, password });
    }
  };

  useEffect(() => {
    if (isLoading) {
      setErrorText(null);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          setErrorText(t("wrongEmailOrCode"));
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
      router.push(ROUTES.ui.signIn);
    }
  }, [isSuccess, onClose, router]);

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
      <FormPassword
        required
        autoComplete="new-password"
        name="newPassword"
        label={t("newPassword")}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        helperText={t("passwordValidation")}
        color={passwordIsValid ? "success" : "error"}
        error={!passwordIsValid && password.length > 0}
      />
      <FormButton type="submit" fullWidth loading={isLoading || isSuccess}>
        {t("confirm")}
      </FormButton>
      <FormButton fullWidth color="error" onClick={onClose}>
        {t("close")}
      </FormButton>
    </FormBase>
  );
};
