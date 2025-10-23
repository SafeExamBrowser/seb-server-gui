import { useFetch } from "@/composables/useFetch";
import { getExamTemplateNames } from "@/services/seb-server/api-services/examTemplateService";

export const useExamTemplateNames = () =>
    useFetch(() => getExamTemplateNames());
