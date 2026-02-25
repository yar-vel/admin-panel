import { FC, FormEvent, useEffect, useMemo, useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormPassword } from "@/shared/ui/form/FormPassword";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormLink } from "@/shared/ui/form/FormLink";
import { FormAlert } from "@/shared/ui/form/FormAlert";
import { CustomModal } from "@/shared/ui/modal/CustomModal";
import { SignUpSuccessForm } from "./SignUpSuccessForm";
import {
  EMAIL_REGEX,
  getErrorText,
  NAME_REGEX,
  PASSWORD_REGEX,
  testString,
} from "@ap/shared/dist/libs";
import { authApi } from "@/entities/auth/api";
import { ROUTES } from "@/shared/lib/constants";

export const SignUpForm: FC = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [name, setName] = useState("");
  const nameIsValid = useMemo(() => testString(NAME_REGEX, name), [name]);
  const [email, setEmail] = useState("");
  const emailIsValid = useMemo(() => testString(EMAIL_REGEX, email), [email]);
  const [password, setPassword] = useState("");
  const passwordIsValid = useMemo(
    () => testString(PASSWORD_REGEX, password),
    [password],
  );
  const [successModal, setSuccessModal] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [signUp, { data, error, isLoading }] = authApi.useLazySignUpQuery();

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (nameIsValid && emailIsValid && passwordIsValid) {
      signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });
    }
  };

  const successHandler = () => {
    setSuccessModal(false);
    router.push(ROUTES.ui.signIn);
  };

  useEffect(() => {
    if (isLoading) {
      setErrorText(null);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 409:
          setErrorText(t("userAlreadyExist"));
          break;
        default:
          setErrorText(getErrorText(error, i18n.language));
          break;
      }
    }
  }, [error, t, i18n]);

  useEffect(() => {
    if (data) {
      setSuccessModal(true);
    }
  }, [data]);

  return (
    <>
      <FormBase onSubmit={submitHandler}>
        {errorText && <FormAlert severity="error">{errorText}</FormAlert>}
        <FormField
          required
          name="name"
          label={t("name")}
          value={name}
          onChange={(event) => setName(event.target.value)}
          helperText={t("nameValidation")}
          color={nameIsValid ? "success" : "error"}
          error={!nameIsValid && name.length > 0}
          autoFocus
        />
        <FormField
          required
          name="email"
          type="email"
          label={t("email")}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          helperText={t("emailValidation")}
          color={emailIsValid ? "success" : "error"}
          error={!emailIsValid && email.length > 0}
        />
        <FormPassword
          required
          name="password"
          label={t("password")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          helperText={t("passwordValidation")}
          color={passwordIsValid ? "success" : "error"}
          error={!passwordIsValid && password.length > 0}
        />
        <FormButton type="submit" fullWidth loading={isLoading}>
          {t("signUp")}
        </FormButton>
        <FormLink href={ROUTES.ui.signIn} mui={{ align: "center" }}>
          {t("signInText")}
        </FormLink>
        <FormLink href={ROUTES.ui.forgotPassword} mui={{ align: "center" }}>
          {t("forgotPasswordText")}
        </FormLink>
      </FormBase>
      <CustomModal
        open={successModal}
        title={t("registration")}
        onClose={() => setSuccessModal(false)}
      >
        <SignUpSuccessForm onClose={successHandler} />
      </CustomModal>
    </>
  );
};
