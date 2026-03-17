import * as apiService from "@/services/apiService";
import { Quizzes } from "@/models/seb-server/quiz";
import { OptionalParGetQuizzes } from "@/models/seb-server/optionalParamters";

const baseUrl = "/quiz" as const;

export const getQuizzes = async (
    optionalParameters?: OptionalParGetQuizzes,
): Promise<Quizzes> =>
    (
        await apiService.getRequest({
            url: baseUrl,
            options: { params: optionalParameters },
        })
    ).data;
