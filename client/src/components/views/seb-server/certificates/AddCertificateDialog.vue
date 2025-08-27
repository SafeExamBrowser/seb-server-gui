<template>
    <v-dialog v-model="internalOpen" max-width="720" @update:modelValue="onToggle">
        <v-card>
            <v-card-title class="text-h6 font-weight-bold">
                {{ translate('certificates.certificateDialog.uploadCertificate') }}
            </v-card-title>

            <v-card-text>
                <div class="text-body-2 text-grey-darken-1 mb-4">
                    {{ translate('certificates.certificateDialog.uploadCertificateHelp') }}
                </div>


                <!-- Drag & Drop Zone -->
                <v-sheet
                    class="d-flex flex-column align-center justify-center pa-8 mb-4 upload-dropzone"
                    :class="{ 'upload-dropzone--active': dragActive }"
                    @dragover.prevent="onDragOver"
                    @dragleave.prevent="onDragLeave"
                    @drop.prevent="onDrop"
                    elevation="1"
                >
                    <v-icon size="48" class="mb-3">mdi-file-certificate-outline</v-icon>
                    <div class="text-subtitle-2 mb-2">
                        {{ selectedFileName || translate('certificates.certificateDialog.dropHere') }}
                    </div>

                    <!-- Dynamic allowed extensions -->
                    <div class="text-caption text-grey-darken-1 mb-4">
                        {{ translate('certificates.certificateDialog.allowed') }}: {{ acceptExtHuman }}
                    </div>

                    <v-btn variant="outlined" @click="triggerFilePicker" :disabled="uploading">
                        {{ translate('certificates.certificateDialog.selectFromFolder') }}
                    </v-btn>
                    <input
                        ref="fileInputRef"
                        type="file"
                        class="d-none"
                        :accept="acceptExt"
                        @change="onFilePicked"
                    />
                </v-sheet>

                <!-- Optional: Alias + Password -->
                <v-row class="mt-5">

                    <v-col cols="12" md="12" class="pt-0">
                        <v-text-field
                            v-model="password"
                            :type="passwordVisible ? 'text' : 'password'"
                            variant="outlined"
                            density="comfortable"
                            :label="translate('certificates.certificateDialog.password')"
                            prepend-inner-icon="mdi-lock-outline"
                            hide-details
                        >
                            <template #append-inner>
                                <v-btn
                                    variant="text"
                                    density="compact"
                                    :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                    @click="passwordVisible = !passwordVisible"
                                />
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>

                <v-alert
                    v-if="uploadError"
                    type="error"
                    variant="tonal"
                    class="mb-2"
                    density="comfortable"
                >
                    {{ uploadError }}
                </v-alert>

                <v-progress-linear
                    v-if="uploading"
                    :model-value="uploadProgress"
                    height="6"
                    class="mb-2"
                    rounded
                />
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn text @click="close()" :disabled="uploading">
                    {{ translate('general.cancelButton') }}
                </v-btn>
                <v-btn color="primary" text @click="doUpload" :disabled="!selectedFile || uploading">
                    {{ translate('certificates.certificateDialog.addCertificate') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import {ref, watch, computed} from 'vue';
import {translate} from '@/utils/generalUtils';
import * as certificateViewService from '@/services/seb-server/component-services/certificateViewService';

const password = ref<string>('');
const passwordVisible = ref<boolean>(false);

const props = defineProps<{
    modelValue: boolean;
    simulate?: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    (e: 'imported', cert: UploadedCert): void;
}>();


type UploadedCert = { id: string; name: string };


// UI state
const dragActive = ref(false);
const selectedFile = ref<File | null>(null);
const selectedFileName = ref<string>('');
const uploadError = ref<string>('');
const uploading = ref(false);
const uploadProgress = ref(0);
const fileInputRef = ref<HTMLInputElement | null>(null);


const internalOpen = ref<boolean>(props.modelValue);
watch(() => props.modelValue, v => (internalOpen.value = v));

function onToggle(val: boolean) {
    emit('update:modelValue', val);
}

const defaultExtList = ['.p12', '.pfx', '.pem', '.crt', '.cer'];
const acceptExt = defaultExtList.join(',');

const acceptExtHuman = defaultExtList.join(', ');


function triggerFilePicker() {
    fileInputRef.value?.click();
}

function extList(): string[] {
    return defaultExtList.slice();
}

function validExt(file: File) {
    const lower = file.name.toLowerCase();
    return extList().some(ext => lower.endsWith(ext));
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
        uploadError.value = `${translate('certificates.certificateDialog.onlyAllowed')}: ${acceptExtHuman}`;
        selectedFile.value = null;
        selectedFileName.value = '';
        if (fileInputRef.value) fileInputRef.value.value = '';
        return;
    }
    uploadError.value = '';
    selectedFile.value = file;
    selectedFileName.value = file.name;
}

function resetState() {
    dragActive.value = false;
    selectedFile.value = null;
    selectedFileName.value = '';
    uploadError.value = '';
    uploading.value = false;
    uploadProgress.value = 0;
    if (fileInputRef.value) fileInputRef.value.value = '';
}

function close() {
    internalOpen.value = false;
    emit('update:modelValue', false);
    resetState();
}

async function doUpload() {
    if (!selectedFile.value) return;
    try {
        uploadError.value = '';
        uploading.value = true;
        uploadProgress.value = 30;
        const res = await certificateViewService.createCertificate({
            file: selectedFile.value,
            fileName: selectedFile.value.name,
            password: password.value || undefined
        } as CreateCertificatePar);
        uploadProgress.value = 90;
        if (!res) {
            throw new Error(translate('certificates.certificateDialog.uploadFailed'));
        }
        const createdName = res.alias || selectedFile.value.name.replace(/\.[^.]+$/i, '');
        const createdId = res.alias || createdName;
        emit('imported', {id: createdId, name: createdName});
        uploadProgress.value = 100;
        close();
    } catch (e: any) {
        uploadError.value = e?.message || (translate('certificates.certificateDialog.uploadFailed'));
    } finally {
        uploading.value = false;
    }
}

</script>

<style scoped>
.upload-dropzone {
    border: 1px dashed rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    transition: background 0.2s ease, border-color 0.2s ease;
}

.upload-dropzone--active {
    background: rgba(0, 0, 0, 0.03);
    border-color: rgba(0, 0, 0, 0.35);
}
</style>
