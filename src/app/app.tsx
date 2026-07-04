"use client"
import "./globals.css";
import 'react-phone-number-input/style.css';
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SuspenseLoader } from "@/components/SuspenseLoader";
import ReactQueryClientProvider from "./providers/query-client-provider";
import { UserStoreProvider } from "./providers/user-store-provider";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryClientProvider>
        <UserStoreProvider>
        <SessionProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="success"
              enableSystem
              disableTransitionOnChange
          >
              <Toaster position="top-right" duration={10000}/>
            <Suspense  fallback={<SuspenseLoader />}>
            {children}
            </Suspense>
          </ThemeProvider>
        </SessionProvider>
        </UserStoreProvider>
    </ReactQueryClientProvider>
  );
}
