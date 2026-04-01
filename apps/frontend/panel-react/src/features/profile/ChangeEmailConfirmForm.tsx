import { FC, SubmitEventHandler, useState } from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormField } from "@/shared/ui/form/FormField";
import { useRights } from "@/shared/hooks/useRights";
import { getErrorText } from "@workspace/shared";
import { ROUTES } from "@workspace/shared";
import { useChangeEmailConfirmMutation } from "./mutations";
import { useProfileStore } from "@/entities/profile/store";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { FetchError } from "@/shared/api/FetchError";

export const ChangeEmailConfirmForm: FC<{
  email: string;
  onClose?: () => void;
}> = ({ email, onClose }) => {
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const addAlert = useAlertsStore((s) => s.addAlert);
  const { t, i18n } = useTranslation();
  const changeEmailConfirm = useChangeEmailConfirmMutation();
  const rights = useRights(ROUTES.api.profile._);
  const [code, setCode] = useState("");

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    changeEmailConfirm.mutate(
      { code },
      {
        onSuccess: () => {
          if (profile) {
            setProfile({ ...profile, email });
          }

          addAlert({ type: "success", text: t("success") });
          onClose?.();
        },
        onError: (error) => {
          if (error instanceof FetchError && error.status === 404) {
            addAlert({ type: "error", text: t("wrongEmailOrCode") });
          } else {
            addAlert({
              type: "error",
              text: getErrorText(error, i18n.language),
            });
          }
        },
      },
    );
  };

  return (
    <FormBase onSubmit={handleSubmit}>
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
        disabled={!rights.updating}
        loading={changeEmailConfirm.isPending || changeEmailConfirm.isSuccess}
      >
        {t("confirm")}
      </FormButton>
      <FormButton fullWidth color="error" onClick={onClose}>
        {t("close")}
      </FormButton>
    </FormBase>
  );
};
