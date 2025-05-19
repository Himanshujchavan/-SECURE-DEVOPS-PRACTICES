import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

// In a real app, you would use a proper database
// This is just for demo purposes
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "admin",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "user",
  },
]

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate the credentials
          const parsedCredentials = z
            .object({
              email: z.string().email(),
              password: z.string().min(8),
            })
            .safeParse(credentials)

          if (!parsedCredentials.success) {
            return null
          }

          // Find the user
          const user = users.find((user) => user.email === parsedCredentials.data.email)

          // Check if user exists and password matches
          if (!user || user.password !== parsedCredentials.data.password) {
            return null
          }

          // Return the user without the password
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to the token if it exists in the user
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      // Add role to the session from the token
      if (token && session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
})

export { handler as GET, handler as POST }
