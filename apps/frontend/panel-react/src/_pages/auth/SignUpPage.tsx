"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

import { SignUpForm } from "@/features/auth/SignUpForm";
import { TPage } from "../types";
import { AuthLayout } from "@/widgets/layout/AuthLayout";
import { ROUTES } from "@workspace/shared";

export const SignUpPage: FC<TPage> = ({ h1 }) => {
  const router = useRouter();

  return (
    <AuthLayout h1={h1}>
      <SignUpForm onSuccess={() => router.push(ROUTES.ui.signIn)} />
    </AuthLayout>
  );
};
