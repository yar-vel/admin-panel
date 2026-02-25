import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setProfile } from "./main/main";

export const authMiddleware = createListenerMiddleware();

/**
 * NOTE
 *
 * I had to create this handler because Next.js has a bug that prevents using router.push
 * after a redirect to middleware and router.refresh doesn't solve this problem.
 * When a client request returns code 401, the profile is cleared.
 * After that, the hook in the panel layout calls router.push.
 * A similar redirect in the middleware works only on initial requests.
 */
authMiddleware.startListening({
  predicate: (action) =>
    typeof action.payload === "object" &&
    action.payload !== null &&
    "status" in action.payload &&
    action.payload.status === 401,
  effect: (_, api) => {
    api.dispatch(setProfile(null));
  },
});
