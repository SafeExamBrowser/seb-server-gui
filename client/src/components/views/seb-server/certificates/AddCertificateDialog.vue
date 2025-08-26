<template>
    <v-dialog v-model="internalOpen" max-width="720" @update:modelValue="onToggle">
        <v-card>
            <v-card-title class="text-h6 font-weight-bold">
                {{ translate('certificates.certificateDialog.uploadCertificate') || 'Upload Certificate (.pfx)' }}
            </v-card-title>

            <v-card-text>
                <div class="text-body-2 text-grey-darken-1 mb-4">
                    {{ translate('certificates.certificateDialog.uploadCertificateHelp') || 'Drag & drop a .pfx file here or choose one from your computer.' }}
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
                    <div class="text-subtitle-2 mb-2">{{ selectedFileName || 'Drop .pfx file here' }}</div>
                    <div class="text-caption text-grey-darken-1 mb-4">.pfx only</div>

                    <v-btn variant="outlined" @click="triggerFilePicker" :disabled="uploading">
                        {{ translate('certificates.certificateDialog.selectFromFolder') || 'Choose file' }}
                    </v-btn>
                    <input
                        ref="fileInputRef"
                        type="file"
                        class="d-none"
                        accept=".pfx"
                        @change="onFilePicked"
                    />
                </v-sheet>

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
                    {{ translate('certificates.certificateDialog.import') || 'Upload' }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { translate } from '@/utils/generalUtils';

type UploadedCert = { id: string; name: string };

const props = defineProps<{
    modelValue: boolean;         // v-model for open/close
    acceptExt?: string;          // default ".pfx"
    simulate?: boolean;          // keep a mock mode default true
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', v: boolean): void;
    (e: 'imported', cert: UploadedCert): void; // parent will receive newly created cert meta
}>();

const internalOpen = ref<boolean>(props.modelValue);
watch(() => props.modelValue, v => (internalOpen.value = v));

function onToggle(val: boolean) {
    emit('update:modelValue', val);
}

const acceptExt = computed(() => props.acceptExt ?? '.pfx');

// UI state (encapsulated here)
const dragActive = ref(false);
const selectedFile = ref<File | null>(null);
const selectedFileName = ref<string>('');
const uploadError = ref<string>('');
const uploading = ref(false);
const uploadProgress = ref(0);
const fileInputRef = ref<HTMLInputElement | null>(null);

function triggerFilePicker() {
    fileInputRef.value?.click();
}

function validExt(file: File) {
    const exts = acceptExt.value.split(',').map(e => e.trim().toLowerCase());
    return exts.some(ext => new RegExp(`${ext}$`, 'i').test(file.name));
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
        uploadError.value = `Only ${acceptExt.value} files are allowed.`;
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

    // If you later wire a real API, replace this block with the real request.
    const useMock = props.simulate ?? true;

    if (useMock) {
        await mockUpload();
        return;
    }

    // --- Real API sketch (replace as needed) ---
    // uploading.value = true;
    // uploadProgress.value = 0;
    // try {
    //   const form = new FormData();
    //   form.append('file', selectedFile.value);
    //   const res = await fetch('/api/certificates', { method: 'POST', body: form });
    //   if (!res.ok) throw new Error('Upload failed');
    //   const data = await res.json(); // { id, name }
    //   emit('imported', { id: data.id, name: data.name });
    //   close();
    // } catch (e: any) {
    //   uploadError.value = e?.message || 'Upload failed';
    // } finally {
    //   uploading.value = false;
    // }
}

async function mockUpload() {
    uploading.value = true;
    uploadProgress.value = 0;

    const steps = 8;
    for (let i = 1; i <= steps; i++) {
        await new Promise(r => setTimeout(r, 120));
        uploadProgress.value = Math.round((i / steps) * 100);
    }

    const created = {
        id: `cert_${Math.random().toString(36).slice(2, 8)}`,
        name: selectedFile.value!.name.replace(/\.[^.]+$/i, ''),
    };

    emit('imported', created);
    uploading.value = false;
    close();
}
</script>

<style scoped>
.upload-dropzone {
    border: 1px dashed rgba(0,0,0,0.2);
    border-radius: 12px;
    transition: background 0.2s ease, border-color 0.2s ease;
}
.upload-dropzone--active {
    background: rgba(0,0,0,0.03);
    border-color: rgba(0,0,0,0.35);
}
</style>
