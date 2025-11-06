import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

// Log environment variables to debug (remove in production)
if (!process.env.NEXTAUTH_SECRET) {
  console.error("❌ NEXTAUTH_SECRET is missing!");
}
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  console.log("Using VERCEL_URL:", process.env.VERCEL_URL);
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
