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
                    @click="emit('upload')"
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
}>();

const emit = defineEmits<{
    (e: "update:modelValue", v: boolean): void;
    (e: "upload"): void;
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

defineExpose({
    password,
    quitPassword,
    selectedFile,
    uploadError,
    uploading,
    uploadProgress,
});

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
