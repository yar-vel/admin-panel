import { createApi } from "@reduxjs/toolkit/query/react";

import {
  IForgotPassword,
  IResetPassword,
  ISignIn,
  ISignInGoogle,
  IUser,
  IVerifyUser,
  TSignUp,
} from "@ap/shared/dist/types";
import { baseQueryWithReauth } from "@/app/api/baseQueryWithReauth";
import { authService } from "./service";

export const authApi = createApi({
  reducerPath: "auth",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    signUp: builder.query<IUser, TSignUp>({
      query: authService.signUpArgs,
    }),

    forgotPassword: builder.query<undefined, IForgotPassword>({
      query: authService.forgotPasswordArgs,
    }),

    resetPassword: builder.query<undefined, IResetPassword>({
      query: authService.resetPasswordArgs,
    }),

    verifyUser: builder.query<undefined, IVerifyUser>({
      query: authService.verifyUserArgs,
    }),

    signIn: builder.query<IUser, ISignIn>({
      query: authService.signInArgs,
    }),

    signInGoogle: builder.query<IUser, ISignInGoogle>({
      query: authService.signInGoogleArgs,
    }),

    refresh: builder.query<undefined, void>({
      query: authService.refreshArgs,
    }),

    signOut: builder.mutation<undefined, void>({
      query: authService.signOutArgs,
    }),
  }),
});
