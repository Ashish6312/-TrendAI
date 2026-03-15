"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

interface LoginTrackingData {
  user_email: string;
  session_token: string;
  provider: string;
  ip_address?: string;
  user_agent: string;
  device_info: {
    browser: string;
    os: string;
    device: string;
    screen_resolution: string;
    timezone: string;
    language: string;
  };
  location_info?: {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
  };
  login_method: string;
}

// Helper function to detect browser
function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browser = "Unknown";
  
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
  else if (userAgent.includes("Edg")) browser = "Edge";
  else if (userAgent.includes("Opera")) browser = "Opera";
  
  return browser;
}

// Helper function to detect OS
function getOSInfo() {
  const userAgent = navigator.userAgent;
  let os = "Unknown";
  
  if (userAgent.includes("Windows NT")) os = "Windows";
  else if (userAgent.includes("Mac OS X")) os = "macOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";
  
  return os;
}

// Helper function to detect device type
function getDeviceType() {
  const userAgent = navigator.userAgent;
  
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return "Tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return "Mobile";
  return "Desktop";
}

// Helper function to get location from IP
async function getLocationInfo(): Promise<any> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const services = [
    `${apiUrl}/api/utils/location`,
    'https://ipwho.is',
    'https://ipapi.co/json/',
    'https://ipinfo.io/json'
  ];

  for (const service of services) {
    try {
      // Use AbortController for true timeout support in fetch
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(service, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        
        // Normalize backend response if it's our API
        if (service.includes('/api/utils/location')) {
           return data;
        }

        // Normalize different service responses
        if (service.includes('ipwho.is')) {
          return {
            country: data.country,
            city: data.city,
            region: data.region,
            timezone: data.timezone?.id,
            ip: data.ip
          };
        } else if (service.includes('ipapi.co')) {
          return {
            country: data.country_name,
            city: data.city,
            region: data.region,
            timezone: data.timezone,
            ip: data.ip
          };
        } else if (service.includes('ipinfo.io')) {
          return {
            country: data.country,
            city: data.city,
            region: data.region,
            timezone: data.timezone,
            ip: data.ip
          };
        }
      }
    } catch (error) {
       // Silent fail to next service
    }
  }
  return null;
}

export function useLoginTracking() {
  const { data: session, status } = useSession();
  const hasTracked = useRef(false);

  useEffect(() => {
    const trackLogin = async () => {
      // Only track once per session and when user is authenticated
      if (status !== "authenticated" || !session?.user?.email || hasTracked.current) {
        return;
      }

      hasTracked.current = true;

      try {
        // Get location info
        const locationInfo = await getLocationInfo();
        
        // Prepare tracking data
        const trackingData: LoginTrackingData = {
          user_email: session.user.email,
          session_token: (session as any).sessionId || `client_${Date.now()}`,
          provider: "google", // Default to google since that's what we're using
          ip_address: locationInfo?.ip,
          user_agent: navigator.userAgent,
          device_info: {
            browser: getBrowserInfo(),
            os: getOSInfo(),
            device: getDeviceType(),
            screen_resolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language
          },
          location_info: locationInfo ? {
            country: locationInfo.country,
            city: locationInfo.city,
            region: locationInfo.region,
            timezone: locationInfo.timezone
          } : undefined,
          login_method: "oauth"
        };

        // Send tracking data to backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/users/login-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trackingData)
        });

        if (response.ok) {
          console.log('Login tracked successfully');
        } else {
          console.error('Failed to track login');
        }

      } catch (error) {
        console.error('Error tracking login:', error);
      }
    };

    trackLogin();
  }, [session, status]);

  return { session, status };
}