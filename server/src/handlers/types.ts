import { z } from "zod";

export const tokenResultSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export type TokenResult = z.infer<typeof tokenResultSchema>;

export type FetchTokensResult =
  | {
      status: "success";
      data: { sebServer: TokenResult; proctorServer: TokenResult };
    }
  | { status: "auth_error"; errors: string[] };
