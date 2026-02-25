import {
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormButton } from "@/shared/ui/form/FormButton";
import { CustomModal } from "@/shared/ui/modal/CustomModal";
import { useRights } from "@/shared/hooks/useRights";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { addAlert } from "@/app/store/main/main";
import { ChangeEmailConfirmForm } from "./ChangeEmailConfirmForm";
import { EMAIL_REGEX, getErrorText, testString } from "@ap/shared/dist/libs";
import { profileApi } from "@/entities/profile/api";
import { ROUTES } from "@/shared/lib/constants";

export const ChangeEmailRequestForm: FC = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [confirmModal, setConfirmModal] = useState(false);
  const [changeEmailRequest, { isSuccess, error, isLoading }] =
    profileApi.useChangeEmailRequestMutation();
  const rights = useRights(ROUTES.api.profile._);
  const profile = useAppSelector((store) => store.main.profile);
  const [email, setEmail] = useState(profile?.email || "");
  const emailIsValid = useMemo(() => testString(EMAIL_REGEX, email), [email]);
  const onClose = useCallback(() => setConfirmModal(false), []);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (emailIsValid) {
      if (email === profile?.email) {
        dispatch(addAlert({ type: "warning", text: t("nothingToUpdate") }));
      } else {
        changeEmailRequest({ newEmail: email });
      }
    } else {
      dispatch(addAlert({ type: "warning", text: t("unknownError") }));
    }
  };

  useEffect(() => {
    if (error) {
      dispatch(
        addAlert({
          type: "error",
          text: getErrorText(error, i18n.language),
        }),
      );
    }
  }, [dispatch, error, i18n]);

  useEffect(() => {
    if (isSuccess) {
      setConfirmModal(true);
    }
  }, [isSuccess]);

  return (
    <>
      <FormBase onSubmit={submitHandler}>
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
          disabled={isLoading}
        />
        <FormButton
          type="submit"
          color="success"
          disabled={!rights.updating}
          loading={isLoading}
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
