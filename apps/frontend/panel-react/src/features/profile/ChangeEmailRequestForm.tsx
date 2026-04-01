import { FC, SubmitEventHandler, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormButton } from "@/shared/ui/form/FormButton";
import { CustomModal } from "@/shared/ui/modal/CustomModal";
import { useRights } from "@/shared/hooks/useRights";
import { ChangeEmailConfirmForm } from "./ChangeEmailConfirmForm";
import {
  EMAIL_REGEX,
  getErrorText,
  testString,
} from "@workspace/shared";
import { ROUTES } from "@workspace/shared";
import { useProfileStore } from "@/entities/profile/store";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { useChangeEmailRequestMutation } from "./mutations";

export const ChangeEmailRequestForm: FC = () => {
  const { t, i18n } = useTranslation();
  const [confirmModal, setConfirmModal] = useState(false);
  const changeEmailRequest = useChangeEmailRequestMutation();
  const rights = useRights(ROUTES.api.profile._);
  const profile = useProfileStore((s) => s.profile);
  const addAlert = useAlertsStore((s) => s.addAlert);
  const [email, setEmail] = useState("");
  const emailIsValid = useMemo(() => testString(EMAIL_REGEX, email), [email]);
  const onClose = () => setConfirmModal(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (emailIsValid) {
      if (email === profile?.email) {
        addAlert({ type: "warning", text: t("nothingToUpdate") });
      } else {
        changeEmailRequest.mutate(
          { newEmail: email },
          {
            onSuccess: () => setConfirmModal(true),
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
    <>
      <FormBase onSubmit={handleSubmit}>
        <FormField
          required
          name="email"
          type="email"
          label={t("email")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          helperText={profile?.email || t("emailValidation")}
          color={emailIsValid ? "success" : "error"}
          error={!emailIsValid && email.length > 0}
          disabled={changeEmailRequest.isPending}
        />
        <FormButton
          type="submit"
          color="success"
          disabled={!rights.updating}
          loading={changeEmailRequest.isPending}
        >
          {t("change")}
        </FormButton>
      </FormBase>
      <CustomModal
        open={confirmModal}
        title={t("changeEmail")}
        onClose={onClose}
      >
        <ChangeEmailConfirmForm email={email} onClose={onClose} />
      </CustomModal>
    </>
  );
};
