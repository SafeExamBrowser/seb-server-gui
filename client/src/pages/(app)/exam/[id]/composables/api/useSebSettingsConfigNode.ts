import { type Ref, watch } from "vue";

import { useFetch } from "@/composables/useFetch.ts";
import { ConfigurationExamMapping } from "@/models/seb-server/configurationNode";
import { getConfigurationNode } from "@/services/seb-server/configurationNodeService.ts";

// The exam config mapping carries no timestamps itself, but it points to the
// configuration node that holds the "last modified" information.
export const useSebSettingsConfigNode = (
    configMapping: Ref<ConfigurationExamMapping | undefined>,
) => {
    const fetch = useFetch(async () => {
        const mapping = configMapping.value;

        if (!mapping) {
            return null;
        }

        return getConfigurationNode(String(mapping.configurationNodeId));
    });

    // Watching the node id (not the mapping object) avoids a re-fetch when the
    // mapping is reassigned after saving the encryption password.
    watch(
        () => configMapping.value?.configurationNodeId,
        (nodeId) => {
            if (nodeId === undefined) {
                return;
            }

            fetch.fetchData();
        },
        { immediate: true },
    );

    return fetch;
};
