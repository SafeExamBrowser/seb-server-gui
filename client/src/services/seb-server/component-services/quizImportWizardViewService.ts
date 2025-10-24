import * as quizService from "@/services/seb-server/api-services/quizService";
import * as examTemplateService from "@/services/seb-server/api-services/examTemplateService";
import * as examService from "@/services/seb-server/api-services/examService";
import { Quizzes } from "@/models/seb-server/quiz";
import {
    OptionalParGeneric,
    OptionalParGetQuizzes,
} from "@/models/seb-server/optionalParamters";
import { CreateExamPar, Exam } from "@/models/seb-server/exam";
import { ExamTemplate, ExamTemplates } from "@/models/seb-server/examTemplate";

//= ============api==============
export async function getQuizzes(
    optionalParameters?: OptionalParGetQuizzes,
): Promise<Quizzes | null> {
    try {
        return await quizService.getQuizzes(optionalParameters);
    } catch {
        return null;
    }
}

export async function getExamTemplates(
    optionalParameters?: OptionalParGeneric,
): Promise<ExamTemplates | null> {
    try {
        return await examTemplateService.getExamTemplates(optionalParameters);
    } catch {
        return null;
    }
}

export async function getExamTemplate(
    id: string,
): Promise<ExamTemplate | null> {
    try {
        return await examTemplateService.getExamTemplate(id);
    } catch {
        return null;
    }
}

export async function createExam(
    createExamPar: CreateExamPar,
): Promise<Exam | null> {
    try {
        return await examService.createExam(createExamPar);
    } catch {
        return null;
    }
}
