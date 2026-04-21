<template>
    <v-container class="ma-0 pa-0 pb-3 border-b-md">
        <v-row>
            <v-col>
                <div
                    class="d-flex align-center mx-6 mt-6 cursor-pointer add-button-container"
                >
                    <SectionSubtitle
                        :name="$t('createTemplateExam.steps.seb-settings.name')"
                    />
                </div>
            </v-col>
            <v-col cols="auto">
                <AddButton text="" @click="importDialog = true" />
            </v-col>
        </v-row>
    </v-container>

    <v-card
        :key="reloadSettings"
        :params="init_store"
        class="pa-5"
        variant="text"
    >
        <v-row>
            <v-col>
                <SEBSettingsPanel />
            </v-col>
        </v-row>
    </v-card>

    <!-----------import dialog ---------->
    <UploadDialog
        ref="uploadDialog"
        v-model="importDialog"
        name-prefix="sebSettings"
        icon="mdi-file-upload-outline"
        :show-quit-password="true"
        :default-ext-list="['.seb']"
        @upload="doUpload"
    />
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { ConfigurationTemplateKey } from "@/models/seb-server/configurationNode";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { useStepNamingStore } from "@/components/views/seb-server/exam-template/wizard/components/stepNaming/composables/store/useStepNamingStore";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";
import AddButton from "@/components/widgets/AddButton.vue";
import SEBSettingsPanel from "@/components/views/seb-server/settings/composables/SEBSettingsPanel.vue";
import UploadDialog from "@/components/widgets/UploadDialog.vue";
import { SEBSettingsImport } from "@/models/seb-server/configurationNode";
import { importSEBSettings } from "@/services/seb-server/configurationNodeService";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const uploadDialogRef = useTemplateRef("uploadDialog");

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

const init_store = computed(() => {
    if (configKey.value) {
        const sebSettingsStore = useSEBSettingsStore();
        const stepNamingStore = useStepNamingStore();

        if (sebSettingsStore.selectedContainerId == null) {
            sebSettingsStore.isExam = false;
            sebSettingsStore.readonly = false;
            if (configKey.value.id) {
                sebSettingsStore.selectedContainerId = parseInt(
                    configKey.value.id,
                );
                stepNamingStore.configurationTemplate = configKey.value.id;
            }
        }

        return true;
    }
    return false;
});

async function doUpload() {
    if (!uploadDialogRef.value || !uploadDialogRef.value.selectedFile) return;

    try {
        const sebSettingsStore = useSEBSettingsStore();

        uploadDialogRef.value.uploadError = "";
        uploadDialogRef.value.uploading = true;
        uploadDialogRef.value.uploadProgress = 30;
        let intervalId = setInterval(() => {
            if (uploadDialogRef.value == null) return;
            uploadDialogRef.value.uploadProgress += 5;
            if (uploadDialogRef.value.uploadProgress === 90)
                clearInterval(intervalId);
        }, 1000);
        const res = await importSEBSettings({
            file: uploadDialogRef.value.selectedFile,
            fileName: uploadDialogRef.value.selectedFile.name,
            configurationTemplateId:
                sebSettingsStore.selectedContainerId?.toString(),
            password: uploadDialogRef.value.password || undefined,
            quitPassword: uploadDialogRef.value.quitPassword || undefined,
        } as SEBSettingsImport);
        clearInterval(intervalId);
        uploadDialogRef.value.uploadProgress = 90;
        if (!res) {
            throw new Error(t("sebSettings.upload.uploadFailed"));
        }

        onConfigImported();
        uploadDialogRef.value.uploadProgress = 100;
        close();
    } catch (e: unknown) {
        const respData = (e as { response?: { data?: unknown } }).response
            ?.data;
        type DataObj = Record<string, unknown>;
        const errObj: DataObj | undefined = Array.isArray(respData)
            ? (respData[0] as DataObj)
            : (respData as DataObj | undefined);

        const details =
            (typeof errObj?.details === "string"
                ? errObj.details
                : undefined) ??
            (typeof errObj?.systemMessage === "string"
                ? errObj.systemMessage
                : undefined) ??
            (e instanceof Error ? e.message : undefined);

        if (
            typeof details === "string" &&
            /keystore password was incorrect/i.test(details)
        ) {
            uploadDialogRef.value.uploadError = t(
                "sebSettings.upload.passwordIncorrect",
            );
        } else {
            const serverMsg =
                (typeof errObj?.systemMessage === "string"
                    ? errObj.systemMessage
                    : undefined) ??
                (typeof errObj?.message === "string"
                    ? errObj.message
                    : undefined);
            uploadDialogRef.value.uploadError =
                serverMsg || details || t("sebSettings.upload.uploadFailed");
        }
    } finally {
        uploadDialogRef.value.uploading = false;
    }
}
</script>
