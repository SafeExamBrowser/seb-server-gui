import { defineStore } from "pinia";
import { ref } from "vue";
import { ServerTablePaging } from "@/models/types";
import { AssessmentTool } from "@/models/seb-server/assessmentTool";
import { APIMessage } from "@/models/seb-server/apiMessages";

// todo
export const useCertificateStore = defineStore("certificate", () => {
    const searchField = ref<string | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();

    const selectedAssessmentTool = ref<AssessmentTool | null>(null);
    const importMessages = ref<APIMessage[]>([]);

    function clearSelectedValues() {
        selectedAssessmentTool.value = null;
        importMessages.value = [];
    }

    return {
        searchField,
        currentPagingOptions,
        selectedAssessmentTool,
        importMessages,
        clearSelectedValues,
    };
});
