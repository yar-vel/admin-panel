import { fetchWithAuth } from "@/shared/api/fetchWithAuth";
import { ROUTES } from "@workspace/shared";
import {
  IForgotPassword,
  IResetPassword,
  ISignIn,
  ISignInGoogle,
  IUser,
  IVerifyUser,
  TSignUp,
} from "@workspace/shared";

export const signUp = async (payload: TSignUp): Promise<IUser> => {
  const response = await fetchWithAuth(ROUTES.api.auth.sighUp, {
    method: "POST",
    body: payload,
  });

  return response.json();
};

export const forgotPassword = async (
  payload: IForgotPassword,
): Promise<void> => {
  await fetchWithAuth(ROUTES.api.auth.forgotPassword, {
    method: "POST",
    body: payload,
  });
};

export const resetPassword = async (payload: IResetPassword): Promise<void> => {
  await fetchWithAuth(ROUTES.api.auth.resetPassword, {
    method: "POST",
    body: payload,
  });
};

export const signIn = async (payload: ISignIn): Promise<IUser> => {
  const response = await fetchWithAuth(ROUTES.api.auth.signIn, {
    method: "POST",
    credentials: "include",
    body: payload,
  });

  return response.json();
};

export const verifyUser = async (payload: IVerifyUser): Promise<void> => {
  await fetchWithAuth(ROUTES.api.auth.verifyUser, {
    method: "POST",
    body: payload,
  });
};

export const signInGoogle = async (payload: ISignInGoogle): Promise<IUser> => {
  const response = await fetchWithAuth(ROUTES.api.auth.signInGoogle, {
    method: "POST",
    credentials: "include",
    body: payload,
  });

  return response.json();
};

export const signOut = async (): Promise<void> => {
  await fetchWithAuth(ROUTES.api.auth.signOut, {
    method: "DELETE",
    credentials: "include",
  });
};
