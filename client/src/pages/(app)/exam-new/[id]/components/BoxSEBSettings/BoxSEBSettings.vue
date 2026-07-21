<template>
    <DetailBox :title="$t('examDetail.boxes.sebSettings.title')">
        <template #action>
            <SebSettingsEditDialog
                :exam-id="examId"
                :edit-disabled="editDisabled"
                :active-seb-clients="activeSebClients ?? 0"
            />
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
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";

import SebSettingsEditDialog from "./components/SebSettingsEditDialog.vue";
import { useActiveSebClients } from "./composables/api/useActiveSebClients.ts";
import { useSebSettingsConfigNode } from "./composables/api/useSebSettingsConfigNode.ts";

const { examId } = defineProps<{
    examId: number;
    editDisabled: boolean;
}>();

const { t } = useI18n();

const { data: activeSebClients } = useActiveSebClients(examId);
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
            label: t("examDetail.boxes.sebSettings.lastModifiedBy"),
            value: {
                type: "string",
                value: `${lastUpdateUserName} - ${formatIsoToReadableDateTime(lastUpdateTime)}`,
            },
        },
    ];
});
</script>
