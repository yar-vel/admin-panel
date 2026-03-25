import { create } from "zustand";

import { IAlert } from "@workspace/shared/dist/types";

interface IAlertsStore {
  alerts: IAlert[];
  addAlert: (alert: Omit<IAlert, "id">) => void;
  removeAlert: (id: IAlert["id"]) => void;
}

export const useAlertsStore = create<IAlertsStore>((set) => ({
  alerts: [],
  addAlert: (alert) =>
    set((s) => ({
      alerts: [...s.alerts, { ...alert, id: crypto.randomUUID() }],
    })),
  removeAlert: (id) =>
    set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
}));
