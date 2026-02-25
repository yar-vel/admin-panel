"use client";

import { FC } from "react";

import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";
import { TPage } from "../types";
import { AuthLayout } from "./AuthLayout";

export const ForgotPasswordPage: FC<TPage> = ({ h1 }) => {
  return (
    <AuthLayout h1={h1}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};
