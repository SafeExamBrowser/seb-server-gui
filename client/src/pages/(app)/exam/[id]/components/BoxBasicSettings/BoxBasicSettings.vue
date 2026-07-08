<template>
    <DetailBox :title="$t('examDetail.boxes.basicSettings.title')">
        <template #action>
            <BasicSettingsEditDialog
                :basic-settings="basicSettings"
                :exam-with-u-r-l="examWithURL"
                :edit-disabled="editDisabled"
                @change="handleChange"
            />
        </template>

        <KeyValueList :items="items" class="pt-4" />
    </DetailBox>
</template>

<script setup lang="ts">
import { computed, Ref } from "vue";
import DetailBox from "@/components/widgets/DetailBox.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { BasicSettings } from "@/models/seb-server/exam.ts";
import { useBasicSettingsItems } from "./composables/useBasicSettingsItems.ts";
import BasicSettingsEditDialog from "./components/BasicSettingsEditDialog.vue";

const { basicSettings, examWithURL, editDisabled } = defineProps<{
    basicSettings: BasicSettings;
    examWithURL: Ref<boolean>;
    editDisabled: Ref<boolean>;
}>();

const emit = defineEmits<{
    (e: "changeBasicSettings", value: BasicSettings): void;
}>();

const { items } = useBasicSettingsItems(computed(() => basicSettings));

const handleChange = (value: BasicSettings) =>
    emit("changeBasicSettings", value);
</script>
