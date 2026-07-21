<template>
    <v-container fluid class="ma-0 pa-0 pb-3 border-b-md">
        <v-row class="align-center mt-4 mx-6">
            <v-col class="pa-0">
                <div
                    class="d-flex align-center cursor-pointer add-button-container"
                >
                    <SectionSubtitle
                        :name="$t('createTemplateExam.steps.seb-settings.name')"
                    />
                </div>
            </v-col>
            <v-col cols="auto" class="pa-0">
                <FormDialog
                    icon-activator="mdi-plus-circle-outline"
                    color-activator="primary"
                    :label-activator="
                        $t('sebSettings.importDialog.addButtonTitle')
                    "
                    size-activator="x-large"
                    label-activator-visible
                    :label-cancel="$t('general.cancelButton')"
                    :label-submit="
                        $t('sebSettings.importDialog.confirmButtonTitle')
                    "
                    form-id="form-certificate-upload"
                    :get-form-fields="getFormFields"
                    :get-item="getEmptyItem"
                    :on-submit="handleImportSEBSettings"
                />
            </v-col>
        </v-row>
    </v-container>

    <v-card :key="reloadSettings" class="pa-5" variant="text">
        <v-row>
            <v-col>
                <SEBSettingsPanel :context="seb_settings_context" />
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref } from "vue";
import { ConfigurationTemplateKey } from "@/models/seb-server/configurationNode.ts";
import { useStepNamingStore } from "@/pages/(app)/exam-template/create/components/stepNaming/composables/store/useStepNamingStore.ts";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";
import SEBSettingsPanel from "@/components/widgets/sebSettings/components/SEBSettingsPanel.vue";
import { SEBSettingsContext } from "@/components/widgets/sebSettings/types.ts";
import { useSEBSettingsImportForm } from "@/pages/(app)/exam-template/create/components/stepSEBSettings/composables/useSEBSettingsImportForm";
import FormDialog from "@/components/widgets/formDialog/FormDialog.vue";

const configKey = defineModel<ConfigurationTemplateKey | undefined>({
    required: true,
});

const reloadSettings = ref<number>(0);

const importDialog = ref<boolean>(false);
async function onConfigImported() {
    importDialog.value = false;
    // reload seb settings
    reloadSettings.value += 1;
}

const seb_settings_context: ComputedRef<SEBSettingsContext> = computed(() => {
    if (configKey.value) {
        const stepNamingStore = useStepNamingStore();
        if (configKey.value.id) {
            stepNamingStore.configurationTemplate = configKey.value.id;
            return {
                isExam: false,
                containerId: configKey.value.id,
                readonly: false,
                ignoreSEBService: ref<boolean>(false),
            };
        }
    }
    return {
        isExam: false,
        containerId: "",
        readonly: false,
        ignoreSEBService: ref<boolean>(false),
    };
});

const { getEmptyItem, getFormFields, handleImportSEBSettings } =
    useSEBSettingsImportForm(seb_settings_context.value.containerId, {
        onSuccess: onConfigImported,
    });
</script>
