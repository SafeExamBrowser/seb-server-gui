<template>
    <LoadingFallbackComponent :loading="loading" :errors="errors">
        <DetailBox :title="$t('examDetail.boxes.basicSettings.title')">
            <template #action>
                <BasicSettingsEditDialog
                    :basic-settings="basicSettings"
                    :exam-with-u-r-l="examWithURL"
                    :edit-disabled="editDisabled"
                    :consecutive-exam-names="consecutiveExamNames"
                    @change="handleChange"
                />
            </template>

            <KeyValueList :items="items" class="pt-4" />
        </DetailBox>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import DetailBox from "@/components/widgets/DetailBox.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { BasicSettings } from "@/models/seb-server/exam.ts";
import { useBasicSettingsItems } from "./composables/useBasicSettingsItems.ts";
import BasicSettingsEditDialog from "./components/BasicSettingsEditDialog.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";

const { examId, basicSettings, examWithURL, editDisabled } = defineProps<{
    examId: number;
    basicSettings: BasicSettings;
    examWithURL: boolean;
    editDisabled: boolean;
}>();

const emit = defineEmits<{
    (e: "change", value: BasicSettings): void;
}>();

const { items, consecutiveExamNames, loading, errors } = useBasicSettingsItems(
    examId,
    computed(() => basicSettings),
);

const handleChange = (value: BasicSettings) => emit("change", value);
</script>
