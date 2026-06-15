<template>
    <ExamTemplateBox
        :title="$t('examTemplateDetail.boxes.screenProctoringSettings.title')"
    >
        <template #action>
            <ScreenProctoringEditDialog
                :enabled="enabled"
                :collection-strategy="collectionStrategy"
                @change="handleChange"
            />
        </template>

        <KeyValueList :items="items" class="pt-4" />
    </ExamTemplateBox>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import ExamTemplateBox from "@/pages/(app)/exam-template/[id]/components/ExamTemplateBox.vue";
import ScreenProctoringEditDialog from "./components/ScreenProctoringEditDialog.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import { ScreenProctoringSelection } from "./types.ts";

const { enabled, collectionStrategy } =
    defineProps<ScreenProctoringSelection>();

const emit = defineEmits<{
    (e: "change", value: ScreenProctoringSelection): void;
}>();

const { t } = useI18n();

const strategyLabel = computed<string | undefined>(() => {
    if (collectionStrategy === "EXAM") {
        return t("screenProctoring.collectionStrategy.strategies.EXAM");
    }

    if (collectionStrategy === "APPLY_SEB_GROUPS") {
        return t(
            "screenProctoring.collectionStrategy.strategies.APPLY_SEB_GROUPS",
        );
    }

    return undefined;
});

const items = computed<KeyValueItem[]>(() => {
    const result: KeyValueItem[] = [
        {
            key: "enabled",
            type: "basic",
            label: t("screenProctoring.enabled.label"),
            value: { type: "boolean", value: enabled },
        },
    ];

    if (enabled && strategyLabel.value !== undefined) {
        result.push({
            key: "collectionStrategy",
            type: "basic",
            label: t("screenProctoring.collectionStrategy.label"),
            value: { type: "string", value: strategyLabel.value },
        });
    }

    return result;
});

const handleChange = (value: ScreenProctoringSelection) =>
    emit("change", value);
</script>
