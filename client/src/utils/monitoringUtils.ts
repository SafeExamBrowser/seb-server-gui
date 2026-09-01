import { ClientGroup } from "@/models/seb-server/clientGroup.ts";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import { NotificationEnum } from "@/models/seb-server/monitoringEnums.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as generalUtils from "@/utils/generalUtils.ts";

const connectionStatusColors: Record<ConnectionStatusEnum, string> = {
    [ConnectionStatusEnum.UNDEFINED]: "#9e9e9e",
    [ConnectionStatusEnum.CONNECTION_REQUESTED]: "#9fd8a3",
    [ConnectionStatusEnum.READY]: "#5fce67",
    [ConnectionStatusEnum.ACTIVE]: "#2a8f5d",
    [ConnectionStatusEnum.CLOSED]: "#7fc6db",
    [ConnectionStatusEnum.DISABLED]: "#9e9e9e",
    [ConnectionStatusEnum.MISSING]: "#ef5350",
};

export const NOTIFICATION_META: Record<
    NotificationEnum,
    { icon: string; color: string; background: string }
> = {
    [NotificationEnum.RAISE_HAND]: {
        icon: "mdi-hand-back-right",
        color: "#1565C0",
        background: "#E3F2FD",
    },
    [NotificationEnum.LOCK_SCREEN]: {
        icon: "mdi-monitor-lock",
        color: "#F9A825",
        background: "#FFF8E1",
    },
};

export const CONNECTION_STATUS_DISPLAY_ORDER = [
    ConnectionStatusEnum.CONNECTION_REQUESTED,
    ConnectionStatusEnum.READY,
    ConnectionStatusEnum.ACTIVE,
    ConnectionStatusEnum.CLOSED,
    ConnectionStatusEnum.DISABLED,
    ConnectionStatusEnum.MISSING,
] as const;

export function getConnectionStatusColor(status: string): string {
    const connectionStatus = generalUtils.findEnumValue(
        ConnectionStatusEnum,
        status,
    );

    if (connectionStatus == null) {
        return connectionStatusColors[ConnectionStatusEnum.UNDEFINED];
    }

    return connectionStatusColors[connectionStatus];
}

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
