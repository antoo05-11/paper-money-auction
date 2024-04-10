"use client";
import { Lexend } from "next/font/google";
import "./globals.css";
import PageHeader from "./component/page-header";
import PageFooter from "./component/page-footer";
import { Toaster } from "@/components/ui/sonner";

const lexend = Lexend({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lexend.className}>
        {/* <PageHeader /> */}
        {children}
        {/* <PageFooter /> */}
      </body>
      <Toaster />
    </html>
  );
}
