import { z } from "zod";

import {
    zPageQuizData,
    zQuizData,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";

export const quizSchema = zQuizData.pick({
    quiz_id: true,
    lms_setup_id: true,
    quiz_name: true,
    quiz_start_time: true,
    quiz_end_time: true,
    quiz_start_url: true,
});

export type Quiz = z.infer<typeof quizSchema>;

export const quizPageSchema = zPageQuizData
    .pick({
        number_of_pages: true,
        page_number: true,
        page_size: true,
        complete: true,
    })
    .extend({
        content: z.array(quizSchema).optional(),
    });

export type QuizPage = z.infer<typeof quizPageSchema>;
