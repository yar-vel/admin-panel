import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { FC, PropsWithChildren } from "react";
import { headers } from "next/headers";

import { StoreProvider } from "./store/StoreProvider";
import { I18nClientProvider } from "./I18nClientProvider";

const Layout: FC<PropsWithChildren> = async ({ children }) => {
  const headersList = await headers();
  const profileJson = headersList.get("store-profile");

  return (
    <html lang="en">
      <body>
        <I18nClientProvider>
          <StoreProvider profileJson={profileJson}>
            <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
          </StoreProvider>
        </I18nClientProvider>
      </body>
    </html>
  );
};
export default Layout;
