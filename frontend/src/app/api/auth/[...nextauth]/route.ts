import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          await fetch(`${apiUrl}/api/users/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: user.email, 
              name: user.name || 'User',
              image_url: user.image 
            })
          });
        } catch (error) {
          console.error('Failed to sync user to database', error);
        }
      }
      return true;
    }
  }
})

export { handler as GET, handler as POST }
