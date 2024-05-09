import { Lexend } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CookiesProviders } from "@/lib/auth/cookiesProvider";
import { ThemeProvider } from "next-themes";

const lexend = Lexend({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={lexend.className}>
        <CookiesProviders>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Toaster />
            {children}
          </ThemeProvider>
        </CookiesProviders>
      </body>
    </html>
  );
}
