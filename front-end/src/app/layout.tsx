"use client";
import { Lexend } from "next/font/google";
import "./globals.css";
import PageHeader from "./component/page-header";
import PageFooter from "./component/page-footer";
import { Toaster } from "@/components/ui/sonner";
import { SessionContext, getSessionCookie } from "@/lib/auth/session";
import { useEffect, useState } from "react";

const lexend = Lexend({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [session, setSession] = useState(getSessionCookie());
  // useEffect(
  //   () => {
  //     setSession(getSessionCookie());
  //   },
  //   []
  // );
  return (
    // <SessionContext.Provider value={session}>
      <html lang="en">
        <body className={lexend.className}>
          {/* <PageHeader /> */}
          {children}
          {/* <PageFooter /> */}
        </body>
        <Toaster />
      </html>
    // </SessionContext.Provider>
  );
}
