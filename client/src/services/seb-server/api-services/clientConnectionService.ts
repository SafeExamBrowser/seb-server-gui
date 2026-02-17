import * as newApiService from "@/services/newApiService";
import { SebClientConnection } from "@/models/seb-server/clientConnectionList";

const baseUrl = "/seb-client-connection" as const;

// TODO @andreas: please test this
export const getClientConnectionList = async (
    modelIds: number[],
): Promise<SebClientConnection[]> =>
    (
        await newApiService.getRequest(`${baseUrl}/list`, {
            params: { modelIds: modelIds.join(",") },
        })
    ).data;
