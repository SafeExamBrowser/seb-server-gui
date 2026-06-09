import * as apiService from "@/services/apiService";
import { SebClientConnection } from "@/models/seb-server/clientConnectionList";

const baseUrl = "/seb-client-connection" as const;
const chunkSize = 200;

export const getClientConnectionList = async (
    modelIds: number[],
): Promise<SebClientConnection[]> => {
    // Note: if we have more then 200 model ids to send, we chunk up the request into several calls
    if (modelIds.length > chunkSize) {
        let result: SebClientConnection[] = [];
        for (let i = 0; i < modelIds.length; i += chunkSize) {
            const chunk = modelIds.slice(i, i + chunkSize);
            const res = await apiService.getRequest({
                url: `${baseUrl}/list`,
                options: {
                    _authType: "seb",
                    params: { modelIds: chunk.join(",") },
                },
            });

            result = result.concat(res.data);
        }

        return result;
    }

    return (
        await apiService.getRequest({
            url: `${baseUrl}/list`,
            options: {
                _authType: "seb",
                params: { modelIds: modelIds.join(",") },
            },
        })
    ).data;
};
