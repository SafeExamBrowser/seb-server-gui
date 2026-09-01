<template>
    <DetailBox :title="$t('examDetail.boxes.sebKeys.title')">
        <template #action>
            <SebKeysEditDialog v-if="!editHidden" :disabled="editDisabled" />
        </template>

        <LoadingFallbackComponent
            :loading="lastModifiedLoading || sebKeysFetch.loading.value"
        >
            <KeyValueList v-if="items.length > 0" :items="items" class="pt-4" />
        </LoadingFallbackComponent>
    </DetailBox>
</template>

<script setup lang="ts">
import DetailBox from "@/components/widgets/DetailBox.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useSEBKeyItems } from "@/pages/(app)/exam/[id]/components/BoxSEBKeys/composables/useSEBKeyItems.ts";

import SebKeysEditDialog from "./components/SebKeysEditDialog.vue";

const props = defineProps<{
    examId: number;
    lastModifiedItems: KeyValueItem[];
    lastModifiedLoading: boolean;
    editHidden: boolean;
    editDisabled: boolean;
}>();

const { items, sebKeysFetch } = useSEBKeyItems(
    String(props.examId),
    props.lastModifiedItems,
);
</script>
