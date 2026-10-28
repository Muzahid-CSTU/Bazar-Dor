import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("Bazar-Dor");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: { 
    enabled: true, 
  },
  logger: {
    level: "debug", // এতে ইন্টারনাল সব এরর টার্মিনালে পরিষ্কার দেখা যাবে
  },
});