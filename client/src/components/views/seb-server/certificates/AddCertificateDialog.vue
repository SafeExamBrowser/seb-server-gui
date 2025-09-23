<template>
    <v-dialog
        v-model="internalOpen"
        data-testid="certificates-add-dialog"
        max-width="720"
        @update:model-value="onToggle"
    >
        <v-card data-testid="certificates-addDialog-card">
            <v-card-title
                class="text-h6 font-weight-bold"
                data-testid="certificates-addDialog-title"
            >
                {{
                    translate(
                        "certificates.certificateDialog.uploadCertificate",
                    )
                }}
            </v-card-title>

            <v-card-text data-testid="certificates-addDialog-body">
                <div
                    class="text-body-2 text-grey-darken-1 mb-4"
                    data-testid="certificates-addDialog-help"
                >
                    {{
                        translate(
                            "certificates.certificateDialog.uploadCertificateHelp",
                        )
                    }}
                </div>

                <!-- Drag & Drop Zone -->
                <v-sheet
                    class="d-flex flex-column align-center justify-center pa-8 mb-4 upload-dropzone"
                    :class="{ 'upload-dropzone--active': dragActive }"
                    data-testid="certificates-addDialog-dropzone"
                    elevation="1"
                    @dragleave.prevent="onDragLeave"
                    @dragover.prevent="onDragOver"
                    @drop.prevent="onDrop"
                >
                    <v-icon
                        class="mb-3"
                        data-testid="certificates-addDialog-dropzone-icon"
                        size="48"
                    >
                        mdi-file-certificate-outline
                    </v-icon>

                    <div
                        class="text-subtitle-2 mb-2"
                        data-testid="certificates-addDialog-fileLabel"
                    >
                        {{
                            selectedFileName ||
                            translate("certificates.certificateDialog.dropHere")
                        }}
                    </div>

                    <!-- Dynamic allowed extensions -->
                    <div
                        class="text-caption text-grey-darken-1 mb-4"
                        data-testid="certificates-addDialog-allowedExt"
                    >
                        {{
                            translate("certificates.certificateDialog.allowed")
                        }}: {{ acceptExtHuman }}
                    </div>

                    <v-btn
                        data-testid="certificates-addDialog-selectFile-button"
                        :disabled="uploading"
                        variant="outlined"
                        @click="triggerFilePicker"
                    >
                        {{
                            translate(
                                "certificates.certificateDialog.selectFromFolder",
                            )
                        }}
                    </v-btn>

                    <input
                        ref="fileInputRef"
                        :accept="acceptExt"
                        class="d-none"
                        data-testid="certificates-addDialog-fileInput"
                        type="file"
                        @change="onFilePicked"
                    />
                </v-sheet>

                <!-- Password -->
                <v-row
                    class="mt-5"
                    data-testid="certificates-addDialog-password-row"
                >
                    <v-col class="pt-0" cols="12" md="12">
                        <v-text-field
                            v-model="password"
                            data-testid="certificates-addDialog-password-input"
                            density="comfortable"
                            hide-details
                            :label="
                                translate(
                                    'certificates.certificateDialog.password',
                                )
                            "
                            prepend-inner-icon="mdi-lock-outline"
                            :type="passwordVisible ? 'text' : 'password'"
                            variant="outlined"
                        >
                            <template #append-inner>
                                <v-btn
                                    data-testid="certificates-addDialog-password-toggle"
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

                <v-alert
                    v-if="uploadError"
                    class="mb-2"
                    data-testid="certificates-addDialog-error-alert"
                    density="comfortable"
                    type="error"
                    variant="tonal"
                >
                    {{ uploadError }}
                </v-alert>

                <v-progress-linear
                    v-if="uploading"
                    class="mb-2"
                    data-testid="certificates-addDialog-progress"
                    height="6"
                    :model-value="uploadProgress"
                    rounded
                />
            </v-card-text>

            <v-card-actions
                class="justify-end"
                data-testid="certificates-addDialog-actions"
            >
                <v-btn
                    data-testid="certificates-addDialog-cancel-button"
                    :disabled="uploading"
                    text
                    @click="close()"
                >
                    {{ translate("general.cancelButton") }}
                </v-btn>
                <v-btn
                    color="primary"
                    data-testid="certificates-addDialog-submit-button"
                    :disabled="!selectedFile || uploading"
                    text
                    @click="doUpload"
                >
                    {{ translate("general.saveButton") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { translate } from "@/utils/generalUtils";
import * as certificateViewService from "@/services/seb-server/component-services/certificateViewService";
import { useI18n } from "vue-i18n";

const password = ref<string>("");
const passwordVisible = ref<boolean>(false);

type UploadedCert = { id: string; name: string };

const props = defineProps<{
    modelValue: boolean;
    simulate?: boolean;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", v: boolean): void;
    (e: "imported", cert: UploadedCert): void;
}>();

// UI state
const dragActive = ref(false);
const selectedFile = ref<File | null>(null);
const selectedFileName = ref<string>("");
const uploadError = ref<string>("");
const uploading = ref(false);
const uploadProgress = ref(0);
const fileInputRef = ref<HTMLInputElement | null>(null);
const { t } = useI18n();
const internalOpen = ref<boolean>(props.modelValue);
watch(
    () => props.modelValue,
    (v) => (internalOpen.value = v),
);

function onToggle(val: boolean) {
    emit("update:modelValue", val);
}

const defaultExtList = [".p12", ".pfx", ".pem", ".crt", ".cer"];
const acceptExt = defaultExtList.join(",");

const acceptExtHuman = defaultExtList.join(", ");

function triggerFilePicker() {
    fileInputRef.value?.click();
}

function extList(): string[] {
    return defaultExtList.slice();
}

function validExt(file: File) {
    const lower = file.name.toLowerCase();
    return extList().some((ext) => lower.endsWith(ext));
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
        uploadError.value = `${t("certificates.certificateDialog.onlyAllowed")}: ${acceptExtHuman}`;
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

async function doUpload() {
    if (!selectedFile.value) return;
    try {
        uploadError.value = "";
        uploading.value = true;
        uploadProgress.value = 30;
        const res = await certificateViewService.createCertificate({
            file: selectedFile.value,
            fileName: selectedFile.value.name,
            password: password.value || undefined,
        } as CreateCertificatePar);
        uploadProgress.value = 90;
        if (!res) {
            throw new Error(t("certificates.certificateDialog.uploadFailed"));
        }
        const createdName =
            res.alias || selectedFile.value.name.replace(/\.[^.]+$/i, "");
        const createdId = res.alias || createdName;
        emit("imported", { id: createdId, name: createdName });
        uploadProgress.value = 100;
        close();
    } catch (e: any) {
        // dispaly password incorrect text conditionally
        const data = e?.response?.data;

        const errObj = Array.isArray(data) ? data[0] : data;

        const details = errObj?.details || errObj?.systemMessage || e?.message;

        if (
            typeof details === "string" &&
            /keystore password was incorrect/i.test(details)
        ) {
            uploadError.value = t(
                "certificates.certificateDialog.keystorePasswordIncorrect",
            );
        } else {
            const serverMsg = errObj?.systemMessage || errObj?.message;
            uploadError.value =
                serverMsg ||
                details ||
                t("certificates.certificateDialog.uploadFailed");
        }
    } finally {
        uploading.value = false;
    }
}

watch(internalOpen, (val) => {
    if (!val) {
        resetState();
        password.value = "";
        passwordVisible.value = false;
    }
});
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
