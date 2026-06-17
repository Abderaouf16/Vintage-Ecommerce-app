import type { Metadata } from "next";
import "./globals.css";

import Nav from "@/components/navigation/nav";
import Footer from '@/components/navigation/footer'
import { ThemeProvider } from "@/components/providers/theme-provider";
import {  Roboto } from "next/font/google";
import Toaster from "@/components/ui/toaster";

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Vintage Supply DZ ",
  description: " Vintag Supply DZ est une boutique en ligne spécialisée dans la vente de produits vintage et rétro. Découvrez notre collection unique de vêtements, accessoires et objets de décoration pour un style authentique et intemporel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* FULL PAGE CONTAINER */}
          <div className="min-h-screen flex flex-col px-6 md:px-12 max-w-8xl m-auto">

            <Nav />

            <Toaster />

            {/* MAIN CONTENT PUSHES FOOTER DOWN */}
            <main className="flex-1">
              {children}
            </main>

            <Footer />

          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
