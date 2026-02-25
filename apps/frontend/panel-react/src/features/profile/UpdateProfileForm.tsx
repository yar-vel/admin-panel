import { FC, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormField } from "@/shared/ui/form/FormField";
import { FormButton } from "@/shared/ui/form/FormButton";
import { useRights } from "@/shared/hooks/useRights";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { addAlert, setProfile } from "@/app/store/main/main";
import {
  getErrorText,
  getUpdatedValues,
  NAME_REGEX,
  testString,
} from "@ap/shared/dist/libs";
import { IUser } from "@ap/shared/dist/types";
import { profileApi } from "@/entities/profile/api";
import { ROUTES } from "@/shared/lib/constants";

export const UpdateProfileForm: FC = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const [update, { isSuccess, isLoading, error }] =
    profileApi.useUpdateProfileMutation();
  const rights = useRights(ROUTES.api.profile._);
  const profile = useAppSelector((store) => store.main.profile);
  const profileRef = useRef(profile);
  const [newData, setNewData] = useState(profile);
  const nameIsValid = useMemo(
    () => newData?.name && testString(NAME_REGEX, newData.name),
    [newData],
  );

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (profile && newData && nameIsValid) {
      const updatedValues = getUpdatedValues<IUser>(profile, newData);

      if (Object.keys(updatedValues).length === 0) {
        dispatch(addAlert({ type: "warning", text: t("nothingToUpdate") }));
      } else {
        update(updatedValues);
      }
    } else {
      dispatch(addAlert({ type: "warning", text: t("unknownError") }));
    }
  };

  useEffect(() => {
    if (profileRef.current) {
      profileRef.current = { ...profileRef.current, ...newData };
    }
  }, [newData]);

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
      dispatch(setProfile(profileRef.current));
      dispatch(addAlert({ type: "success", text: t("success") }));
    }
  }, [isSuccess, dispatch, t]);

  return (
    <FormBase onSubmit={submitHandler}>
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
        value={newData?.name ?? ""}
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
        loading={isLoading}
      >
        {t("update")}
      </FormButton>
    </FormBase>
  );
};
