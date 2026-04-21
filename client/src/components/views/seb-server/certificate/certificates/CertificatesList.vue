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
                        <div v-if="error">
                            {{ error }}
                        </div>

                        <div v-else-if="deleteError">
                            {{ deleteError }}
                        </div>

                        <EntityTable
                            :headers="certificatesTableHeaders"
                            :items="tableData?.content ?? []"
                            :total-items="totalItems"
                            :page-count="pageCount"
                            :items-per-page="options.itemsPerPage"
                            :options="options"
                            :loading="loading || deleteLoading"
                            item-identifier-key="alias"
                            translation-key-prefix="certificates"
                            :cell-formatters="cellFormatters"
                            :editable="false"
                            :status-changeable="false"
                            @update:options="loadItems"
                            @delete="removeCertificateFromItem"
                        />
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>

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
import { useCertificatesTableHeaders } from "@/components/views/seb-server/certificate/certificates/composables/useCertificateTableHeaders.ts";
import { useCertificates } from "@/components/views/seb-server/certificate/certificates/api/useCertificates.ts";
import { useUrlTableState } from "@/components/blocks/entity-table/composables/useUrlTableState.ts";
import { useDeleteCertificate } from "@/components/views/seb-server/certificate/certificates/api/useDeleteCertificate.ts";
import { useTableCellFormatters } from "@/components/blocks/entity-table/composables/useTableCellFormatters.ts";
import type { CertificatesResponse } from "@/models/seb-server/certificate.ts";
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

const certificatesTableHeaders = useCertificatesTableHeaders();

const tableData = ref<CertificatesResponse>();

const {
    searchInputValue,
    searchField,
    options,
    totalItems,
    loadItems,
    onSearch,
    onClearSearch,
} = useUrlTableState(tableData, async () => {
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

const { cellFormatters } = useTableCellFormatters({
    headers: certificatesTableHeaders,
});
</script>
