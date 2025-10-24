import * as apiService from "@/services/apiService";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { Quizzes } from "@/models/seb-server/quiz";
import { OptionalParGetQuizzes } from "@/models/seb-server/optionalParamters";

export async function getQuizzes(
    optionalParameters?: OptionalParGetQuizzes,
): Promise<Quizzes> {
    const url: string = "/quiz";
    return (
        await apiService.api.get(url, {
            headers: apiService.getHeaders(StorageItemEnum.ACCESS_TOKEN),
            params: { optionalParameters },
        })
    ).data;
}
