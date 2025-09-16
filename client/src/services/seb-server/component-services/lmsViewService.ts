import * as examService from "@/services/seb-server/api-services/examService";

export async function getLmsList(
    optionalParGetExams?: OptionalParGetExams,
): Promise<Exams | null> {
    try {
        return await examService.getExams(optionalParGetExams);
    } catch {
        return null;
    }
}
