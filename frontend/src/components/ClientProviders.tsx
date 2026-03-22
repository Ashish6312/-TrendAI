"use client";

import AuthProvider from "./AuthProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { AnimationProvider } from "@/context/AnimationContext";
import { ThemeProvider } from "next-themes";

import { GlobalErrorBoundary, GlobalOfflineDetection } from "./GlobalFallbacks";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GlobalErrorBoundary>
        <AuthProvider>
          <LanguageProvider>
            <SubscriptionProvider>
              <AnimationProvider>
                <NotificationProvider>
                              <GlobalOfflineDetection />
                  {children}
                </NotificationProvider>
              </AnimationProvider>
            </SubscriptionProvider>
          </LanguageProvider>
        </AuthProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
}
