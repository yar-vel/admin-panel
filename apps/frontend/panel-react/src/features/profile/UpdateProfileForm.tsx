import { FC, SubmitEventHandler, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormButton } from "@/shared/ui/form/FormButton";
import { useRights } from "@/shared/hooks/useRights";
import {
  getErrorText,
  getUpdatedValues,
  NAME_REGEX,
  testString,
  IUser,
} from "@workspace/shared";
import { useUpdateProfileMutation } from "@/features/profile/mutations";
import { useProfileStore } from "@/entities/profile/store";
import { useAlertsStore } from "@/shared/model/useAlertsStore";
import { ROUTES } from "@workspace/shared";

export const UpdateProfileForm: FC = () => {
  const { t, i18n } = useTranslation();
  const updateProfile = useUpdateProfileMutation();
  const rights = useRights(ROUTES.api.profile._);
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);
  const addAlert = useAlertsStore((s) => s.addAlert);
  const [newData, setNewData] = useState(profile);
  const nameIsValid = useMemo(
    () => newData?.name && testString(NAME_REGEX, newData.name),
    [newData],
  );

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (!profile || !newData || !nameIsValid) {
      addAlert({ type: "warning", text: t("unknownError") });
      return;
    }

    const updatedValues = getUpdatedValues<IUser>(profile, newData);

    if (Object.keys(updatedValues).length === 0) {
      addAlert({ type: "warning", text: t("nothingToUpdate") });
      return;
    }

    updateProfile.mutate(updatedValues, {
      onSuccess: () => {
        setProfile({ ...profile, ...updatedValues });
        addAlert({ type: "success", text: t("success") });
      },
      onError: (error) =>
        addAlert({ type: "error", text: getErrorText(error, i18n.language) }),
    });
  };

  return (
    <FormBase onSubmit={handleSubmit}>
      {profile?.googleId && (
        <FormField
          name="googleId"
          label={t("googleId")}
          value={profile.googleId}
          disabled
        />
      )}
      <FormField
        required
        name="name"
        label={t("name")}
        value={newData?.name ?? profile?.name ?? ""}
        onChange={(event) =>
          newData && setNewData({ ...newData, name: event.target.value })
        }
        helperText={t("nameValidation")}
        color={nameIsValid ? "success" : "error"}
        error={!nameIsValid && (newData?.name ?? "").length > 0}
      />
      <FormButton
        type="submit"
        color="success"
        disabled={!rights.updating}
        loading={updateProfile.isPending}
      >
        {t("update")}
      </FormButton>
    </FormBase>
  );
};
