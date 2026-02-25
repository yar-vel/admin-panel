import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TLangList } from "@ap/shared/dist/locales";
import { IAlert, IUser } from "@ap/shared/dist/types";
import i18n from "@/shared/config/i18n/i18n";

export const mainSliceName = "main";

const initialState = {
  language: "en" as TLangList,
  alerts: [] as IAlert[],
  alertCounter: 0,
  profile: null as IUser | null,
};

export const mainSlice = createSlice({
  name: mainSliceName,
  initialState: initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<TLangList>) => {
      i18n.changeLanguage(action.payload);
      state.language = action.payload;
    },

    addAlert: (state, action: PayloadAction<Omit<IAlert, "id">>) => {
      state.alerts.push({ ...action.payload, id: state.alertCounter++ });
    },

    deleteAlert: (
      state,
      action: PayloadAction<{ id: number; delay?: boolean }>,
    ) => {
      if (action.payload.delay) {
        state.alerts = state.alerts.map((alert) => {
          if (alert.id === action.payload.id) {
            alert.deleted = true;
          }

          return alert;
        });
      } else {
        state.alerts = state.alerts.filter(
          (alert) => alert.id !== action.payload.id,
        );
      }
    },

    setProfile: (state, action: PayloadAction<IUser | null>) => {
      state.profile = action.payload;

      if (!action.payload) {
        state.alerts = [];
      }
    },
  },
});

export const { setProfile, setLanguage, addAlert, deleteAlert } =
  mainSlice.actions;
export default mainSlice.reducer;
