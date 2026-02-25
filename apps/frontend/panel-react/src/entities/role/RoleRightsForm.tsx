import { FC, FormEvent, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormButton } from "@/shared/ui/form/FormButton";
import { IResource, IRights, IRole } from "@ap/shared/dist/types";
import { ResourceRights } from "@/entities/resource/ResourceRights";
import { IEntityFormUpdate } from "@/shared/lib/types";

export const RoleRightsForm: FC<
  {
    role: IRole;
    resources: IResource[];
  } & IEntityFormUpdate<IRights[]>
> = ({ role, resources, onUpdate, updateDisabled, updateLoading }) => {
  const { t } = useTranslation();
  const [updatedRights, setUpdatedRights] = useState(role.rights ?? []);

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdate?.(updatedRights);
  };

  const updateRights = (newRights: IRights) => {
    const filteredRights = updatedRights.filter((value) => {
      if (
        newRights.roleId === value.roleId &&
        newRights.resourceId === value.resourceId
      ) {
        return false;
      } else {
        return true;
      }
    });

    if (
      newRights.creating ||
      newRights.reading ||
      newRights.updating ||
      newRights.deleting
    ) {
      filteredRights.push(newRights);
    }

    setUpdatedRights(filteredRights);
  };

  return (
    <FormBase onSubmit={submitHandler}>
      {resources.map((resource) => (
        <ResourceRights
          key={resource.id}
          roleId={role.id}
          resource={resource}
          rights={updatedRights.find(
            (value) => value.resourceId === resource.id,
          )}
          onUpdate={updateRights}
        />
      ))}
      <br />
      <FormButton
        type="submit"
        color="success"
        startIcon={<SaveIcon />}
        disabled={updateDisabled}
        loading={updateLoading}
      >
        {t("update")}
      </FormButton>
    </FormBase>
  );
};
