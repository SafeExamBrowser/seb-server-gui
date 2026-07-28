import { exportSEBSettings } from "@/services/seb-server/configurationNodeService";
import { downloadBlob } from "@/utils/downloadUtils.ts";

export function useDownloadSEBSettings() {
    async function downloadSEBLogs(
        configurationTemplateId: number,
        examTemplateName: string,
    ) {
        const blobResponse = await exportSEBSettings(
            String(configurationTemplateId),
        );
        if (blobResponse == null) {
            return;
        }

        downloadBlob(blobResponse, `SEBSettings_${examTemplateName}.seb`);
    }

    return {
        downloadSEBLogs,
    };
}
