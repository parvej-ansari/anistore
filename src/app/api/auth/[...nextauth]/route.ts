import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await dbConnect();
        let user = await User.findOne({ email: credentials.email });
        
        // Auto-seed if user not found (ensures admin exists)
        if (!user) {
          const { seedDatabase } = await import('@/lib/seed');
          await seedDatabase();
          user = await User.findOne({ email: credentials.email });
        }
        
        if (!user || !user.password) return null;
        
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).isAdmin = token.role === 'admin' || token.role === 'superadmin';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
