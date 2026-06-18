<template>
    <LoadingFallbackComponent :loading="loading">
        <ExamTemplateBox
            :title="$t('examTemplateDetail.boxes.sebSettings.title')"
        >
            <p v-if="configTemplateId === undefined">
                NO CONFIG TEMPLATE APPLIED
            </p>
            <template v-if="configTemplateId !== undefined" #action>
                <v-btn
                    class="text-none"
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

            <KeyValueList v-if="configTemplate" :items="info" class="pt-4" />
        </ExamTemplateBox>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { useConfigurationTemplate } from "@/pages/(app)/exam-template/[id]/composables/api/useConfigurationTemplate.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import ExamTemplateBox from "./ExamTemplateBox.vue";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import { computed, ComputedRef, ref } from "vue";
import { useI18n } from "vue-i18n";
import { SEBSettingsContext } from "@/components/widgets/sebSettings/types.ts";
import SebSettingsDialog from "@/components/widgets/sebSettings/SebSettingsDialog.vue";
import * as sebSettingsService from "@/services/seb-server/sebSettingsService.ts";

const { t } = useI18n();

const { configTemplateId } = defineProps<{
    examTemplateId: number;
    configTemplateId: number | undefined;
}>();

const { data: configTemplate, loading } =
    useConfigurationTemplate(configTemplateId);

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

const sebSettingsDialog = ref<boolean>(false);
const seb_settings_context: ComputedRef<SEBSettingsContext | undefined> =
    computed(() => {
        if (!configTemplate.value) {
            return undefined;
        }

        return {
            isExam: false,
            containerId: configTemplate.value.id,
            readonly: false,
            ignoreSEBService: ref<boolean>(false),
        };
    });

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
</script>
