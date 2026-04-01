import { FC, SubmitEventHandler, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormLink } from "@/shared/ui/form/FormLink";
import { FormAlert } from "@/shared/ui/form/FormAlert";
import { CustomModal } from "@/shared/ui/modal/CustomModal";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { getErrorText } from "@workspace/shared";
import { ROUTES } from "@workspace/shared";
import { useForgotPasswordMutation } from "./mutations";
import { FetchError } from "@/shared/api/FetchError";

export const ForgotPasswordForm: FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [resetModal, setResetModal] = useState(false);
  const forgotPassword = useForgotPasswordMutation();

  const errorText = useMemo(() => {
    if (forgotPassword.error instanceof FetchError) {
      switch (forgotPassword.error.status) {
        case 404:
          return t("wrongEmail");
        default:
          return getErrorText(forgotPassword.error, i18n.language);
      }
    }

    return null;
  }, [t, i18n, forgotPassword.error]);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (email) {
      forgotPassword.mutate(
        { email },
        { onSuccess: () => setResetModal(true) },
      );
    }
  };

  return (
    <>
      <FormBase onSubmit={handleSubmit}>
        {errorText && <FormAlert severity="error">{errorText}</FormAlert>}
        <FormField
          required
          name="email"
          type="email"
          label={t("email")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
          disabled={forgotPassword.isPending}
        />
        <FormButton type="submit" fullWidth loading={forgotPassword.isPending}>
          {t("confirm")}
        </FormButton>
        <FormLink href={ROUTES.ui.signIn} mui={{ align: "center" }}>
          {t("signInText")}
        </FormLink>
        <FormLink href={ROUTES.ui.signUp} mui={{ align: "center" }}>
          {t("signUpText")}
        </FormLink>
      </FormBase>
      <CustomModal
        open={resetModal}
        title={t("resetPassword")}
        onClose={() => setResetModal(false)}
      >
        <ResetPasswordForm
          email={email}
          onClose={() => setResetModal(false)}
          onSuccess={onSuccess}
        />
      </CustomModal>
    </>
  );
};
