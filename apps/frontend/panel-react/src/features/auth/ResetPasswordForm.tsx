import { FC, SubmitEventHandler, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormAlert } from "@/shared/ui/form/FormAlert";
import { FormField } from "@/shared/ui/form/FormField";
import { FormPassword } from "@/shared/ui/form/FormPassword";
import {
  getErrorText,
  PASSWORD_REGEX,
  testString,
} from "@workspace/shared/dist/libs";
import { useResetPasswordMutation } from "./mutations";
import { FetchError } from "@/shared/api/FetchError";

export const ResetPasswordForm: FC<{
  email: string;
  onClose?: () => void;
  onSuccess?: () => void;
}> = ({ email, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const resetPassword = useResetPasswordMutation();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const passwordIsValid = useMemo(
    () => testString(PASSWORD_REGEX, password),
    [password],
  );

  const errorText = useMemo(() => {
    if (resetPassword.error instanceof FetchError) {
      switch (resetPassword.error.status) {
        case 404:
          return t("wrongEmailOrCode");
        default:
          return getErrorText(resetPassword.error, i18n.language);
      }
    }

    return null;
  }, [t, i18n, resetPassword.error]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (email && code && passwordIsValid) {
      resetPassword.mutate(
        { email, code, password },
        { onSuccess: () => onSuccess?.() },
      );
    }
  };

  return (
    <FormBase onSubmit={handleSubmit}>
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
      <FormButton
        type="submit"
        fullWidth
        loading={resetPassword.isPending || resetPassword.isSuccess}
      >
        {t("confirm")}
      </FormButton>
      <FormButton fullWidth color="error" onClick={onClose}>
        {t("close")}
      </FormButton>
    </FormBase>
  );
};
