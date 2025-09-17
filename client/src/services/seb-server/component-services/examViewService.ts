import * as examService from "@/services/seb-server/api-services/examService";
import * as examTemplateService from "@/services/seb-server/api-services/examTemplateService";
import * as configurationService from "@/services/seb-server/api-services/configurationService";
import * as screenProctoringService from "@/services/seb-server/api-services/screenProctoringService";
import * as monitoringService from "@/services/seb-server/api-services/monitoringService";
import * as timeUtils from "@/utils/timeUtils";

//= ============api==============
export async function getExam(id: string): Promise<Exam | null> {
    try {
        return await examService.getExam(id);
    } catch {
        return null;
    }
}

export async function getExamAppSignatureKeys(
    id: string,
): Promise<AppSignatureKey[] | null> {
    try {
        return await examService.getExamAppSignatureKeys(id);
    } catch {
        return null;
    }
}

export async function getGrantedExamAppSignatureKeys(
    parentId: string,
): Promise<GrantedAppSignatureKey[] | null> {
    try {
        return await examService.getGrantedExamAppSignatureKeys(parentId);
    } catch {
        return null;
    }
}

export async function removeGrantExamAppSignatureKeys(
    parentId: string,
    id: string,
): Promise<GrantedAppSignatureKey[] | null> {
    try {
        return await examService.removeGrantExamAppSignatureKeys(parentId, id);
    } catch {
        return null;
    }
}

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

export async function hasSEBLock(id: string): Promise<boolean> {
    try {
        return await examService.checkSEBLock(id);
    } catch {
        return false;
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

export async function deleteExam(id: string): Promise<any | null> {
    try {
        return await examService.deleteExam(id);
    } catch {
        return null;
    }
}

export async function getExams(
    optionalParGetExams?: OptionalParGetExams,
): Promise<Exams | null> {
    try {
        return await examService.getExams(optionalParGetExams);
    } catch {
        return null;
    }
}

export async function getExamsForMonitoring(
    optionalParGetExams?: OptionalParGetExams,
): Promise<Exams | null> {
    try {
        return await examService.getExamsForMonitoring(optionalParGetExams);
    } catch {
        return null;
    }
}

export async function updateExam(
    examId: string,
    exam: Exam,
): Promise<Exam | null> {
    try {
        return await examService.updateExam(examId, exam);
    } catch {
        return null;
    }
}

export async function getConnectionConfigurations(): Promise<ConnectionConfigurations | null> {
    try {
        return await configurationService.getConnectionConfigurationsActive(
            "true",
        );
    } catch {
        return null;
    }
}

export async function downloadExamConfig(
    examId: string,
    connectionId: string,
): Promise<any> {
    try {
        return await configurationService.downloadExamConfig(
            examId,
            connectionId,
        );
    } catch {
        return null;
    }
}

export async function archiveExam(id: string): Promise<Exam | null> {
    try {
        return await examService.archiveExam(id);
    } catch {
        return null;
    }
}

export async function saveScreenProctoringSettings(
    id: string,
    screenProctoringSettings: ScreenProctoringSettings,
): Promise<Exam | null> {
    try {
        return await screenProctoringService.saveScreenProctoringSettings(
            id,
            screenProctoringSettings,
        );
    } catch {
        return null;
    }
}

export async function applyTestRun(id: string): Promise<Exam | null> {
    try {
        return await monitoringService.applyTestRun(id);
    } catch {
        return null;
    }
}

export async function applyScreenProctoringGroups(
    id: string,
    spsSEBGroupsSelection: string,
): Promise<Exam | null> {
    try {
        return await screenProctoringService.applyScreenProctoringGroups(
            id,
            spsSEBGroupsSelection,
        );
    } catch {
        return null;
    }
}

export async function activateScreenProctoring(
    id: string,
    enableScreenProctoring: boolean,
): Promise<Exam | null> {
    try {
        return await screenProctoringService.activateScreenProctoring(
            id,
            enableScreenProctoring,
        );
    } catch {
        return null;
    }
}

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

export async function applySEBLock(
    id: string,
    enableSEBLock: boolean,
): Promise<Exam | null> {
    try {
        return await examService.applySEBLock(id, enableSEBLock);
    } catch {
        return null;
    }
}

//= =====screen proctoring=======
export function createDefaultScreenProctoringSettings(
    enable: boolean,
    examId: number,
    groupName: string,
): ScreenProctoringSettings {
    return {
        id: examId,
        enableScreenProctoring: enable,
        spsCollectingStrategy: "EXAM",
        spsCollectingGroupName: groupName,
        bundled: false,
        changeStrategyConfirm: false,
    };
}

//= ==============exam connection config logic====================
export function createDownloadLink(examName: string | undefined, blob: any) {
    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", getExamConfigFileName(examName));
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function getExamConfigFileName(examName: string | undefined): string {
    if (examName == null) {
        return "";
    }

    examName = examName?.replaceAll(" ", "_");

    return `${examName}_${timeUtils.getCurrentDateString()}.seb`;
}
