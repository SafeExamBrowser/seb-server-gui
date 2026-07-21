<template>
    <v-file-input
        v-model="model"
        v-bind="standardProperties"
        :rules="allValidationRules"
        :accept="acceptExtensions.join(',')"
        :prepend-icon="icon"
        :clearable="clearable"
        show-size
        :hint="completeHint"
        persistent-hint
    />
</template>

<script setup lang="ts">
import { FormFieldBaseProperties } from "@/components/widgets/formBuilder/types";
import { computed } from "vue";
import { useRules } from "vuetify/labs/rules";
import i18n from "@/i18n";

const model = defineModel<File | undefined>();

const props = defineProps<{
    standardProperties: FormFieldBaseProperties;
    acceptExtensions: string[];
    icon?: string;
    hint?: string;
    clearable: boolean;
}>();

const rules = useRules();

const allValidationRules = computed(() => [
    ...(props.standardProperties.rules ?? []),
    rules.fileExtension(props.acceptExtensions),
]);

const completeHint = computed(() =>
    [
        props.hint ?? i18n.global.t("general.formFields.file.hint"),
        props.acceptExtensions.length > 0
            ? [
                  i18n.global.t("general.formFields.file.allowedFileTypes"),
                  props.acceptExtensions.join(", "),
              ]
            : undefined,
    ]
        .flat()
        .filter(Boolean)
        .join(" "),
);
</script>
