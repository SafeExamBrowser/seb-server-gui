import * as apiService from "@/services/apiService";
import { SebClientConnection } from "@/models/seb-server/clientConnectionList";

const baseUrl = "/seb-client-connection" as const;

// TODO @andreas: fix this
// Note: This functions correctly but gives a problem when the modelIds array is too big for URL
// Check that if modelIds is too big and fetch it in chunks if so. This would be completely transparent and do not change signature of this call
export const getClientConnectionList = async (
    modelIds: number[],
): Promise<SebClientConnection[]> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/list`,
            options: {
                params: { modelIds: modelIds.join(",") },
            },
        })
    ).data;
