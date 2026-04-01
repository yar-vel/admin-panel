"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";
import { TPage } from "../types";
import { AuthLayout } from "@/widgets/layout/AuthLayout";
import { ROUTES } from "@workspace/shared";

export const ForgotPasswordPage: FC<TPage> = ({ h1 }) => {
  const router = useRouter();

  return (
    <AuthLayout h1={h1}>
      <ForgotPasswordForm onSuccess={() => router.push(ROUTES.ui.signIn)} />
    </AuthLayout>
  );
};
