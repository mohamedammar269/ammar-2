// import GoogleProvider from 'next-auth/providers/google'
// import GithubProvider from 'next-auth/providers/github'
// import { PrismaAdapter } from '@auth/prisma-adapter'
// import { prisma } from '@/lib/prisma'

// export const authOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     GithubProvider({
//       clientId: process.env.GITHUB_CLIENT_ID,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user }) {
//       return user.email === process.env.ADMIN_EMAIL
//     },
//     async session({ session, user }) {
//       if (session.user) {
//         session.user.id = user.id
//         session.user.role = user.role
//       }
//       return session
//     },
//   },
//   pages: {
//     signIn: '/admin/login',
//     error: '/admin/login',
//   },
// }

import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis')
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })
        if (!user || !user.hashPassword) {
          throw new Error('Email ou mot de passe incorrect')
        }
        const valid = await bcrypt.compare(
          credentials.password,
          user.hashPassword,
        )
        if (!valid) throw new Error('Email ou mot de passe incorrect')
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      if (account?.provider === 'google' || account?.provider === 'github') {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
    async signIn({ user }) {
      // Seul l'admin peut accéder à /admin
      // Tout le monde peut se connecter, le rôle est vérifié dans le layout
      return true
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
}
