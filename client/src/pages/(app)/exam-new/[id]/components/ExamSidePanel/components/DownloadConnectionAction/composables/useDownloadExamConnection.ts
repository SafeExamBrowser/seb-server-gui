import { computed, ref } from "vue";
import i18n from "@/i18n";
import * as connectionConfigurationService from "@/services/seb-server/connectionConfigurationInfoService.ts";
import { notify } from "@/services/notifications/notify.ts";
import { useMutation } from "@/composables/useMutation.ts";
import * as timeUtils from "@/utils/timeUtils.ts";
import { downloadBlob } from "@/utils/downloadUtils.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { useConnectionConfigurations } from "./api/useConnectionConfigurations.ts";

export const useDownloadExamConnection = ({
    exam,
    enabled,
}: {
    exam: () => Exam | undefined;
    enabled: () => boolean;
}) => {
    const dialogOpen = ref(false);

    const { data: activeConfigurations } = useConnectionConfigurations(enabled);

    const connectionConfigurations = computed(
        () => activeConfigurations.value?.content ?? [],
    );

    const available = computed(() => connectionConfigurations.value.length > 0);

    const downloadMutation = useMutation((id: number, connectionId: number) =>
        connectionConfigurationService.downloadExamConfig(
            String(id),
            String(connectionId),
        ),
    );

    const download = async (connectionId: number) => {
        const currentExam = exam();

        if (currentExam === undefined) {
            return;
        }

        const blob = await downloadMutation.mutateData(
            currentExam.id,
            connectionId,
        );

        if (!blob) {
            notify.serverError(downloadMutation.error.value, {
                titleOverride: i18n.global.t(
                    "examDetail.sidePanel.errors.downloadExamConnectionFailed",
                ),
            });
            return;
        }

        const name = currentExam.quizName.replaceAll(" ", "_");
        downloadBlob(blob, `${name}_${timeUtils.getCurrentDateString()}.seb`);
    };

    const start = () => {
        const configurations = connectionConfigurations.value;

        if (configurations.length === 1) {
            void download(configurations[0].id);
            return;
        }

        dialogOpen.value = true;
    };

    return {
        dialogOpen,
        connectionConfigurations,
        available,
        loading: downloadMutation.loading,
        start,
        download,
    };
};
