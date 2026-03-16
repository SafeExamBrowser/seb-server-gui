import { Exam } from "@/models/seb-server/exam.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as generalUtils from "@/utils/generalUtils";
import { ClientGroup } from "@/models/seb-server/clientGroup";

export function isMonitoringDisabled(): boolean {
    const selectedExam: Exam | null = useMonitoringStore().selectedExam;

    if (selectedExam == null) return true;

    const examStatus: ExamStatusEnum | null = generalUtils.findEnumValue(
        ExamStatusEnum,
        selectedExam.status,
    );
    const allowedExamStatuses: (ExamStatusEnum | null)[] = [
        ExamStatusEnum.RUNNING,
        ExamStatusEnum.TEST_RUN,
    ];

    return !allowedExamStatuses.includes(examStatus);
}

export function getMonitoringDisabledWarningText(): string {
    if (useMonitoringStore().selectedExam == null) {
        return generalUtils.translate("monitoringOverview.warning.notExist");
    }

    if (
        generalUtils.findEnumValue(
            ExamStatusEnum,
            useMonitoringStore().selectedExam?.status,
        ) !== ExamStatusEnum.RUNNING
    ) {
        return generalUtils.translate("monitoringOverview.warning.notRunning");
    }

    return "";
}

export function extractClientGroupNames(
    clientGroupIds: number[],
): ClientGroup[] {
    const clientGroups: ClientGroup[] = [];
    for (let i = 0; i < clientGroupIds.length; i++) {
        const clientGroup: ClientGroup | undefined =
            useMonitoringStore().clientGroups?.content.find(
                (clientGroup) => clientGroup.id === clientGroupIds[i],
            );

        if (clientGroup != null) {
            clientGroups.push(clientGroup);
        }
    }

    return clientGroups;
}
