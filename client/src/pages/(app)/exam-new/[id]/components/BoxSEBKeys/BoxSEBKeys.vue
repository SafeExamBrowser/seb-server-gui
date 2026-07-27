<template>
    <DetailBox :title="$t('examDetail.boxes.sebKeys.title')">
        <template #action>
            <SebKeysEditDialog />
        </template>

        <LoadingFallbackComponent :loading="loading">
            <KeyValueList v-if="items.length > 0" :items="items" class="pt-4" />
        </LoadingFallbackComponent>
    </DetailBox>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import DetailBox from "@/components/widgets/DetailBox.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useSebSettingsConfigNode } from "@/pages/(app)/exam-new/[id]/composables/api/useSebSettingsConfigNode.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";

import SebKeysEditDialog from "./components/SebKeysEditDialog.vue";

const { examId } = defineProps<{
    examId: number;
}>();

const { t } = useI18n();

const { data: configNode, loading } = useSebSettingsConfigNode(examId);

const items = computed<KeyValueItem[]>(() => {
    const lastUpdateUserName = configNode.value?.lastUpdateUserName;
    const lastUpdateTime = configNode.value?.lastUpdateTime;

    if (!lastUpdateUserName || !lastUpdateTime) {
        return [];
    }

    return [
        {
            key: "lastModified",
            type: "basic",
            label: t("examDetail.boxes.sebKeys.lastModifiedBy"),
            value: {
                type: "string",
                value: `${lastUpdateUserName} - ${formatIsoToReadableDateTime(lastUpdateTime)}`,
            },
        },
    ];
});
</script>
