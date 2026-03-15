import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "TrendAI | AI-Powered Business Intelligence",
  description: "Using AI to analyze global trends and community feedback to help you build successful businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased min-h-screen flex flex-col`}>
        <div className="bg-glow" />
        <ClientProviders>
          <Navbar />
          <main className="flex-1 pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 w-full overflow-hidden">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
