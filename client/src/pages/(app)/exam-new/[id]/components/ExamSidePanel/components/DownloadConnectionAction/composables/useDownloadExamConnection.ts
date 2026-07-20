import { computed, ref } from "vue";
import i18n from "@/i18n";
import { ConnectionConfiguration } from "@/models/seb-server/connectionConfiguration.ts";
import * as connectionConfigurationService from "@/services/seb-server/connectionConfigurationInfoService.ts";
import { notify } from "@/services/notifications/notify.ts";
import { useMutation } from "@/composables/useMutation.ts";
import * as timeUtils from "@/utils/timeUtils.ts";
import { downloadBlob } from "@/utils/downloadUtils.ts";
import { useConnectionConfigurations } from "./api/useConnectionConfigurations.ts";

export const useDownloadExamConnection = ({
    examId,
    quizName,
}: {
    examId: () => number | undefined;
    quizName: () => string | undefined;
}) => {
    const dialogOpen = ref(false);
    const connectionConfigurations = ref<ConnectionConfiguration[]>([]);

    const {
        data: activeConfigurations,
        loading: configurationsLoading,
        error: configurationsError,
        fetchData: fetchConfigurations,
    } = useConnectionConfigurations();

    const downloadMutation = useMutation((id: number, connectionId: number) =>
        connectionConfigurationService.downloadExamConfig(
            String(id),
            String(connectionId),
        ),
    );

    const loading = computed(
        () => configurationsLoading.value || downloadMutation.loading.value,
    );

    const start = async () => {
        if (examId() === undefined) {
            return;
        }

        await fetchConfigurations();

        // Must be checked before reading the data: useFetch keeps the previously
        // fetched configurations when a later fetch fails.
        if (configurationsError.value) {
            notify.serverError(configurationsError.value, {
                titleOverride: i18n.global.t(
                    "examDetail.sidePanel.errors.connectionConfigurationsFailed",
                ),
            });
            return;
        }

        const configurations = activeConfigurations.value?.content ?? [];

        if (configurations.length === 0) {
            return;
        }

        if (configurations.length === 1) {
            await download(configurations[0].id);
            return;
        }

        connectionConfigurations.value = configurations;
        dialogOpen.value = true;
    };

    const download = async (connectionId: number) => {
        const id = examId();
        if (id === undefined) {
            return;
        }

        const blob = await downloadMutation.mutateData(id, connectionId);

        if (!blob) {
            notify.serverError(downloadMutation.error.value, {
                titleOverride: i18n.global.t(
                    "examDetail.sidePanel.errors.downloadExamConnectionFailed",
                ),
            });
            return;
        }

        const name = (quizName() ?? "exam").replaceAll(" ", "_");
        downloadBlob(blob, `${name}_${timeUtils.getCurrentDateString()}.seb`);
    };

    return {
        dialogOpen,
        connectionConfigurations,
        loading,
        start,
        download,
    };
};
