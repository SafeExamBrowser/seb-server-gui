import { onMounted } from "vue";
import { useFetch } from "@/composables/useFetch";
import { createTemporaryConfigurationTemplate } from "@/services/seb-server/examTemplateService";
import { getConfigurationTemplateName } from "@/services/seb-server/configurationNodeService";
import { useStepNamingStore } from "@/components/views/seb-server/exam-template/wizard/components/stepNaming/composables/store/useStepNamingStore";

const stepNamingStore = useStepNamingStore();

export const getTemporaryConfigTemplate = () => {
    const temporaryConfigTemplate = useFetch(() => {
        // if temporary configuration template is not created yet create one
        if (!stepNamingStore.configurationTemplate) {
            return createTemporaryConfigurationTemplate();
        } else {
            // otherwise just request the existing one
            return getConfigurationTemplateName(
                stepNamingStore.configurationTemplate,
            );
        }
    });
    onMounted(temporaryConfigTemplate.fetchData);
    return temporaryConfigTemplate;
};
