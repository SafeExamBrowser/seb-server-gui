import * as newApiService from "@/services/newApiService";
import { Indicators } from "@/models/seb-server/indicators";

const baseUrl: string = "/indicator";

export const getIndicators = async (examId: string): Promise<Indicators> =>
    (await newApiService.getRequest(`${baseUrl}`, { params: { examId } })).data;
