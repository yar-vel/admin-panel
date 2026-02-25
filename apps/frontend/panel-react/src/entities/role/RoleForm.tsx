import { FC, FormEvent, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormButton } from "@/shared/ui/form/FormButton";
import { FormCheckbox } from "@/shared/ui/form/FormCheckbox";
import { IRole, TRoleCreate, TRoleUpdate } from "@ap/shared/dist/types";
import { IEntityForm } from "@/shared/lib/types";

export const RoleForm: FC<IEntityForm<IRole, TRoleCreate, TRoleUpdate>> = ({
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
  const [data, setData] = useState<IRole>(
    initialData ?? {
      id: "",
      name: "",
      description: "",
      default: false,
      enabled: false,
      admin: false,
    },
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onCreate?.({
      name: data.name,
      description: data.description,
      enabled: data.enabled,
    });
    onUpdate?.({
      name: data.name,
      description: data.description,
      enabled: data.enabled,
    });
  };

  return (
    <FormBase onSubmit={submitHandler}>
      <FormField
        required
        name="name"
        label={t("name")}
        value={data.name}
        onChange={(event) => setData({ ...data, name: event.target.value })}
      />
      <FormField
        name="description"
        label={t("description")}
        value={data.description}
        onChange={(event) =>
          setData({ ...data, description: event.target.value })
        }
      />
      <FormCheckbox
        labelProps={{ label: t("enabled") }}
        name="enabled"
        value="enabled"
        checked={data.enabled}
        onChange={() => setData({ ...data, enabled: !data.enabled })}
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
