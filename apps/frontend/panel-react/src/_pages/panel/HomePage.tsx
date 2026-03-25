"use client";

import { FC } from "react";

import { PanelLayout } from "@/widgets/layout/PanelLayout";
import { TPage } from "../types";

export const HomePage: FC<TPage> = ({ h1 }) => {
  return <PanelLayout h1={h1}></PanelLayout>;
};
