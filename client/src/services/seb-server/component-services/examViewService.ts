import * as examService from "@/services/seb-server/api-services/examService";
import * as examTemplateService from "@/services/seb-server/examTemplateService";
import * as connectionConfigurationService from "@/services/seb-server/connectionConfigurationService.ts";

import * as monitoringService from "@/services/seb-server/api-services/monitoringService";
import * as timeUtils from "@/utils/timeUtils";
import { ScreenProctoringSettings } from "@/models/seb-server/screenProctoring";
import { OptionalParGetExams } from "@/models/seb-server/optionalParamters";
import { Exam, Exams } from "@/models/seb-server/exam";
import { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration";
import {
    AppSignatureKey,
    GrantedAppSignatureKey,
} from "@/models/seb-server/appSignatureKey";
import { ExamTemplate } from "@/models/seb-server/examTemplate";

//= ============api==============

// good
export async function getExam(id: string): Promise<Exam | null> {
    try {
        return await examService.getExam(id);
    } catch {
        return null;
    }
}

// good

export async function getExamAppSignatureKeys(
    id: string,
): Promise<AppSignatureKey[] | null> {
    try {
        return await examService.getExamAppSignatureKeys(id);
    } catch {
        return null;
    }
}

// good
export async function getGrantedExamAppSignatureKeys(
    parentId: string,
): Promise<GrantedAppSignatureKey[] | null> {
    try {
        return await examService.getGrantedExamAppSignatureKeys(parentId);
    } catch {
        return null;
    }
}

// good
export async function removeGrantExamAppSignatureKeys(
    parentId: string,
    id: string,
): Promise<AppSignatureKey[] | null> {
    try {
        return await examService.removeGrantExamAppSignatureKeys(parentId, id);
    } catch {
        return null;
    }
}

// good
export async function grantExamAppSignatureKeys(
    tagName: string,
    parentId: string,
    id: string,
): Promise<GrantedAppSignatureKey | null> {
    try {
        return await examService.grantExamAppSignatureKeys(
            tagName,
            parentId,
            id,
        );
    } catch {
        return null;
    }
}

// good
export async function hasSEBLock(id: string): Promise<boolean> {
    try {
        return await examService.checkSEBLock(id);
    } catch {
        return false;
    }
}

// good
export async function getExamTemplate(
    id: string,
): Promise<ExamTemplate | null> {
    try {
        return await examTemplateService.getExamTemplate(id);
    } catch {
        return null;
    }
}

// good
export async function deleteExam(id: string): Promise<undefined | null> {
    try {
        await examService.deleteExam(id);
        return undefined;
    } catch {
        return null;
    }
}

// good
export async function getExams(
    optionalParGetExams?: OptionalParGetExams,
): Promise<Exams | null> {
    try {
        return await examService.getExams(optionalParGetExams);
    } catch {
        return null;
    }
}

// good
export async function updateExam(exam: Exam): Promise<Exam | null> {
    try {
        return await examService.updateExam(exam);
    } catch {
        return null;
    }
}

// good
export async function getConnectionConfigurationsActive(): Promise<ConnectionConfigurations | null> {
    try {
        return await connectionConfigurationService.getConnectionConfigurationsActive();
    } catch {
        return null;
    }
}

//good
export async function downloadExamConfig(
    examId: string,
    connectionId: string,
): Promise<Blob | null> {
    try {
        const blob = await connectionConfigurationService.downloadExamConfig(
            examId,
            connectionId,
        );
        return blob as Blob;
    } catch {
        return null;
    }
}
//good
export async function archiveExam(id: string): Promise<Exam | null> {
    try {
        return await examService.archiveExam(id);
    } catch {
        return null;
    }
}

//good
export async function applyTestRun(id: string): Promise<Exam | null> {
    try {
        return await monitoringService.applyTestRun(id);
    } catch {
        return null;
    }
}

//good
export async function getExamTemplateSp(
    id: string,
): Promise<ScreenProctoringSettings | null> {
    try {
        return await examTemplateService.getExamTemplateSp(id);
    } catch {
        return null;
    }
}

//= =====SEB lock================
// TODO @Andrei @RemoveViewServices : might aswell move the logic to usage class since it's only used once.
export async function applySEBLock(
    id: string,
    enableSEBLock: boolean,
): Promise<Exam | null> {
    try {
        return enableSEBLock
            ? await examService.addSEBLock(id)
            : await examService.removeSEBLock(id);
    } catch {
        return null;
    }
}

// TODO @Andrei @RemoveViewServices     Why is this in a viewService? Isn't this a helper? There's no usage of api
//= ==============exam connection config logic====================
export function createDownloadLink(examName: string | undefined, blob: Blob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", getExamConfigFileName(examName));
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// TODO @Andrei @RemoveViewServices   belongs to the function above @createDownloadLink
function getExamConfigFileName(examName: string | undefined): string {
    if (examName == null) {
        return "";
    }

    examName = examName?.replaceAll(" ", "_");

    return `${examName}_${timeUtils.getCurrentDateString()}.seb`;
}
