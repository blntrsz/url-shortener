import * as trpcNext from "@trpc/server/adapters/next";
import { createRouter, link } from "@backend/index";

export const appRouter = createRouter().merge("link.", link);

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});
