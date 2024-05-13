import { Lexend } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CookiesProviders } from "@/lib/auth/cookiesProvider";
import { ThemeProvider } from "next-themes";
import { Metadata } from "next";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Vua tiền tệ",
    default: "Vua tiền tệ",
  },
  description: "King of money.",
  metadataBase: new URL("https://paper-money-auction.vercel.app/"),
};

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
