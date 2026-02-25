import {
  IForgotPassword,
  IResetPassword,
  ISignIn,
  ISignInGoogle,
  IVerifyUser,
  TSignUp,
} from "@ap/shared/dist/types";
import { IFetchArgs } from "@/app/api/types";
import { ROUTES } from "@/shared/lib/constants";

class AuthService {
  signUpArgs(payload: TSignUp): IFetchArgs {
    return {
      url: ROUTES.api.auth.sighUp,
      method: "POST",
      body: payload,
    };
  }

  forgotPasswordArgs(payload: IForgotPassword): IFetchArgs {
    return {
      url: ROUTES.api.auth.forgotPassword,
      method: "POST",
      body: payload,
    };
  }

  resetPasswordArgs(payload: IResetPassword): IFetchArgs {
    return {
      url: ROUTES.api.auth.resetPassword,
      method: "POST",
      body: payload,
    };
  }

  signInArgs(payload: ISignIn): IFetchArgs {
    return {
      url: ROUTES.api.auth.signIn,
      method: "POST",
      credentials: "include",
      body: payload,
    };
  }

  verifyUserArgs(payload: IVerifyUser): IFetchArgs {
    return {
      url: ROUTES.api.auth.verifyUser,
      method: "POST",
      body: payload,
    };
  }

  signInGoogleArgs(payload: ISignInGoogle): IFetchArgs {
    return {
      url: ROUTES.api.auth.signInGoogle,
      method: "POST",
      credentials: "include",
      body: payload,
    };
  }

  refreshArgs(): IFetchArgs {
    return {
      url: ROUTES.api.auth.refresh,
      method: "GET",
      credentials: "include",
    };
  }

  signOutArgs(): IFetchArgs {
    return {
      url: ROUTES.api.auth.signOut,
      method: "DELETE",
      credentials: "include",
    };
  }
}

export const authService = new AuthService();
