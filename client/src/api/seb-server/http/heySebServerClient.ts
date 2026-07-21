import axios from "axios";

import {
    createClient,
    createConfig,
} from "@/api/seb-server/generated/hey-api/client";
import { configureApiAxios } from "@/services/http/configureApiAxios.ts";

const PUBLIC_PATHS = new Set(["/admin-api/v1/register"]);

const requestPath = (url?: string) => {
    if (!url) {
        return undefined;
    }

    return url.split("?")[0]?.replace(/^\/api/, "");
};

const axiosInstance = configureApiAxios(
    axios.create({
        baseURL: "/api",
    }),
    {
        defaultAuthType: (config) =>
            PUBLIC_PATHS.has(requestPath(config.url) ?? "") ? undefined : "seb",
    },
);

export const heySebServerClient = createClient(
    createConfig({
        axios: axiosInstance,
        throwOnError: true,
    }),
);
