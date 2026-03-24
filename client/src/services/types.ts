import { AxiosRequestConfig } from "axios";
import { z } from "zod";

declare module "axios" {
    interface AxiosRequestConfig {
        _authType?: AuthType;
    }
}

export type AuthType = "seb" | "sps" | "none";

export type RequestWithDataParams<T> = {
    url: string;
    data?: T;
    options?: AxiosRequestConfig;
};

const tokenResponseSchema = z.object({
    access_token: z.string(),
    refresh_token: z.string(),
    expires_in: z.number().transform((seconds) => seconds * 1000), // the server returns seconds, but we want milliseconds
});

export const authDataSchema = z.object({
    proctorServer: tokenResponseSchema,
    sebServer: tokenResponseSchema,
});

export type AuthData = z.infer<typeof authDataSchema>;
