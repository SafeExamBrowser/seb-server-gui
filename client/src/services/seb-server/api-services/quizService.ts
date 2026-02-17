import * as newApiService from "@/services/newApiService";
import { Quizzes } from "@/models/seb-server/quiz";
import { OptionalParGetQuizzes } from "@/models/seb-server/optionalParamters";

const baseUrl = "/quiz" as const;

export const getQuizzes = async (
    optionalParameters?: OptionalParGetQuizzes,
): Promise<Quizzes> =>
    (await newApiService.getRequest(baseUrl, { params: optionalParameters }))
        .data;
