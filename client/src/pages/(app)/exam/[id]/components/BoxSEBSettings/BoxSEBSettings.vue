<template>
    <DetailBox :title="$t('examDetail.boxes.sebSettings.title')">
        <template #action>
            <SebSettingsEditDialog
                v-if="!editHidden"
                :exam-id="examId"
                :edit-disabled="editDisabled"
                :active-seb-clients="activeSebClients ?? 0"
            />
        </template>

        <LoadingFallbackComponent :loading="lastModifiedLoading">
            <KeyValueList
                v-if="lastModifiedItems.length > 0"
                :items="lastModifiedItems"
                class="pt-4"
            />
        </LoadingFallbackComponent>
    </DetailBox>
</template>

<script setup lang="ts">
import DetailBox from "@/components/widgets/DetailBox.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";

import SebSettingsEditDialog from "./components/SebSettingsEditDialog.vue";
import { useActiveSebClients } from "./composables/api/useActiveSebClients.ts";

const { examId } = defineProps<{
    examId: number;
    editHidden: boolean;
    editDisabled: boolean;
    lastModifiedItems: KeyValueItem[];
    lastModifiedLoading: boolean;
}>();

const { data: activeSebClients } = useActiveSebClients(examId);
</script>
