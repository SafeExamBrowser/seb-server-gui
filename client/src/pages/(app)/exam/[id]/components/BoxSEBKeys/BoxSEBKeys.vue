<template>
    <DetailBox :title="$t('examDetail.boxes.sebKeys.title')">
        <template #action>
            <SebKeysEditDialog
                :exam-id="examId"
                :disabled="editDisabled"
                @change="saveSEBKeys.mutateAsync"
            />
        </template>

        <LoadingFallbackComponent :loading="lastModifiedLoading">
            <KeyValueList
                v-if="items.value && items.value.length > 0"
                :items="items.value"
                class="pt-4"
            />
        </LoadingFallbackComponent>
    </DetailBox>
</template>

<script setup lang="ts">
import { Ref } from "vue";

import DetailBox from "@/components/widgets/DetailBox.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { ConfigurationNodeInfo } from "@/models/seb-server/configurationNode.ts";
import { SEBKeys } from "@/models/seb-server/sebKeys.ts";
import { useSaveSEBKeys } from "@/pages/(app)/exam/[id]/components/BoxSEBKeys/composables/api/useSaveSEBKeys.ts";

import SebKeysEditDialog from "./components/SebKeysEditDialog.vue";

const props = defineProps<{
    // hasBEK: boolean;
    examId: number;
    lastModifiedItems: KeyValueItem[];
    lastModifiedLoading: boolean;
    editDisabled: boolean;

    items: Ref<KeyValueItem[] | undefined>;
    sebKeys: Ref<SEBKeys | undefined>;
    configNode: Ref<ConfigurationNodeInfo | undefined>;
}>();

const saveSEBKeys = useSaveSEBKeys(props.sebKeys);
</script>
