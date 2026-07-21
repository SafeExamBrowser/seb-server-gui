<template>
    <DetailBox :title="$t('examTemplateDetail.boxes.basicSettings.title')">
        <template #action>
            <BasicSettingsEditDialog
                :basic-settings="basicSettings"
                @change="handleChange"
            />
        </template>

        <KeyValueList :items="items" class="pt-4" />
    </DetailBox>
</template>

<script setup lang="ts">
import { computed } from "vue";

import DetailBox from "@/components/widgets/DetailBox.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { BasicSettings } from "@/models/seb-server/examTemplate.ts";

import BasicSettingsEditDialog from "./components/BasicSettingsEditDialog.vue";
import { useBasicSettingsItems } from "./composables/useBasicSettingsItems.ts";

const { basicSettings } = defineProps<{ basicSettings: BasicSettings }>();

const emit = defineEmits<{
    (e: "change", value: BasicSettings): void;
}>();

const { items } = useBasicSettingsItems(computed(() => basicSettings));

const handleChange = (value: BasicSettings) => emit("change", value);
</script>
