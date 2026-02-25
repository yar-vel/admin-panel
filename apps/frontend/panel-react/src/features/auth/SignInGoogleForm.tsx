import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Typography } from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useTranslation } from "react-i18next";

import { FormBase } from "@/shared/ui/form/FormBase";
import { FormAlert } from "@/shared/ui/form/FormAlert";
import { IUser, IWindowMessage } from "@ap/shared/dist/types";
import { getErrorText } from "@ap/shared/dist/libs";
import { authApi } from "@/entities/auth/api";
import { ROUTES } from "@/shared/lib/constants";

export const SignInGoogleForm: FC = () => {
  const { t, i18n } = useTranslation();
  const hash = useRef(
    new URLSearchParams(
      typeof location === "object" ? location.hash.slice(1) : "",
    ),
  );
  const [errorText, setErrorText] = useState<string | null>(null);
  const [signInGoogle, { data, error }] = authApi.useLazySignInGoogleQuery();

  const messageHandler = useCallback(
    (event: MessageEvent<IWindowMessage<string>>) => {
      if (event.data.type !== ROUTES.ui.signInGoogle || !data) {
        return;
      }

      if (event.data.payload === hash.current.get("state")) {
        const message: IWindowMessage<IUser> = {
          type: ROUTES.ui.signInGoogle,
          payload: data,
        };

        event.source?.postMessage(message);
      }

      window.close();
    },
    [data],
  );

  useEffect(() => {
    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [messageHandler]);

  useEffect(() => {
    if (hash.current.has("access_token")) {
      signInGoogle({ googleAccessToken: hash.current.get("access_token")! });
    } else {
      setErrorText(t("error"));
    }
  }, [signInGoogle, t]);

  useEffect(() => {
    if (error) {
      switch ((error as FetchBaseQueryError).status) {
        case 410:
          setErrorText(t("userDeleted"));
          break;
        default:
          setErrorText(getErrorText(error, i18n.language));
          break;
      }
    }
  }, [error, t, i18n]);

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
