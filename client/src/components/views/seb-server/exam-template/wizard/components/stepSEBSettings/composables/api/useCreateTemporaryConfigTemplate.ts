import { onMounted } from "vue";
import { useFetch } from "@/composables/useFetch";
import { createTemporaryConfigurationTemplate } from "@/services/seb-server/examTemplateService";

export const createTemporaryConfigTemplate = () => {
    console.info("createTemporaryConfigTemplate");
    const temporaryConfigTemplate = useFetch(() =>
        createTemporaryConfigurationTemplate(),
    );
    onMounted(temporaryConfigTemplate.fetchData);
    return temporaryConfigTemplate;
};
