import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "TrendAI | Advanced Business Intelligence",
  description: "Leverage real-time market sentiment from Google and Reddit to identify high-profit business opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <div className="bg-glow" />
        <ClientProviders>
          <Navbar />
          <main className="flex-1 pt-24 pb-20">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
