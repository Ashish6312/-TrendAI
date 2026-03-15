"use client";

import AuthProvider from "./AuthProvider";
import LoginTracker from "./LoginTracker";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SubscriptionProvider>
          <NotificationProvider>
            <LoginTracker />
            {children}
          </NotificationProvider>
        </SubscriptionProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
