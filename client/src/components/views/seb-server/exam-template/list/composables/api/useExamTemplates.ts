import { useFetch } from "@/composables/useFetch";
import { getExamTemplates } from "@/services/seb-server/examTemplateService";
import { type Ref } from "vue";

export const useExamTemplates = (
    params: Ref<Parameters<typeof getExamTemplates>[0]>,
) => useFetch(() => getExamTemplates(params.value));
