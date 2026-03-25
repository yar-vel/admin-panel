import { FC, MouseEventHandler, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { FormLink } from "@/shared/ui/form/FormLink";
import { IUser, IWindowMessage } from "@workspace/shared/dist/types";
import { getGoogleSignInUrl } from "@workspace/shared/dist/libs";
import { ROUTES } from "@/shared/lib/constants";
import { useProfileStore } from "@/entities/profile/store";

export const SignInGoogleLink: FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const { t } = useTranslation();
  const setProfile = useProfileStore((s) => s.setProfile);
  const interval = useRef<ReturnType<typeof setInterval>>(undefined);

  const handleGoogle: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();

    const redirectUri =
      location.origin +
      (
        (process.env.HOST?.startsWith("/") ? process.env.HOST : "") +
        ROUTES.ui.signInGoogle
      ).replaceAll("//", "/");

    const message: IWindowMessage<string> = {
      type: ROUTES.ui.signInGoogle,
      payload: String(Math.random()),
    };

    const googleWindow = window.open(
      getGoogleSignInUrl(
        process.env.GOOGLE_CLIENT_ID!,
        redirectUri,
        message.payload,
      ),
      undefined,
      "top=100,left=100,width=500,height=500",
    );

    clearInterval(interval.current);
    interval.current = setInterval(() => {
      googleWindow?.postMessage(message);
    }, 1000);
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent<IWindowMessage<IUser>>) => {
      if (event.data.type !== ROUTES.ui.signInGoogle) {
        return;
      }

      setProfile(event.data.payload);
      onSuccess?.();
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [setProfile, onSuccess]);

  useEffect(() => {
    return () => {
      clearInterval(interval.current);
    };
  }, []);

  if (!process.env.GOOGLE_CLIENT_ID) {
    return;
  }

  return (
    <FormLink
      onClick={handleGoogle}
      href={ROUTES.ui.signInGoogle}
      mui={{ align: "center" }}
    >
      {t("signInWithGoogle")}
    </FormLink>
  );
};
