import { FC, MouseEventHandler, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { FormLink } from "@/shared/ui/form/FormLink";
import { useAppDispatch } from "@/app/store/hooks";
import { setProfile } from "@/app/store/main/main";
import { IUser, IWindowMessage } from "@ap/shared/dist/types";
import { getGoogleSignInUrl } from "@ap/shared/dist/libs";
import { ROUTES } from "@/shared/lib/constants";

export const SignInGoogleLink: FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const timeout = useRef<NodeJS.Timeout>(undefined);

  const googleHandler: MouseEventHandler<HTMLAnchorElement> = (event) => {
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

    clearTimeout(timeout.current);
    timeout.current = setInterval(() => {
      googleWindow?.postMessage(message);
    }, 1000);
  };

  useEffect(() => {
    const messageHandler = (event: MessageEvent<IWindowMessage<IUser>>) => {
      if (event.data.type !== ROUTES.ui.signInGoogle) {
        return;
      }

      dispatch(setProfile(event.data.payload));
      router.push(
        decodeURIComponent(searchParams.get("return") || ROUTES.ui.home),
      );
    };

    window.addEventListener("message", messageHandler);

    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [dispatch, router, searchParams]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  if (!process.env.GOOGLE_CLIENT_ID) {
    return;
  }

  return (
    <FormLink
      onClick={googleHandler}
      href={ROUTES.ui.signInGoogle}
      mui={{ align: "center" }}
    >
      {t("signInWithGoogle")}
    </FormLink>
  );
};
