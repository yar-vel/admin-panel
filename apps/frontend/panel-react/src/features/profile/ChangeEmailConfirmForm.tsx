import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormField } from "@/shared/ui/form/FormField";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { addAlert, setProfile } from "@/app/store/main/main";
import { useRights } from "@/shared/hooks/useRights";
import { getErrorText } from "@ap/shared/dist/libs";
import { profileApi } from "@/entities/profile/api";
import { ROUTES } from "@/shared/lib/constants";

export const ChangeEmailConfirmForm: FC<{
  email: string;
  onClose?: () => void;
}> = ({ email, onClose }) => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [changeEmailConfirm, { isSuccess, error, isLoading }] =
    profileApi.useChangeEmailConfirmMutation();
  const rights = useRights(ROUTES.api.profile._);
  const profile = useAppSelector((store) => store.main.profile);
  const emailRef = useRef(email);
  const profileRef = useRef(profile);
  const [code, setCode] = useState("");

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeEmailConfirm({ code });
  };

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 404:
          dispatch(
            addAlert({
              type: "error",
              text: t("wrongEmailOrCode"),
            }),
          );
          break;
        default:
          dispatch(
            addAlert({
              type: "error",
              text: getErrorText(error, i18n.language),
            }),
          );
          break;
      }
    }
  }, [error, t, i18n, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      onClose?.();

      if (profileRef.current) {
        dispatch(
          setProfile({ ...profileRef.current, email: emailRef.current }),
        );
      }
    }
  }, [isSuccess, onClose, dispatch]);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  return (
    <FormBase onSubmit={submitHandler}>
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
        loading={isLoading || isSuccess}
      >
        {t("confirm")}
      </FormButton>
      <FormButton fullWidth color="error" onClick={onClose}>
        {t("close")}
      </FormButton>
    </FormBase>
  );
};
