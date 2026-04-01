import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { FC } from "react";

import { I18nClientProvider } from "./providers/I18nClientProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { TanstackQueryProvider } from "./providers/TanstackQueryProvider";

const Layout: FC<LayoutProps<"/">> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <I18nClientProvider>
          <TanstackQueryProvider>
            <AuthProvider>
              <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
            </AuthProvider>
          </TanstackQueryProvider>
        </I18nClientProvider>
      </body>
    </html>
  );
};
export default Layout;
