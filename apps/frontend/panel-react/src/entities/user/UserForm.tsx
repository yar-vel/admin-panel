import { FC, FormEvent, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { IUser, TUserCreate, TUserUpdate } from "@ap/shared/dist/types";
import {
  EMAIL_REGEX,
  NAME_REGEX,
  PASSWORD_REGEX,
  testString,
} from "@ap/shared/dist/libs";
import { FormPassword } from "@/shared/ui/form/FormPassword";
import { IEntityForm } from "@/shared/lib/types";

export const UserForm: FC<IEntityForm<IUser, TUserCreate, TUserUpdate>> = ({
  initialData,
  onCreate,
  createDisabled,
  createLoading,
  onUpdate,
  updateDisabled,
  updateLoading,
  onDelete,
  deleteDisabled,
  deleteLoading,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<IUser>(
    initialData ?? {
      id: "",
      email: "",
      password: "",
      name: "",
      enabled: false,
      verified: false,
    },
  );
  const emailIsValid = useMemo(
    () => testString(EMAIL_REGEX, data.email ?? ""),
    [data],
  );
  const nameIsValid = useMemo(() => testString(NAME_REGEX, data.name), [data]);
  const passwordIsValid = useMemo(
    () => testString(PASSWORD_REGEX, data.password ?? ""),
    [data],
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (data.email && data.password) {
      onCreate?.({
        email: data.email,
        password: data.password,
        name: data.name,
        enabled: data.enabled,
      });
    }

    onUpdate?.({
      name: data.name,
      enabled: data.enabled,
    });
  };

  return (
    <FormBase onSubmit={submitHandler}>
      {onCreate && (
        <FormField
          required
          name="email"
          type="email"
          label={t("email")}
          value={data.email ?? ""}
          onChange={(event) => setData({ ...data, email: event.target.value })}
          helperText={t("emailValidation")}
          color={emailIsValid ? "success" : "error"}
          error={!emailIsValid && (data.email ?? "").length > 0}
        />
      )}
      <FormField
        required
        name="name"
        label={t("name")}
        value={data.name}
        onChange={(event) => setData({ ...data, name: event.target.value })}
        helperText={t("nameValidation")}
        color={nameIsValid ? "success" : "error"}
        error={!nameIsValid && data.name.length > 0}
      />
      {onCreate && (
        <FormPassword
          required
          autoComplete="new-password"
          name="password"
          label={t("password")}
          value={data.password}
          onChange={(event) =>
            setData({ ...data, password: event.target.value })
          }
          helperText={t("passwordValidation")}
          color={passwordIsValid ? "success" : "error"}
          error={!passwordIsValid && (data.password ?? "").length > 0}
        />
      )}
      <FormCheckbox
        labelProps={{ label: t("enabled") }}
        name="enabled"
        value="enabled"
        checked={data.enabled}
        onChange={() => setData({ ...data, enabled: !data.enabled })}
        disabled={initialData?.roles?.some((role) => role.admin)}
      />
      {onCreate && (
        <FormButton
          type="submit"
          color="primary"
          startIcon={<AddIcon />}
          disabled={createDisabled}
          loading={createLoading}
        >
          {t("create")}
        </FormButton>
      )}
      {onUpdate && (
        <FormButton
          type="submit"
          color="success"
          startIcon={<SaveIcon />}
          disabled={updateDisabled}
          loading={updateLoading}
        >
          {t("update")}
        </FormButton>
      )}
      {onDelete && (
        <FormButton
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
          disabled={deleteDisabled}
          loading={deleteLoading}
        >
          {t("delete")}
        </FormButton>
      )}
    </FormBase>
  );
};
