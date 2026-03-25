import {
  buildRoutes,
  UI_ROUTES,
  API_ROUTES,
} from "@workspace/shared/dist/libs";

export const ROUTES = {
  ui: buildRoutes(UI_ROUTES),
  api: buildRoutes(API_ROUTES),
};
