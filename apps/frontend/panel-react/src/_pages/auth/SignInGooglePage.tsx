"use client";

import { FC } from "react";
import dynamic from "next/dynamic";

import { TPage } from "../types";
import { AuthLayout } from "@/widgets/layout/AuthLayout";

const DynamicSignInGoogleForm = dynamic(
  () =>
    import("@/features/auth/SignInGoogleForm").then((m) => ({
      default: m.SignInGoogleForm,
    })),
  { ssr: false },
);

export const SignInGooglePage: FC<TPage> = ({ h1 }) => {
  return (
    <AuthLayout h1={h1}>
      <DynamicSignInGoogleForm />
    </AuthLayout>
  );
};
