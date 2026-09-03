<template>
    <DetailBox :title="$t('examDetail.boxes.sebKeys.title')">
        <template #action>
            <SebKeysEditDialog
                v-if="!editHidden"
                :exam-id="examId"
                :disabled="editDisabled"
                @change="saveSEBKeys.mutateAsync"
            />
        </template>

        <LoadingFallbackComponent :loading="lastModifiedLoading && loading">
            <KeyValueList v-if="items.length > 0" :items="items" class="pt-4" />
        </LoadingFallbackComponent>
    </DetailBox>
</template>

<script setup lang="ts">
import DetailBox from "@/components/widgets/DetailBox.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useSaveSEBKeys } from "@/pages/(app)/exam/[id]/components/BoxSEBKeys/composables/api/useSaveSEBKeys.ts";
import { useSEBKeyItems } from "@/pages/(app)/exam/[id]/components/BoxSEBKeys/composables/useSEBKeyItems.ts";

import SebKeysEditDialog from "./components/SebKeysEditDialog.vue";

const props = defineProps<{
    hasBEK: boolean;
    examId: number;
    lastModifiedItems: KeyValueItem[];
    lastModifiedLoading: boolean;
    editHidden: boolean;
    editDisabled: boolean;
}>();

const { items, loading, data } = useSEBKeyItems(
    props.hasBEK,
    String(props.examId),
    props.lastModifiedItems,
);

const saveSEBKeys = useSaveSEBKeys(data);
</script>
