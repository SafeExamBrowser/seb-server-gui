// TODO @anhefti @ahorner This should be refactored and broke-up into generic
components // See Issue: SEBSERV-898

<template>
    <v-dialog
        v-model="internalOpen"
        data-testid="import-dialog"
        max-width="720"
        @update:model-value="onToggle"
    >
        <v-card data-testid="importDialog-card">
            <v-card-title
                class="text-h6 font-weight-bold"
                data-testid="importDialog-title"
            >
                {{ t(namePrefix + ".upload.upload") }}
            </v-card-title>

            <v-card-text data-testid="importDialog-body">
                <div
                    class="text-body-2 text-grey-darken-1 mb-4"
                    data-testid="importDialog-help"
                >
                    {{ t(namePrefix + ".upload.uploadHelp") }}
                </div>

                <!-- Drag & Drop Zone -->
                <v-sheet
                    class="d-flex flex-column align-center justify-center pa-8 mb-4 upload-dropzone"
                    :class="{ 'upload-dropzone--active': dragActive }"
                    data-testid="importDialog-dropzone"
                    elevation="1"
                    @dragleave.prevent="onDragLeave"
                    @dragover.prevent="onDragOver"
                    @drop.prevent="onDrop"
                >
                    <v-icon
                        class="mb-3"
                        data-testid="importDialog-dropzone-icon"
                        size="48"
                    >
                        {{ icon }}
                    </v-icon>

                    <div
                        class="text-subtitle-2 mb-2"
                        data-testid="importDialog-fileLabel"
                    >
                        {{
                            selectedFileName ||
                            t(namePrefix + ".upload.dropHere")
                        }}
                    </div>

                    <!-- Dynamic allowed extensions -->
                    <div
                        class="text-caption text-grey-darken-1 mb-4"
                        data-testid="importDialog-allowedExt"
                    >
                        {{ t(namePrefix + ".upload.allowed") }}:
                        {{ acceptExtHuman }}
                    </div>

                    <v-btn
                        data-testid="importDialog-selectFile-button"
                        :disabled="uploading"
                        variant="outlined"
                        @click="triggerFilePicker"
                    >
                        {{ t(namePrefix + ".upload.selectFromFolder") }}
                    </v-btn>

                    <input
                        ref="fileInputRef"
                        :accept="acceptExt"
                        class="d-none"
                        data-testid="importDialog-fileInput"
                        type="file"
                        @change="onFilePicked"
                    />
                </v-sheet>

                <!-- Password -->
                <v-row class="mt-5" data-testid="importDialog-password-row">
                    <v-col class="pt-0" cols="12" md="12">
                        <v-text-field
                            v-model="password"
                            data-testid="importDialog-password-input"
                            density="comfortable"
                            hide-details
                            :label="t(namePrefix + '.upload.password')"
                            prepend-inner-icon="mdi-lock-outline"
                            :type="passwordVisible ? 'text' : 'password'"
                            variant="outlined"
                        >
                            <template #append-inner>
                                <v-btn
                                    data-testid="importDialog-password-toggle"
                                    density="compact"
                                    :icon="
                                        passwordVisible
                                            ? 'mdi-eye-off'
                                            : 'mdi-eye'
                                    "
                                    variant="text"
                                    @click="passwordVisible = !passwordVisible"
                                />
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>

                <!-- Quit Password -->
                <v-row
                    v-if="showQuitPassword"
                    class="mt-5"
                    data-testid="importDialog-quitPassword-row"
                >
                    <v-col class="pt-0" cols="12" md="12">
                        <v-text-field
                            v-model="quitPassword"
                            data-testid="importDialog-quitPassword-input"
                            density="comfortable"
                            hide-details
                            :label="t(namePrefix + '.upload.quitPassword')"
                            prepend-inner-icon="mdi-lock-outline"
                            :type="quitPasswordVisible ? 'text' : 'password'"
                            variant="outlined"
                        >
                            <template #append-inner>
                                <v-btn
                                    data-testid="importDialog-quitPassword-toggle"
                                    density="compact"
                                    :icon="
                                        quitPasswordVisible
                                            ? 'mdi-eye-off'
                                            : 'mdi-eye'
                                    "
                                    variant="text"
                                    @click="
                                        quitPasswordVisible =
                                            !quitPasswordVisible
                                    "
                                />
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>

                <v-alert
                    v-if="uploadError"
                    class="mb-2"
                    data-testid="importDialog-error-alert"
                    density="comfortable"
                    type="error"
                    variant="tonal"
                >
                    {{ uploadError }}
                </v-alert>

                <v-progress-linear
                    v-if="uploading"
                    class="mb-2"
                    data-testid="importDialog-progress"
                    height="6"
                    :model-value="uploadProgress"
                    rounded
                />
            </v-card-text>

            <v-card-actions
                class="justify-end"
                data-testid="importDialog-actions"
            >
                <v-btn
                    data-testid="importDialog-cancel-button"
                    :disabled="uploading"
                    variant="text"
                    @click="close()"
                >
                    {{ t("general.cancelButton") }}
                </v-btn>
                <v-btn
                    color="primary"
                    data-testid="importDialog-submit-button"
                    :disabled="!selectedFile || uploading"
                    variant="text"
                    @click="doUpload"
                >
                    {{ t(namePrefix + ".upload.importButton") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { SEBSettingsImport } from "@/models/seb-server/configurationNode";
import { importSEBSettings } from "@/services/seb-server/configurationNodeService";
import { CreateCertificatePar } from "@/models/seb-server/certificate.ts";
import { createCertificate } from "@/services/seb-server/certificateService.ts";

const { t } = useI18n();

const password = ref<string>("");
const passwordVisible = ref<boolean>(false);

const quitPassword = ref<string>("");
const quitPasswordVisible = ref<boolean>(false);

const props = defineProps<{
    modelValue: boolean;
    namePrefix: string;
    showQuitPassword: boolean;
    icon: string;
    defaultExtList: string[];
    sebSettingsId: string | null;
}>();

type UploadedResult = { id: string; name: string };

const emit = defineEmits<{
    (e: "update:modelValue", v: boolean): void;
    (e: "uploaded", result: UploadedResult): void;
}>();

// UI state
const dragActive = ref(false);
const selectedFile = ref<File | null>(null);
const selectedFileName = ref<string>("");
const uploadError = ref<string>("");
const uploading = ref(false);
const uploadProgress = ref(0);
const fileInputRef = ref<HTMLInputElement | null>(null);
const internalOpen = ref<boolean>(props.modelValue);
watch(
    () => props.modelValue,
    (v) => (internalOpen.value = v),
);

// defineExpose({
//     password,
//     quitPassword,
//     selectedFile,
//     uploadError,
//     uploading,
//     uploadProgress,
// });

function onToggle(val: boolean) {
    emit("update:modelValue", val);
}

//const defaultExtList = [".seb"];
const acceptExt = props.defaultExtList.join(",");
const acceptExtHuman = props.defaultExtList.join(", ");

function triggerFilePicker() {
    fileInputRef.value?.click();
}

function validExt(file: File) {
    const lower = file.name.toLowerCase();
    return props.defaultExtList.some((ext) => lower.endsWith(ext));
}

function onFilePicked(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0] || null;
    setFile(file);
}

function onDragOver() {
    dragActive.value = true;
}

function onDragLeave() {
    dragActive.value = false;
}

function onDrop(e: DragEvent) {
    dragActive.value = false;
    const file = e.dataTransfer?.files?.[0] || null;
    setFile(file);
}

function setFile(file: File | null) {
    if (!file) return;
    if (!validExt(file)) {
        uploadError.value = `${t("sebSettings.upload.onlyAllowed")}: ${acceptExtHuman}`;
        selectedFile.value = null;
        selectedFileName.value = "";
        if (fileInputRef.value) fileInputRef.value.value = "";
        return;
    }
    uploadError.value = "";
    selectedFile.value = file;
    selectedFileName.value = file.name;
}

function resetState() {
    dragActive.value = false;
    selectedFile.value = null;
    selectedFileName.value = "";
    uploadError.value = "";
    uploading.value = false;
    uploadProgress.value = 0;
    if (fileInputRef.value) fileInputRef.value.value = "";
}

function close() {
    internalOpen.value = false;
    emit("update:modelValue", false);
    resetState();
}

watch(internalOpen, (val) => {
    if (!val) {
        resetState();
        password.value = "";
        passwordVisible.value = false;
    }
});

async function doUpload() {
    if (!selectedFile.value) return;

    try {
        uploadError.value = "";
        uploading.value = true;
        uploadProgress.value = 30;
        let intervalId = setInterval(() => {
            uploadProgress.value += 5;
            if (uploadProgress.value === 90) clearInterval(intervalId);
        }, 1000);

        if (props.sebSettingsId === null) {
            const res = await createCertificate({
                file: selectedFile.value,
                fileName: selectedFile.value.name,
                password: password.value || undefined,
            } as CreateCertificatePar);
            if (!res) {
                throw new Error(
                    t("certificates.certificateDialog.uploadFailed"),
                );
            }
            uploadProgress.value = 90;
            const createdName =
                res.alias || selectedFile.value.name.replace(/\.[^.]+$/i, "");
            const createdId = res.alias || createdName;
            emit("uploaded", { id: createdId, name: createdName });
        } else {
            const res = await importSEBSettings({
                file: selectedFile.value,
                fileName: selectedFile.value.name,
                configurationTemplateId: props.sebSettingsId,
                password: password.value || undefined,
                quitPassword: quitPassword.value || undefined,
            } as SEBSettingsImport);
            clearInterval(intervalId);
            if (!res) {
                throw new Error(t("sebSettings.upload.uploadFailed"));
            }
            uploadProgress.value = 90;
            emit("uploaded", { id: res.id, name: res.configurationNodeId });
        }

        uploadProgress.value = 100;
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
            uploadError.value = t("sebSettings.upload.passwordIncorrect");
        } else {
            const serverMsg =
                (typeof errObj?.systemMessage === "string"
                    ? errObj.systemMessage
                    : undefined) ??
                (typeof errObj?.message === "string"
                    ? errObj.message
                    : undefined);
            uploadError.value =
                serverMsg || details || t("sebSettings.upload.uploadFailed");
        }
    } finally {
        uploading.value = false;
    }
}
</script>

<style scoped>
.upload-dropzone {
    border: 1px dashed rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    transition:
        background 0.2s ease,
        border-color 0.2s ease;
}

.upload-dropzone--active {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.35);
}
</style>
