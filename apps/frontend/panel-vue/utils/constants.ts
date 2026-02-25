import { buildRoutes } from '../../../../shared/src/libs'

export const ROUTES = {
  ui: buildRoutes(UI_ROUTES),
  api: buildRoutes(API_ROUTES),
}
