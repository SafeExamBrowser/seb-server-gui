import { exportSEBSettings } from "@/services/seb-server/configurationNodeService";

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

        createDownloadLink(examTemplateName, blobResponse);
    }

    function createDownloadLink(examTemplateName: string, blob: Blob) {
        const filName = `SEBSettings_${examTemplateName}.seb`;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filName);
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    return {
        downloadSEBLogs,
    };
}
