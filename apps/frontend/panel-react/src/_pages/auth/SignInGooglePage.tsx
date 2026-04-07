"use client";

import { FC } from "react";

import { TPage } from "../types";
import { AuthLayout } from "@/widgets/layout/AuthLayout";
import { SignInGoogleForm } from "@/features/auth/SignInGoogleForm";

export const SignInGooglePage: FC<TPage> = ({ h1 }) => {
  return (
    <AuthLayout h1={h1}>
      <SignInGoogleForm />
    </AuthLayout>
  );
};
