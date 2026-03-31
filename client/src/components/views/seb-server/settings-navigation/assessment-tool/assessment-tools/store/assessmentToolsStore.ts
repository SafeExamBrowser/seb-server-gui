import { defineStore } from "pinia";
import { useBaseSettingsStore } from "@/components/views/seb-server/settings-navigation/store/useBaseSettingsStore.ts";
import { AssessmentTool } from "@/models/seb-server/assessmentTool.ts";

export const useAssessmentToolsStore = defineStore("assessmentTool", () => {
    return useBaseSettingsStore<AssessmentTool>();
});
