<template>
    <BasicSettingsPage :title="$t('titles.certificates')">
        <template #ActionButton>
            <AddButton
                text="certificates.addCertificate"
                @click="certDialog = true"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <v-row class="align-start">
                    <v-col cols="12" md="5">
                        <SearchSection
                            v-model="searchInputValue"
                            search-text="certificates.filters.searchField"
                            @search="onSearch"
                            @clear="onClearSearch"
                        />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <div v-if="deleteError">
                            {{ deleteError }}
                        </div>
                        <LoadingFallbackComponent
                            :loading="false"
                            :errors="error ? [error] : []"
                        >
                            <EntityTable
                                :headers="certificatesTableHeaders"
                                :items="tableData?.content ?? []"
                                :page-count="pageCount"
                                :items-per-page="options.itemsPerPage"
                                :options="options"
                                :loading="loading || deleteLoading"
                                item-identifier-key="alias"
                                :cell-formatters="cellFormatters"
                                :actions="tableActions"
                                @update:options="loadItems"
                            />
                        </LoadingFallbackComponent>
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>

    <DeleteConfirmDialog
        v-model="deleteDialogOpen"
        translation-key-prefix="certificates"
        @confirm="confirmDelete"
    />
    <UploadDialog
        ref="uploadDialog"
        v-model="certDialog"
        name-prefix="certificates"
        icon="mdi-file-certificate-outline"
        :show-quit-password="false"
        :default-ext-list="['.p12', '.pfx', '.pem', '.crt', '.cer']"
        @upload="doUpload"
    />
</template>

<script setup lang="ts">
import { computed, ref, watch, useTemplateRef } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import SearchSection from "@/components/blocks/searches/SearchSection.vue";
import EntityTable from "@/components/blocks/entity-table/EntityTable.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import { useCertificatesTableHeaders } from "@/components/views/seb-server/certificate/certificates/composables/useCertificateTableHeaders.ts";
import { useCertificatesTableActions } from "@/components/views/seb-server/certificate/certificates/composables/useCertificatesTableActions.ts";
import { useCertificates } from "@/components/views/seb-server/certificate/certificates/api/useCertificates.ts";
import { useUrlTableState } from "@/components/blocks/entity-table/composables/useUrlTableState.ts";
import { useDeleteCertificate } from "@/components/views/seb-server/certificate/certificates/api/useDeleteCertificate.ts";
import type { CertificatesResponse } from "@/models/seb-server/certificate.ts";
import type { TableItem } from "@/components/blocks/entity-table/types.ts";
import AddButton from "@/components/widgets/AddButton.vue";
import { CreateCertificatePar } from "@/models/seb-server/certificate.ts";
import { createCertificate } from "@/services/seb-server/certificateService.ts";
import UploadDialog from "@/components/widgets/UploadDialog.vue";
import { useI18n } from "vue-i18n";

const certDialog = ref(false);
const { t } = useI18n();

async function onCertImported() {
    await loadItems();
}

const { headers: certificatesTableHeaders, cellFormatters } =
    useCertificatesTableHeaders();
const uploadDialogRef = useTemplateRef("uploadDialog");

async function doUpload() {
    if (!uploadDialogRef.value || !uploadDialogRef.value.selectedFile) return;
    try {
        uploadDialogRef.value.uploadError = "";
        uploadDialogRef.value.uploading = true;
        uploadDialogRef.value.uploadProgress = 30;
        const res = await createCertificate({
            file: uploadDialogRef.value.selectedFile,
            fileName: uploadDialogRef.value.selectedFile.name,
            password: uploadDialogRef.value.password || undefined,
        } as CreateCertificatePar);
        uploadDialogRef.value.uploadProgress = 90;
        if (!res) {
            throw new Error(t("certificates.certificateDialog.uploadFailed"));
        }
        onCertImported();
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
                "certificates.certificateDialog.keystorePasswordIncorrect",
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
                serverMsg ||
                details ||
                t("certificates.certificateDialog.uploadFailed");
        }
    } finally {
        uploadDialogRef.value.uploading = false;
    }
}

const tableData = ref<CertificatesResponse>();

const {
    searchInputValue,
    searchField,
    options,
    loadItems,
    onSearch,
    onClearSearch,
} = useUrlTableState(async () => {
    await fetchCertificates();
});

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchCertificates,
} = useCertificates(options, searchField);

watch(
    fetchedData,
    (newValue) => {
        tableData.value = newValue;
    },
    { immediate: true },
);

const pageCount = computed(() => tableData.value?.number_of_pages ?? 0);

const {
    removeCertificateFromItem,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteCertificate(tableData);

// Dialog state
const deleteTarget = ref<TableItem | null>(null);
const deleteDialogOpen = ref(false);

function openDeleteDialog(item: TableItem) {
    deleteTarget.value = item;
    deleteDialogOpen.value = true;
}

async function confirmDelete() {
    if (!deleteTarget.value) return;
    await removeCertificateFromItem(deleteTarget.value);
    deleteDialogOpen.value = false;
}

const tableActions = useCertificatesTableActions({
    onDelete: (item) => openDeleteDialog(item),
});
</script>
