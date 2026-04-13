<template>
    <BasicSettingsPage
        :title="$t('titles.createConnectionConfiguration')"
        data-testid="createConnectionConfiguration-page"
    >
        <template #PanelMain>
            <HintText
                text-identifier="connectionConfigurations.createConnectionConfigurationPage.info.createConnectionConfigurationInfo"
                class="px-6 py-2"
                data-testid="createConnectionConfiguration-info-text"
            />

            <v-row class="px-6 mt-2">
                <v-col cols="8">
                    <FormBuilder
                        ref="mainFormRef"
                        :fields="mainFormFields"
                        data-testid="createConnectionConfiguration-main-form"
                    />

                    <!-- Encrypt with certificate (custom select with upload) -->
                    <v-select
                        v-model="encryptWithCertificate"
                        data-testid="createConnectionConfiguration-encryptWithCertificate-select"
                        density="compact"
                        :disabled="certificatesLoading"
                        item-title="label"
                        item-value="value"
                        :items="certificateItems"
                        :label="
                            $t(
                                'connectionConfigurations.createConnectionConfigurationPage.labels.encryptWithCertificate',
                            )
                        "
                        :loading="certificatesLoading"
                        :menu-props="{ maxHeight: 240 }"
                        variant="outlined"
                        @update:model-value="handleCertChange"
                    >
                        <template #item="{ props, item }">
                            <v-list-item v-bind="props">
                                <template #prepend>
                                    <v-icon
                                        v-if="item.raw.value === '__UPLOAD__'"
                                        >mdi-upload</v-icon
                                    >
                                </template>
                            </v-list-item>
                            <v-divider
                                v-if="item.raw.value === '__UPLOAD__'"
                                class="my-1"
                            />
                        </template>

                        <template v-if="!hasRealCerts()" #append-item>
                            <div
                                class="text-caption text-grey-darken-1 px-4 py-2"
                                data-testid="createConnectionConfiguration-noCertificates-label"
                            >
                                {{
                                    $t(
                                        "connectionConfigurations.createConnectionConfigurationPage.labels.noCertificatesUploadedYet",
                                    )
                                }}
                            </div>
                        </template>
                    </v-select>

                    <v-divider class="my-4" />

                    <!-- Fallback toggle -->
                    <div
                        class="d-flex align-center justify-space-between mb-2"
                        data-testid="createConnectionConfiguration-fallback-row"
                    >
                        <label
                            class="text-grey-darken-1 text-body-1 ml-1"
                            data-testid="createConnectionConfiguration-fallback-label"
                        >
                            {{
                                $t(
                                    "connectionConfigurations.createConnectionConfigurationPage.labels.withFallback",
                                )
                            }}
                        </label>
                        <v-switch
                            v-model="withFallback"
                            :aria-label="
                                $t(
                                    'connectionConfigurations.createConnectionConfigurationPage.labels.withFallbackArea',
                                )
                            "
                            color="primary"
                            data-testid="createConnectionConfiguration-fallback-switch"
                            density="compact"
                            hide-details
                            inset
                        />
                    </div>

                    <v-expand-transition>
                        <div
                            v-if="withFallback"
                            data-testid="createConnectionConfiguration-fallback-fields"
                        >
                            <FormBuilder
                                ref="fallbackFormRef"
                                :fields="fallbackFormFields"
                                data-testid="createConnectionConfiguration-fallback-form"
                            />
                        </div>
                    </v-expand-transition>
                </v-col>
            </v-row>

            <!-- Action buttons -->
            <v-row class="px-6 pb-4">
                <v-col class="d-flex justify-end pa-0 ga-2">
                    <CancelButton
                        data-testid="createConnectionConfiguration-cancel-button"
                        text="general.cancelButton"
                        @click="
                            navigateToRoute({
                                name: 'ConnectionConfigurationList',
                            })
                        "
                    />
                    <ConfirmButton
                        data-testid="createConnectionConfiguration-save-button"
                        text="general.saveButton"
                        @click="submit()"
                    />
                </v-col>
            </v-row>
        </template>
    </BasicSettingsPage>

    <!-- Upload Certificate Dialog -->
    <AddCertificateDialog v-model="certDialog" @imported="onCertImported" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import { navigateToRoute } from "@/router/navigation.ts";
import { useConnectionConfigurationFormFields } from "./composable/useConnectionConfigurationFormFields.ts";
import { useMutation } from "@/composables/useMutation.ts";
import { createConnectionConfiguration } from "@/services/seb-server/connectionConfigurationService.ts";
import { useCertificates } from "./composable/api/useCertificates.ts";
import type { CreateConnectionConfigurationPar } from "@/models/seb-server/connectionConfiguration.ts";
import AddCertificateDialog from "@/components/views/seb-server/certificate/certificates/AddCertificateDialog.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";

const {
    mainFormFields,
    fallbackFormFields,
    name,
    configurationPurpose,
    configurationPassword,
    confirmConfigurationPassword,
    encryptWithCertificate,
    pingInterval,
    asymmetricOnlyEncryption,
    withFallback,
    fallbackStartUrl,
    connectionAttempts,
    interval,
    connectionTimeout,
    fallbackPassword,
    confirmFallbackPassword,
    quitPassword,
    confirmQuitPassword,
} = useConnectionConfigurationFormFields();

const { mutateData: createConfig, error: configError } = useMutation(
    createConnectionConfiguration,
);
const {
    certificateItems,
    loading: certificatesLoading,
    loadCertificates,
    hasRealCerts,
} = useCertificates();

const mainFormRef = ref<InstanceType<typeof FormBuilder>>();
const fallbackFormRef = ref<InstanceType<typeof FormBuilder>>();

const certDialog = ref(false);

function handleCertChange(val: string | undefined) {
    if (val === "__UPLOAD__") {
        certDialog.value = true;
        encryptWithCertificate.value = undefined;
    }
}

async function onCertImported(created: { id: string; name: string }) {
    await loadCertificates();
    encryptWithCertificate.value = created.name;
}

async function submit() {
    const mainResult = await mainFormRef.value?.validate();

    if (!mainResult?.valid) return;

    if (withFallback.value) {
        const fallbackResult = await fallbackFormRef.value?.validate();
        if (!fallbackResult?.valid) return;
    }

    const selectedPurpose = configurationPurpose.value;
    const selectedPingInterval = pingInterval.value;

    if (!selectedPurpose || selectedPingInterval == null) return;

    const toMs = (s: number) => Math.round(Number(s) * 1000);

    const params: CreateConnectionConfigurationPar = {
        name: name.value ?? "",
        sebConfigPurpose: selectedPurpose,
        sebServerPingTime: toMs(selectedPingInterval),
        cert_alias: encryptWithCertificate.value || undefined,
        encryptSecret: (configurationPassword.value ?? "").trim() || undefined,
        confirm_encrypt_secret:
            (confirmConfigurationPassword.value ?? "").trim() || undefined,
        cert_encryption_asym: !!asymmetricOnlyEncryption.value,
        sebServerFallback: !!withFallback.value,
        vdiSetup: "NO",
    };

    if (withFallback.value) {
        const selectedFallbackStartUrl = fallbackStartUrl.value;
        const selectedConnectionAttempts = connectionAttempts.value;
        const selectedInterval = interval.value;
        const selectedConnectionTimeout = connectionTimeout.value;

        if (
            !selectedFallbackStartUrl ||
            selectedConnectionAttempts == null ||
            selectedInterval == null ||
            selectedConnectionTimeout == null
        ) {
            return;
        }

        params.startURL = selectedFallbackStartUrl.trim();
        params.sebServerFallbackAttemptInterval = toMs(selectedInterval);
        params.sebServerFallbackAttempts = Number(selectedConnectionAttempts);
        params.sebServerFallbackTimeout = toMs(selectedConnectionTimeout);
        params.sebServerFallbackPasswordHash =
            (fallbackPassword.value ?? "").trim() || undefined;
        params.sebServerFallbackPasswordHashConfirm =
            (confirmFallbackPassword.value ?? "").trim() || undefined;
        params.hashedQuitPassword =
            (quitPassword.value ?? "").trim() || undefined;
        params.hashedQuitPasswordConfirm =
            (confirmQuitPassword.value ?? "").trim() || undefined;
    }

    await createConfig(params);

    if (!configError.value) {
        navigateToRoute({ name: "ConnectionConfigurationList" });
    }
}
</script>
