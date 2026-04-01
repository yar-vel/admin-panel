import { FC, SubmitEvent, useEffect, useRef, useMemo, useState } from "react";
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
import { SignInGoogleLink } from "./SignInGoogleLink";
import { getErrorText } from "@workspace/shared";
import { ROUTES } from "@workspace/shared";
import { useSignInMutation } from "./mutations";
import { useProfileStore } from "@/entities/profile/store";
import { FetchError } from "@/shared/api/FetchError";

export const SignInForm: FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const setProfile = useProfileStore((s) => s.setProfile);
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [verifyModal, setVerifyModal] = useState(false);
  const signIn = useSignInMutation();
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const errorText = useMemo(() => {
    if (signIn.error instanceof FetchError) {
      switch (signIn.error.status) {
        case 410:
          return t("userDeleted");
        case 403:
          return null;
        case 401:
          return t("wrongEmailOrPassword");
        default:
          return getErrorText(signIn.error, i18n.language);
      }
    }

    return null;
  }, [t, i18n, signIn.error]);

  const handleSubmit = (event?: SubmitEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (email && password) {
      signIn.mutate(
        { username: email, password, rememberMe },
        {
          onSuccess: (data) => {
            setProfile(data);
            onSuccess?.();
          },
          onError: (error) => {
            if (error instanceof FetchError && error.status === 403) {
              setVerifyModal(true);
            }
          },
        },
      );
    }
  };

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

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
          disabled={signIn.isPending || Boolean(signIn.data)}
        />
        <FormPassword
          required
          name="password"
          label={t("password")}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={signIn.isPending || Boolean(signIn.data)}
        />
        <FormCheckbox
          labelProps={{ label: t("rememberMe") }}
          name="remember"
          value="remember"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          disabled={signIn.isPending || Boolean(signIn.data)}
        />
        <FormButton
          type="submit"
          fullWidth
          loading={signIn.isPending || Boolean(signIn.data)}
        >
          {t("signIn")}
        </FormButton>
        <FormLink href={ROUTES.ui.signUp} mui={{ align: "center" }}>
          {t("signUpText")}
        </FormLink>
        <FormLink href={ROUTES.ui.forgotPassword} mui={{ align: "center" }}>
          {t("forgotPasswordText")}
        </FormLink>
        <SignInGoogleLink onSuccess={onSuccess} />
      </FormBase>
      <CustomModal
        open={verifyModal}
        title={t("verification")}
        onClose={() => setVerifyModal(false)}
      >
        <VerifyUserForm
          email={email}
          onClose={() => setVerifyModal(false)}
          onSuccess={() => {
            timeout.current = setTimeout(handleSubmit, 1000);
          }}
        />
      </CustomModal>
    </>
  );
};
