import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAssessmentToolStore = defineStore('assessmentTool', () => {
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
