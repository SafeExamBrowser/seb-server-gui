import { onMounted } from "vue";
import { useFetch } from "@/composables/useFetch";
import { getExamTemplateNames } from "@/services/seb-server/examTemplateService";

export const useExamTemplateNames = () => {
    const examTemplateNamesFetch = useFetch(() => getExamTemplateNames());
    onMounted(examTemplateNamesFetch.fetchData);
    return examTemplateNamesFetch;
};
