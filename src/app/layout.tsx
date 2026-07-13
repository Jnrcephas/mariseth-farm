import type { Metadata } from "next";
import "./globals.css";
import 'react-phone-number-input/style.css';
import "leaflet/dist/leaflet.css"
import App from "./app";
import { Inter } from "next/font/google";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mariseth",
  description: "Mariseth is a comprehensive farm management system designed to streamline agricultural operations, enhance productivity, and support farmers in managing their resources effectively.",
  icons: {
    icon: "/images/meriseth-logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true}
        className={`${inter.variable} antialiased`}
      >
        <App>
          {children}
        </App>
      </body>
    </html>
  );
}
