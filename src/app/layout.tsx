import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AWSH Dashboard - Stadtreinigung Weber GmbH",
  description: "Internes Kundenservice-Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.className} bg-page text-muted`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
