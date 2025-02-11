import { z } from "zod";

type ENV_VARIABLES_NAME = "NEXT_PUBLIC_BACKEND_URL";

// Define Zod schema for environment variables
const envSchema = z.object({
  NEXT_PUBLIC_BACKEND_URL: z
    .string()
    .url("NEXT_PUBLIC_BACKEND_URL must be a valid URL"),
});

// Validate and parse environment variables
const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Environment variables validation failed");
}

// Export validated env values
const env: Record<ENV_VARIABLES_NAME, string> = {
  NEXT_PUBLIC_BACKEND_URL: parsedEnv.data.NEXT_PUBLIC_BACKEND_URL,
};

export default env;
