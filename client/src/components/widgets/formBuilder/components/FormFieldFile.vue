<template>
    <v-file-input
        v-model="model"
        v-bind="standardProperties"
        :rules="allValidationRules"
        :accept="acceptExtensions.join(',')"
        :prepend-icon="icon"
        clearable
        show-size
    />
</template>

<script setup lang="ts">
import { FormFieldBaseProperties } from "../types";
import { computed } from "vue";
import i18n from "@/i18n";

const model = defineModel<File | undefined>();

const props = defineProps<{
    standardProperties: FormFieldBaseProperties;
    acceptExtensions: string[];
    icon?: string;
    clearable: boolean;
}>();

const normalizedAcceptExtensions = computed(() =>
    props.acceptExtensions.map((ext) =>
        ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`,
    ),
);

const allValidationRules = computed(() => [
    ...(props.standardProperties.rules ?? []),
    ...(props.acceptExtensions.length > 0
        ? [
              (file: File | undefined) => {
                  if (!file) {
                      return true;
                  }

                  const hasAllowedExtension =
                      normalizedAcceptExtensions.value.some((ext) =>
                          file.name.toLowerCase().endsWith(ext),
                      );

                  if (!hasAllowedExtension) {
                      return i18n.global.t(
                          "general.validation.fileExtensions",
                          {
                              extensions:
                                  normalizedAcceptExtensions.value.join(", "),
                          },
                      );
                  }

                  return true;
              },
          ]
        : []),
]);
</script>
