"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { SignInForm } from "@/features/auth/SignInForm";
import { TPage } from "../types";
import { AuthLayout } from "@/widgets/layout/AuthLayout";
import { ROUTES } from "@workspace/shared";

export const SignInPage: FC<TPage> = ({ h1 }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <AuthLayout h1={h1}>
      <SignInForm
        onSuccess={() =>
          router.push(
            decodeURIComponent(searchParams.get("return") || ROUTES.ui.home),
          )
        }
      />
    </AuthLayout>
  );
};
