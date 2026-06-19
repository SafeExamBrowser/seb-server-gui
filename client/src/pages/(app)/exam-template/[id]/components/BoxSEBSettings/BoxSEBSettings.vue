<template>
    <LoadingFallbackComponent :loading="loading">
        <ExamTemplateBox
            :title="$t('examTemplateDetail.boxes.sebSettings.title')"
        >
            <template v-if="configTemplateId !== undefined" #action>
                <FormDialog
                    icon-activator="mdi-plus-circle-outline"
                    color-activator="primary"
                    label-activator=""
                    size-activator="x-small"
                    label-activator-visible
                    :title="$t('examTemplateDetail.boxes.sebSettings.import')"
                    :label-cancel="$t('general.cancelButton')"
                    :label-submit="
                        $t('sebSettings.importDialog.confirmButtonTitle')
                    "
                    form-id="form-certificate-upload"
                    :get-form-fields="getFormFields"
                    :get-item="getEmptyItem"
                    :on-submit="handleImportSEBSettings"
                />
                <v-btn
                    color="primary"
                    variant="text"
                    density="compact"
                    :title="$t('examTemplateDetail.boxes.sebSettings.export')"
                    :aria-label="
                        $t('examTemplateDetail.boxes.sebSettings.export')
                    "
                    @click="downloadSEBLogs(configTemplateId, examTemplateName)"
                >
                    <v-icon icon="mdi-download" size="x-small" />
                </v-btn>

                <v-btn
                    color="primary"
                    variant="text"
                    density="compact"
                    :title="$t('examTemplateDetail.boxes.sebSettings.edit')"
                    :aria-label="
                        $t('examTemplateDetail.boxes.sebSettings.edit')
                    "
                    @click="editSEBSettings"
                >
                    <v-icon icon="mdi-pencil" size="x-small" />
                </v-btn>

                <v-dialog
                    v-model="sebSettingsDialog"
                    persistent
                    height="80vh"
                    max-width="1200"
                >
                    <SebSettingsDialog
                        v-if="seb_settings_context"
                        :context="seb_settings_context"
                        :active-s-e-b-client-connection="0"
                        dialog-title="examDetail.main.sebSettings"
                        @close-seb-settings-dialog="closeSebSettingsDialog"
                    >
                    </SebSettingsDialog>
                </v-dialog>
            </template>
            <p v-if="configTemplateId === undefined">
                NO CONFIG TEMPLATE APPLIED
            </p>
            <KeyValueList v-if="configTemplate" :items="info" class="pt-4" />
        </ExamTemplateBox>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { useConfigurationTemplate } from "@/pages/(app)/exam-template/[id]/composables/api/useConfigurationTemplate.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import ExamTemplateBox from "@/pages/(app)/exam-template/[id]/components/ExamTemplateBox.vue";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import { computed, ComputedRef, ref } from "vue";
import { useI18n } from "vue-i18n";
import { SEBSettingsContext } from "@/components/widgets/sebSettings/types.ts";
import SebSettingsDialog from "@/components/widgets/sebSettings/SebSettingsDialog.vue";
import * as sebSettingsService from "@/services/seb-server/sebSettingsService.ts";
import { useDownloadSEBSettings } from "@/pages/(app)/exam-template/[id]/components/BoxSEBSettings/api/useDownloadSEBSettings";
import { useSEBSettingsImportForm } from "@/pages/(app)/exam-template/create/components/stepSEBSettings/composables/useSEBSettingsImportForm";
import FormDialog from "@/components/widgets/formDialog/FormDialog.vue";

const { t } = useI18n();

const { examTemplateName, configTemplateId } = defineProps<{
    examTemplateName: string;
    configTemplateId: number;
}>();

const { data: configTemplate, loading } =
    useConfigurationTemplate(configTemplateId);

// ---- Init SEB Settings

const sebSettingsDialog = ref<boolean>(false);
const seb_settings_context: ComputedRef<SEBSettingsContext> = computed(() => {
    if (!configTemplate.value) {
        return {
            isExam: false,
            containerId: "",
            readonly: false,
            ignoreSEBService: ref<boolean>(false),
        };
    }

    return {
        isExam: false,
        containerId: configTemplate.value.id,
        readonly: false,
        ignoreSEBService: ref<boolean>(false),
    };
});

const info = computed<KeyValueItem[]>(() => {
    if (configTemplate.value) {
        const value =
            configTemplate.value.lastUpdateUserName +
            " - " +
            formatIsoToReadableDateTime(configTemplate.value.lastUpdateTime);
        return [
            {
                key: "lastModified",
                type: "basic",
                label: t("examTemplateDetail.boxes.sebSettings.modifiedby"),
                value: { type: "string", value: value },
            },
        ];
    } else {
        return [];
    }
});

// ---- Edit SEB Settings

function editSEBSettings() {
    sebSettingsDialog.value = true;
}

async function closeSebSettingsDialog(apply?: boolean) {
    sebSettingsDialog.value = false;

    if (configTemplate.value) {
        if (apply) {
            await sebSettingsService.publish(configTemplate.value.id, false);
        } else {
            await sebSettingsService.undoChanges(
                configTemplate.value.id,
                false,
            );
        }
    }
}

// ---- Download SEB Settings

const { downloadSEBLogs } = useDownloadSEBSettings();

// ---- Import SEB Settings

const importDialog = ref<boolean>(false);
async function onConfigImported() {
    importDialog.value = false;
}

const { getEmptyItem, getFormFields, handleImportSEBSettings } =
    useSEBSettingsImportForm(String(configTemplateId), {
        onSuccess: onConfigImported,
    });
</script>
