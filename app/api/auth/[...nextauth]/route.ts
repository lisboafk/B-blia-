import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const ADMIN_EMAIL = 'lisboafk@gmail.com'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (session.user) {
        (session.user as { isAdmin?: boolean }).isAdmin = session.user.email === ADMIN_EMAIL
      }
      return session
    },
  },
  pages: {
    signIn: '/admin',
  },
})

export { handler as GET, handler as POST }
