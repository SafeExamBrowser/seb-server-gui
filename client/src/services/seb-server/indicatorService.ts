import * as apiService from "@/services/apiService";
import { Indicators } from "@/models/seb-server/indicators";

const baseUrl: string = "/indicator";

export const getIndicators = async (examId: string): Promise<Indicators> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}`,
            options: { params: { examId } },
        })
    ).data;
