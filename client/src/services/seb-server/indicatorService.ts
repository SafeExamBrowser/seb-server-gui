import { Indicators } from "@/models/seb-server/indicators";
import * as apiService from "@/services/apiService";

const baseUrl: string = "/indicator";

export const getIndicators = async (examId: string): Promise<Indicators> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}`,
            options: { _authType: "seb", params: { examId } },
        })
    ).data;
