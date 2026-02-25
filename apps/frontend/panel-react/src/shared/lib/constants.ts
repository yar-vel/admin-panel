import { API_ROUTES, buildRoutes, UI_ROUTES } from "@ap/shared/dist/libs";

export const ROUTES = {
  ui: buildRoutes(UI_ROUTES),
  api: buildRoutes(API_ROUTES),
};
