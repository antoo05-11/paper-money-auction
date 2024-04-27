import { CookiesProvider } from "next-client-cookies/server";
import { AuthProvider } from "@/lib/auth/AuthContext";

export const ClientCookiesProvider: typeof CookiesProvider = (props) => (
  <CookiesProvider {...props} />
);

export async function CookiesProviders({ children }: React.PropsWithChildren) {
  return (
    <ClientCookiesProvider>
      <AuthProvider>{children}</AuthProvider>
    </ClientCookiesProvider>
  );
}