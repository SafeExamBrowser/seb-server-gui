import { computed, reactive, Ref } from "vue";
import { DeletionInfo } from "@/models/seb-server/scheduled-deletion";
import { useGetScheduledDeletionReport } from "@/pages/(app)/scheduled-deletion/composables/api/useGetScheduledDeletionReport";
import { KeyValueItem } from "@/components/widgets/keyValueList/types";
import { useI18n } from "vue-i18n";
import {
    formatTimestampToDate,
    formatTimestampToFullDate,
} from "@/utils/timeUtils";

export const useScheduledDeletionReport = (id: string) => {
    const { t } = useI18n();

    const {
        data: scheduledDelete,
        loading,
        error,
    } = useGetScheduledDeletionReport(Number(id));

    const reportItems: Ref<KeyValueItem[]> = computed(() => {
        if (scheduledDelete.value) {
            return [
                {
                    key: "name",
                    type: "basic",
                    label: t("scheduledDelete.report.name"),
                    value: {
                        type: "string",
                        value: `Scheduled Deletion ${formatTimestampToDate(scheduledDelete.value.scheduleTime)}`,
                    },
                },
                {
                    key: "state",
                    type: "basic",
                    label: t("scheduledDelete.report.state"),
                    value: {
                        type: "string",
                        value: t(
                            `scheduledDelete.status.${String(scheduledDelete.value.state)}`,
                        ),
                    },
                },
                {
                    key: "dueTime",
                    type: "basic",
                    label: t("scheduledDelete.report.dueTime"),
                    value: {
                        type: "string",
                        value: formatTimestampToDate(
                            scheduledDelete.value.deleteDueTime,
                        ),
                    },
                },
                {
                    key: "scheduledTime",
                    type: "basic",
                    label: t("scheduledDelete.report.scheduledTime"),
                    value: {
                        type: "string",
                        value: formatTimestampToFullDate(
                            scheduledDelete.value.scheduleTime,
                        ),
                    },
                },
                {
                    key: "startTime",
                    type: "basic",
                    label: t("scheduledDelete.report.startTime"),
                    value: {
                        type: "string",
                        value: formatTimestampToFullDate(
                            scheduledDelete.value.startTime ?? 0,
                        ),
                    },
                },
                {
                    key: "endTime",
                    type: "basic",
                    label: t("scheduledDelete.report.endTime"),
                    value: {
                        type: "string",
                        value: formatTimestampToFullDate(
                            scheduledDelete.value.endTime ?? 0,
                        ),
                    },
                },
            ];
        }
        return [];
    });

    const deletionErrors: Ref<DeletionInfo[] | undefined> = computed(() => {
        if (scheduledDelete.value) {
            const infos: DeletionInfo[] = [];
            scheduledDelete.value.examDeletions.forEach((info) => {
                if (info.errorType) {
                    infos.push(info);
                }
            });
            scheduledDelete.value.spsOnlyDeletions.forEach((info) => {
                if (info.errorType) {
                    infos.push(info);
                }
            });
            return infos;
        }
        return undefined;
    });

    const examDeletions: Ref<DeletionInfo[] | undefined> = computed(() => {
        if (scheduledDelete.value) {
            const infos: DeletionInfo[] = [];
            scheduledDelete.value.examDeletions.forEach((info) => {
                if (!info.errorType) {
                    infos.push(info);
                }
            });
            return infos;
        }
        return undefined;
    });

    const spsDeletions: Ref<DeletionInfo[] | undefined> = computed(() => {
        if (scheduledDelete.value) {
            const infos: DeletionInfo[] = [];
            scheduledDelete.value.spsOnlyDeletions.forEach((info) => {
                if (!info.errorType) {
                    infos.push(info);
                }
            });
            return infos;
        }
        return undefined;
    });

    const errors = computed(() => (error.value ? [error.value] : []));

    return {
        report: reactive({
            scheduledDelete,
            reportItems,
            deletionErrors,
            examDeletions,
            spsDeletions,
            loading,
            errors,
        }),
    };
};
