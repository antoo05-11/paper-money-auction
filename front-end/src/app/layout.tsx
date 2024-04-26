"use client";
import { Lexend } from "next/font/google";
import "./globals.css";
import PageHeader from "./component/page-header";
import PageFooter from "./component/page-footer";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { AuthContext } from "@/lib/auth/AuthContext";

const lexend = Lexend({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, login, logout, setUser } = useAuth();
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <html lang="en">
        <body className={lexend.className}>
          {/* <PageHeader /> */}
          {children}
          {/* <PageFooter /> */}
        </body>
        <Toaster />
      </html>
    </AuthContext.Provider>
  );
}
