import { FC, FormEvent, useEffect, useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormLink } from "@/shared/ui/form/FormLink";
import { FormAlert } from "@/shared/ui/form/FormAlert";
import { CustomModal } from "@/shared/ui/modal/CustomModal";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { getErrorText } from "@ap/shared/dist/libs";
import { authApi } from "@/entities/auth/api";
import { ROUTES } from "@/shared/lib/constants";

export const ForgotPasswordForm: FC = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [resetModal, setResetModal] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [forgotPassword, { isSuccess, error, isFetching }] =
    authApi.useLazyForgotPasswordQuery();

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (email) {
      forgotPassword({ email });
    }
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
          setErrorText(t("wrongEmail"));
          break;
        default:
          setErrorText(getErrorText(error, i18n.language));
          break;
      }
    }
  }, [error, t, i18n]);

  useEffect(() => {
    if (isSuccess) {
      setResetModal(true);
    }
  }, [isSuccess]);

  return (
    <>
      <FormBase onSubmit={submitHandler}>
        {errorText && <FormAlert severity="error">{errorText}</FormAlert>}
        <FormField
          required
          name="email"
          type="email"
          label={t("email")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
          disabled={isFetching}
        />
        <FormButton type="submit" fullWidth loading={isFetching}>
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
        <ResetPasswordForm email={email} onClose={() => setResetModal(false)} />
      </CustomModal>
    </>
  );
};
