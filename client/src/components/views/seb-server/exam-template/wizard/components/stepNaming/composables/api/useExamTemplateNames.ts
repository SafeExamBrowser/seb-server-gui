import { useFetch } from "@/composables/useFetch";
import { getExamTemplateNames } from "@/services/seb-server/examTemplateService";

export const useExamTemplateNames = () =>
    useFetch(() => getExamTemplateNames());
