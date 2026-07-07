import { EntityKey } from "@/api/seb-server/generated/hey-api";
import { AxiosRequestConfig } from "axios";
import { z } from "zod";

declare module "axios" {
    interface AxiosRequestConfig {
        _authType?: "seb" | "sps";
        /**
         * When true, the response interceptor skips its automatic transport-error
         * toast for this request. Use for background calls (e.g. token refresh)
         * that surface their own failure.
         */
        _skipErrorToast?: boolean;
    }
}

export type ApiRequest<T> = {
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

export type SortOrder = {
    key: string;
    order: "asc" | "desc";
};

export type BasicListParams = {
    pageNumber?: number;
    pageSize?: number;
    sortOrder?: SortOrder;
};

export type AutoLoginForward = {
    entityKey: EntityKey;
    actionName: string;
};

export type AutoLoginData = {
    username: string;
    userUUID: string;
    redirect: AutoLoginForward;
};
