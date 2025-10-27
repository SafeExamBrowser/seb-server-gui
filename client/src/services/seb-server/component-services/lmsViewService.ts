import * as examService from "@/services/seb-server/api-services/examService";
import { OptionalParGetExams } from "@/models/seb-server/optionalParamters";
import { Exams } from "@/models/seb-server/exam";

export async function getLmsList(
    optionalParGetExams?: OptionalParGetExams,
): Promise<Exams | null> {
    try {
        return await examService.getExams(optionalParGetExams);
    } catch {
        return null;
    }
}
