import { z } from "zod";

const envSchema = z.object({
  PROXY_PORT: z.coerce.number(),
  PROXY_ALLOWED_ORIGIN: z.url(),
  SEB_SERVER_URL: z.url(),
  SEB_SERVER_PORT: z.coerce.number(),
  SEB_SERVER_USERNAME: z.string(),
  SEB_SERVER_PASSWORD: z.string(),
});

export const parseEnv = () => {
  const envResult = envSchema.safeParse(process.env);

  if (!envResult.success) {
    console.error("Invalid environment variables:");
    console.error(JSON.stringify(z.treeifyError(envResult.error), null, 2));
    process.exit(1);
  }

  return envResult.data;
};
