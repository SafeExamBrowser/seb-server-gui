import { getQuizzes as getQuizzesSdk } from "@/api/seb-server/generated/hey-api/sdk.gen.ts";
import type { GetQuizzesData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import { heySebServerClient as client } from "@/api/seb-server/http/heySebServerClient.ts";
import { type QuizPage, quizPageSchema } from "@/models/quiz.ts";
import { decodeWire } from "@/services/errors/wireCodec.ts";

export const getQuizzes = (
    query?: GetQuizzesData["query"],
): Promise<QuizPage> =>
    getQuizzesSdk({ client, query }).then(({ data }) =>
        decodeWire(quizPageSchema, data),
    );
