import type { Metadata } from "next";
import "./globals.css";

import Nav from "@/components/navigation/nav";
import { ThemeProvider } from "@/components/providers/theme-provider";
import {  Roboto } from "next/font/google";
import Toaster from "@/components/ui/toaster";

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Excellence",
  description: "Grab the best study utils  ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        
        <div className="px-6 md:px-12 max-w-8xl m-auto">
          <ThemeProvider
            attribute="class"
            defaultTheme="light" 
            enableSystem
            disableTransitionOnChange
          >
            <Nav />
            <Toaster />
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
