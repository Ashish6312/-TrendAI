import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// Helper function to get client IP and device info
async function getClientInfo(req: any) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(",")[0] : req.connection?.remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  
  // Parse user agent for device info
  const deviceInfo = {
    browser: "unknown",
    os: "unknown",
    device: "unknown"
  };
  
  if (userAgent !== "unknown") {
    // Simple user agent parsing
    if (userAgent.includes("Chrome")) deviceInfo.browser = "Chrome";
    else if (userAgent.includes("Firefox")) deviceInfo.browser = "Firefox";
    else if (userAgent.includes("Safari")) deviceInfo.browser = "Safari";
    else if (userAgent.includes("Edge")) deviceInfo.browser = "Edge";
    
    if (userAgent.includes("Windows")) deviceInfo.os = "Windows";
    else if (userAgent.includes("Mac")) deviceInfo.os = "macOS";
    else if (userAgent.includes("Linux")) deviceInfo.os = "Linux";
    else if (userAgent.includes("Android")) deviceInfo.os = "Android";
    else if (userAgent.includes("iOS")) deviceInfo.os = "iOS";
    
    if (userAgent.includes("Mobile")) deviceInfo.device = "Mobile";
    else if (userAgent.includes("Tablet")) deviceInfo.device = "Tablet";
    else deviceInfo.device = "Desktop";
  }
  
  // Get location info from IP (simple approach)
  let locationInfo = { country: "unknown", city: "unknown", region: "unknown", timezone: "unknown" };
  try {
    if (ip !== "unknown" && !ip.includes("127.0.0.1") && !ip.includes("::1")) {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      if (response.ok) {
        const data = await response.json();
        locationInfo = {
          country: data.country_name || "unknown",
          city: data.city || "unknown",
          region: data.region || "unknown",
          timezone: data.timezone || "unknown"
        };
      }
    }
  } catch (error) {
    console.log("Failed to get location info:", error);
  }
  
  return { ip, userAgent, deviceInfo, locationInfo };
}

const handler = NextAuth({
  debug: true, // Enable debug mode
  pages: {
    signIn: '/auth',
    error: '/auth', // Redirect errors back to auth page
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true },
        isSignUp: { label: "Is Sign Up", type: "text", optional: true }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        console.log('Attempting authentication with:', credentials.email);
        
        try {
          if (credentials.isSignUp === "true") {
            // Sign up flow
            if (!credentials.name) {
              throw new Error("Name is required for sign up");
            }

            console.log('Attempting signup for:', credentials.email);
            const signUpResponse = await fetch(`${apiUrl}/api/auth/signup`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                name: credentials.name
              })
            });

            console.log('Signup response status:', signUpResponse.status);
            
            if (!signUpResponse.ok) {
              const error = await signUpResponse.json();
              console.error('Signup error:', error);
              throw new Error(error.detail || "Sign up failed");
            }

            const user = await signUpResponse.json();
            console.log('Signup successful:', user.email);
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              image: user.image_url
            };
          } else {
            // Sign in flow
            console.log('Attempting signin for:', credentials.email);
            const signInResponse = await fetch(`${apiUrl}/api/auth/signin`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
              })
            });

            console.log('Signin response status:', signInResponse.status);

            if (!signInResponse.ok) {
              const error = await signInResponse.json();
              console.error('Signin error:', error);
              throw new Error(error.detail || "Invalid credentials");
            }

            const user = await signInResponse.json();
            console.log('Signin successful:', user.email);
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              image: user.image_url
            };
          }
        } catch (error: any) {
          console.error("Auth error:", error.message);
          throw new Error(error.message || "Authentication failed");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (user.email) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          
          // Sync user to database
          const syncResponse = await fetch(`${apiUrl}/api/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: user.email, 
              name: user.name || 'User',
              image_url: user.image 
            })
          });
          
          if (syncResponse.ok) {
            console.log('User synced successfully');
          } else {
            console.error('Failed to sync user');
          }
          
        } catch (error) {
          console.error('Failed to sync user to database', error);
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      // Save session info when user first signs in
      if (account && user?.email) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          
          // Create login session record
          const sessionData = {
            user_email: user.email,
            session_token: token.jti || `session_${Date.now()}`,
            provider: account.provider || "google",
            ip_address: "server-side", // Will be updated from client
            user_agent: "server-side", // Will be updated from client
            device_info: {
              provider: account.provider,
              type: account.type,
              access_token_expires: account.expires_at
            },
            location_info: { source: "server" },
            login_method: "oauth"
          };
          
          await fetch(`${apiUrl}/api/users/login-session`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
          });
          
          // Store session info in token
          token.sessionId = sessionData.session_token;
          token.loginTime = Date.now();
          
        } catch (error) {
          console.error('Failed to create login session', error);
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Add session info to the session object
      if (token.sessionId) {
        (session as any).sessionId = token.sessionId;
        (session as any).loginTime = token.loginTime;
      }
      return session;
    }
  },
  
  events: {
    async signOut({ token, session }) {
      // End session when user signs out
      if (token?.sessionId) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          
          // Find and end the session
          const response = await fetch(`${apiUrl}/api/users/${session?.user?.email}/sessions`);
          if (response.ok) {
            const sessions = await response.json();
            const activeSession = sessions.find((s: any) => s.session_token === token.sessionId && s.is_active);
            
            if (activeSession) {
              await fetch(`${apiUrl}/api/users/session/${activeSession.id}/end`, {
                method: 'PUT'
              });
            }
          }
        } catch (error) {
          console.error('Failed to end session', error);
        }
      }
    }
  }
})

export { handler as GET, handler as POST }
