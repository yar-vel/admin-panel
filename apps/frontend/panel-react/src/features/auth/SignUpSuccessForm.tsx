import { FC, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormAlert } from "@/shared/ui/form/FormAlert";

export const SignUpSuccessForm: FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const { t } = useTranslation();

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose?.();
  };

  return (
    <FormBase onSubmit={submitHandler}>
      <FormAlert severity="success">{t("registrationSuccessText")}</FormAlert>
      <FormButton type="submit" fullWidth>
        {t("signIn")}
      </FormButton>
    </FormBase>
  );
};
