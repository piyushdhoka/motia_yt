import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

// Debug: Log environment status
if (process.env.NODE_ENV === "production") {
  console.log("🔍 Production environment check:");
  console.log("- NEXTAUTH_SECRET exists:", !!process.env.NEXTAUTH_SECRET);
  console.log("- NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "NOT SET");
  console.log("- VERCEL_URL:", process.env.VERCEL_URL || "NOT SET");
  console.log("- GOOGLE_CLIENT_ID exists:", !!process.env.GOOGLE_CLIENT_ID);
  console.log("- GOOGLE_CLIENT_SECRET exists:", !!process.env.GOOGLE_CLIENT_SECRET);
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
