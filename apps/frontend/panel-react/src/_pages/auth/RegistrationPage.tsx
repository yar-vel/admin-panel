"use client";

import { FC } from "react";

import { SignUpForm } from "@/features/auth/SignUpForm";
import { TPage } from "../types";
import { AuthLayout } from "./AuthLayout";

export const RegistrationPage: FC<TPage> = ({ h1 }) => {
  return (
    <AuthLayout h1={h1}>
      <SignUpForm />
    </AuthLayout>
  );
};
