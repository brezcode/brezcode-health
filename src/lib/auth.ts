import { NextAuthConfig } from 'next-auth'
import SendGrid from 'next-auth/providers/sendgrid'

export const authConfig: NextAuthConfig = {
  providers: [
    SendGrid({
      apiKey: process.env.SENDGRID_API_KEY!,
      from: process.env.FROM_EMAIL!,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async session({ session, user, token }) {
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}

export default authConfig