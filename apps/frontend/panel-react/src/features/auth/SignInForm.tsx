import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { FormPassword } from "@/shared/ui/form/FormPassword";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormLink } from "@/shared/ui/form/FormLink";
import { FormAlert } from "@/shared/ui/form/FormAlert";
import { CustomModal } from "@/shared/ui/modal/CustomModal";
import { VerifyUserForm } from "./VerifyUserForm";
import { useAppDispatch } from "@/app/store/hooks";
import { setProfile } from "@/app/store/main/main";
import { SignInGoogleLink } from "./SignInGoogleLink";
import { getErrorText } from "@ap/shared/dist/libs";
import { authApi } from "@/entities/auth/api";
import { ROUTES } from "@/shared/lib/constants";

export const SignInForm: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [signIn, { data, error, isFetching }] = authApi.useLazySignInQuery();
  const timeout = useRef<NodeJS.Timeout>(undefined);

  const submitHandler = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (email && password) {
      signIn({ username: email, password, rememberMe });
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
        case 410:
          setErrorText(t("userDeleted"));
          break;
        case 403:
          setVerifyModal(true);
          break;
        case 401:
          setErrorText(t("wrongEmailOrPassword"));
          break;
        default:
          setErrorText(getErrorText(error, i18n.language));
          break;
      }
    }
  }, [error, t, i18n]);

  useEffect(() => {
    if (data) {
      dispatch(setProfile(data));
      router.push(
        decodeURIComponent(searchParams.get("return") || ROUTES.ui.home),
      );
    }
  }, [data, dispatch, router, searchParams]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

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
          disabled={isFetching || Boolean(data)}
        />
        <FormPassword
          required
          name="password"
          label={t("password")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isFetching || Boolean(data)}
        />
        <FormCheckbox
          labelProps={{ label: t("rememberMe") }}
          name="remember"
          value="remember"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          disabled={isFetching || Boolean(data)}
        />
        <FormButton
          type="submit"
          fullWidth
          loading={isFetching || Boolean(data)}
        >
          {t("signIn")}
        </FormButton>
        <FormLink href={ROUTES.ui.signUp} mui={{ align: "center" }}>
          {t("signUpText")}
        </FormLink>
        <FormLink href={ROUTES.ui.forgotPassword} mui={{ align: "center" }}>
          {t("forgotPasswordText")}
        </FormLink>
        <SignInGoogleLink />
      </FormBase>
      <CustomModal
        open={verifyModal}
        title={t("verification")}
        onClose={() => setVerifyModal(false)}
      >
        <VerifyUserForm
          email={email}
          onClose={() => setVerifyModal(false)}
          onSuccess={() => (timeout.current = setTimeout(submitHandler, 1000))}
        />
      </CustomModal>
    </>
  );
};
