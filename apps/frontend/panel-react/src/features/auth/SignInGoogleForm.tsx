import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormAlert } from "@/shared/ui/form/FormAlert";
import { IUser, IWindowMessage, getErrorText } from "@workspace/shared";
import { ROUTES } from "@workspace/shared";
import { useSignInGoogleMutation } from "./mutations";
import { FetchError } from "@/shared/api/FetchError";

export const SignInGoogleForm: FC = () => {
  const { t, i18n } = useTranslation();
  const { mutate, error, data } = useSignInGoogleMutation();
  const [hash] = useState(() => new URLSearchParams(location.hash.slice(1)));

  const errorText = useMemo(() => {
    if (!hash.has("access_token")) {
      return t("error");
    }

    if (error instanceof FetchError) {
      switch (error.status) {
        case 410:
          return t("userDeleted");
        default:
          return getErrorText(error, i18n.language);
      }
    }

    return null;
  }, [t, i18n, error, hash]);

  const handleMessage = useCallback(
    (event: MessageEvent<IWindowMessage<string>>) => {
      if (event.data.type !== ROUTES.ui.signInGoogle || !data) {
        return;
      }

      if (event.data.payload === hash.get("state")) {
        const message: IWindowMessage<IUser> = {
          type: ROUTES.ui.signInGoogle,
          payload: data,
        };
        event.source?.postMessage(message);
      }

      window.close();
    },
    [data, hash],
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  useEffect(() => {
    if (hash.has("access_token")) {
      mutate({ googleAccessToken: hash.get("access_token")! });
    }
  }, [mutate, hash]);

  return (
    <FormBase>
      {errorText ? (
        <FormAlert severity="error">{errorText}</FormAlert>
      ) : (
        <Typography
          align="center"
          variant="subtitle1"
          sx={{ mt: 2, opacity: 0.75 }}
        >
          {t("loading")}...
        </Typography>
      )}
    </FormBase>
  );
};
