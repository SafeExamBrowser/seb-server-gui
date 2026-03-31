import { useFetch } from "@/composables/useFetch";
import { getExamTemplates } from "@/services/seb-server/examTemplateService";

export const useExamTemplates = () => useFetch(() => getExamTemplates());
