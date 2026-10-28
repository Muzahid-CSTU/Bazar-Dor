import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const POST = async (req: Request) => {
  try {
    const res = await handler.POST(req);
    return res;
  } catch (error) {
    console.error("SERVER ERROR DETAILS:", error);
    throw error;
  }
};

export const GET = handler.GET;