<template>
    <DetailBox
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
    </DetailBox>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import DetailBox from "@/components/widgets/DetailBox.vue";
import ScreenProctoringEditDialog from "./components/ScreenProctoringEditDialog.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import { ScreenProctoringCollectionStrategy } from "@/models/seb-server/screenProctoring.ts";
import { ScreenProctoringSelection } from "./types.ts";

const STRATEGY_LABEL_KEYS: Record<ScreenProctoringCollectionStrategy, string> =
    {
        EXAM: "screenProctoring.collectionStrategy.strategies.EXAM",
        APPLY_SEB_GROUPS:
            "screenProctoring.collectionStrategy.strategies.APPLY_SEB_GROUPS",
    };

const { enabled, collectionStrategy } =
    defineProps<ScreenProctoringSelection>();

const emit = defineEmits<{
    (e: "change", value: ScreenProctoringSelection): void;
}>();

const { t } = useI18n();

const strategyLabel = computed<string | undefined>(() =>
    collectionStrategy ? t(STRATEGY_LABEL_KEYS[collectionStrategy]) : undefined,
);

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
