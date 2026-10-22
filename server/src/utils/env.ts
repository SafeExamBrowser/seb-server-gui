import { z } from "zod";

const envSchema = z.object({
  SERVER_PORT: z.coerce.number(),
  SERVE_CLIENT: z.stringbool().default(false),
  SEB_SERVER_URL: z.url(),
  SEB_SERVER_DEFAULT_URL: z.string().default("/admin-api/v1"),
  SEB_SERVER_USERNAME: z.string(),
  SEB_SERVER_PASSWORD: z.string(),
  PROCTOR_SERVER_URL: z.url(),
  PROCTOR_SERVER_DEFAULT_URL: z.string().default("/admin-api/v1"),
  PROCTOR_SERVER_USERNAME: z.string(),
  PROCTOR_SERVER_PASSWORD: z.string(),
  AI_ASSISTANT_ENABLED: z.stringbool().default(false),
  AI_API_BASE_URL: z.url().optional(),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().optional(),
  AI_MOCK: z.stringbool().default(false),
});

export type Env = z.infer<typeof envSchema>;

export const parseEnv = () => {
  const envResult = envSchema.safeParse(process.env);

  if (!envResult.success) {
    console.error("Invalid environment variables:");
    console.error(JSON.stringify(z.treeifyError(envResult.error), null, 2));
    process.exit(1);
  }

  return envResult.data;
};
