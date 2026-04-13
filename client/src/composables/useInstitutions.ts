import { onMounted } from "vue";
import { useFetch } from "@/composables/useFetch";
import { getInstitutions } from "@/services/seb-server/institutionService";

export const useInstitutions = () => {
    const fetch = useFetch(() => getInstitutions());
    onMounted(fetch.fetchData);
    return fetch;
};
