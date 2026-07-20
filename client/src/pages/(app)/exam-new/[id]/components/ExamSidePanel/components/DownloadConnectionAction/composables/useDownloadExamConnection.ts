import { ref } from "vue";
import { ConnectionConfiguration } from "@/models/seb-server/connectionConfiguration.ts";
import * as connectionConfigurationService from "@/services/seb-server/connectionConfigurationInfoService.ts";
import * as timeUtils from "@/utils/timeUtils.ts";

export const useDownloadExamConnection = ({
    examId,
    quizName,
}: {
    examId: () => number | undefined;
    quizName: () => string | undefined;
}) => {
    const dialogOpen = ref(false);
    const connectionConfigurations = ref<ConnectionConfiguration[]>([]);

    const start = async () => {
        if (examId() === undefined) {
            return;
        }

        const configurations =
            await connectionConfigurationService.getConnectionConfigurationsActive();

        if (configurations.content.length === 0) {
            return;
        }

        if (configurations.content.length === 1) {
            await download(configurations.content[0].id);
            return;
        }

        connectionConfigurations.value = configurations.content;
        dialogOpen.value = true;
    };

    const download = async (connectionId: number) => {
        const id = examId();
        if (id === undefined) {
            return;
        }

        const blob = await connectionConfigurationService.downloadExamConfig(
            String(id),
            String(connectionId),
        );

        createDownloadLink(blob);
    };

    const createDownloadLink = (blob: Blob) => {
        const name = (quizName() ?? "exam").replaceAll(" ", "_");
        const fileName = `${name}_${timeUtils.getCurrentDateString()}.seb`;

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", fileName);
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    };

    return {
        dialogOpen,
        connectionConfigurations,
        start,
        download,
    };
};
