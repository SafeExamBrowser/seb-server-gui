import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";

export async function getQuizzes(
    optionalParameters?: OptionalParGetQuizzes,
): Promise<Quizzes | any> {
    const url: string = "/quiz";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}
