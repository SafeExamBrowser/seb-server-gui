import { useFetch } from "@/composables/useFetch.ts";
import { getExamConfigMapping } from "@/services/seb-server/examService.ts";
import { getConfigurationNode } from "@/services/seb-server/configurationNodeService.ts";

// The exam config mapping carries no timestamps itself, but it points to the
// configuration node that holds the "last modified" information.
export const useSebSettingsConfigNode = (examId: number) =>
    useFetch(
        async () => {
            const mapping = await getExamConfigMapping(examId);

            return getConfigurationNode(String(mapping.configurationNodeId));
        },
        { immediate: true },
    );
