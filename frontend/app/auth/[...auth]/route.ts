import { toNextJsHandler } from "better-auth/nextjs";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);