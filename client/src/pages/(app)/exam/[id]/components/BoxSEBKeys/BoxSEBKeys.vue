<template>
    <DetailBox :title="$t('examDetail.boxes.sebKeys.title')">
        <template #action>
            <SebKeysEditDialog v-if="!editHidden" :disabled="editDisabled" />
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

import SebKeysEditDialog from "./components/SebKeysEditDialog.vue";

defineProps<{
    lastModifiedItems: KeyValueItem[];
    lastModifiedLoading: boolean;
    editHidden: boolean;
    editDisabled: boolean;
}>();
</script>
