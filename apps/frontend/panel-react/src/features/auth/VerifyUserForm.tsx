import { FC, SubmitEventHandler, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormAlert } from "@/shared/ui/form/FormAlert";
import { getErrorText } from "@workspace/shared/dist/libs";
import { useVerifyUserMutation } from "./mutations";
import { FetchError } from "@/shared/api/FetchError";

export const VerifyUserForm: FC<{
  email: string;
  onClose?: () => void;
  onSuccess?: () => void;
}> = ({ email, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const verifyUser = useVerifyUserMutation();
  const [code, setCode] = useState("");

  const errorText = useMemo(() => {
    if (verifyUser.error instanceof FetchError) {
      switch (verifyUser.error.status) {
        case 404:
          return t("wrongCode");
        default:
          return getErrorText(verifyUser.error, i18n.language);
      }
    }

    return null;
  }, [t, i18n, verifyUser.error]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    verifyUser.mutate(
      { email, code },
      {
        onSuccess: () => {
          onClose?.();
          onSuccess?.();
        },
      },
    );
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
      <FormButton
        type="submit"
        fullWidth
        loading={verifyUser.isPending || verifyUser.isSuccess}
      >
        {t("confirm")}
      </FormButton>
      <FormButton color="error" onClick={onClose} fullWidth>
        {t("close")}
      </FormButton>
    </FormBase>
  );
};
