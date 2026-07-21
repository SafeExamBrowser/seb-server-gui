<template>
    <LoadingFallbackComponent :loading="loading" :errors="errors">
        <DetailBox :title="$t('examDetail.boxes.basicSettings.title')">
            <template #action>
                <BasicSettingsEditDialog
                    :basic-settings="basicSettings"
                    :exam-with-u-r-l="examWithURL"
                    :edit-disabled="editDisabled"
                    :consecutive-exam-names="
                        computed(() => consecutiveExamNames)
                    "
                    @change="handleChange"
                />
            </template>

            <KeyValueList :items="items" class="pt-4" />
        </DetailBox>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { computed, Ref } from "vue";

import DetailBox from "@/components/widgets/DetailBox.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { BasicSettings } from "@/models/seb-server/exam.ts";

import BasicSettingsEditDialog from "./components/BasicSettingsEditDialog.vue";
import { useBasicSettingsItems } from "./composables/useBasicSettingsItems.ts";

const { examId, basicSettings, examWithURL, editDisabled } = defineProps<{
    examId: number;
    basicSettings: BasicSettings;
    examWithURL: boolean;
    editDisabled: Ref<boolean>;
}>();

const emit = defineEmits<{
    (e: "changeBasicSettings", value: BasicSettings): void;
}>();

const { items, consecutiveExamNames, loading, errors } = useBasicSettingsItems(
    examId,
    computed(() => basicSettings),
);

const handleChange = (value: BasicSettings) =>
    emit("changeBasicSettings", value);
</script>
