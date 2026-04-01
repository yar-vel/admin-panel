import { useMutation } from "@tanstack/react-query";

import {
  forgotPassword,
  resetPassword,
  signIn,
  signInGoogle,
  signOut,
  signUp,
  verifyUser,
} from "@/entities/auth/api";

export const useSignUpMutation = () => useMutation({ mutationFn: signUp });

export const useForgotPasswordMutation = () =>
  useMutation({ mutationFn: forgotPassword });

export const useResetPasswordMutation = () =>
  useMutation({ mutationFn: resetPassword });

export const useSignInMutation = () => useMutation({ mutationFn: signIn });

export const useVerifyUserMutation = () =>
  useMutation({ mutationFn: verifyUser });

export const useSignInGoogleMutation = () =>
  useMutation({ mutationFn: signInGoogle });

export const useSignOutMutation = () =>
  useMutation({
    mutationFn: signOut,
  });
