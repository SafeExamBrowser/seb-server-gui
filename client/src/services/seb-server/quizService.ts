import { OptionalParGetQuizzes } from "@/models/seb-server/optionalParamters";
import { Quizzes } from "@/models/seb-server/quiz";
import * as apiService from "@/services/apiService";

const baseUrl = "/quiz" as const;

export const getQuizzes = async (
    optionalParameters?: OptionalParGetQuizzes,
): Promise<Quizzes> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: { _authType: "seb", params: optionalParameters },
        })
    ).data;
