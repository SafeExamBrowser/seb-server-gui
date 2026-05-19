<template>
    <BasicSettingsPage
        :title="$t('titles.connectionConfigurationViewAndEdit')"
        data-testid="editConnectionConfiguration-page"
    >
        <template #PanelMain>
            <LoadingFallbackComponent :loading="loading" :errors="errors">
                <HintText
                    text-identifier="connectionConfigurations.hints.edit"
                    class="px-6 py-2"
                    data-testid="editConnectionConfiguration-info-text"
                />

                <v-row class="px-6 mt-2" no-gutters>
                    <v-col cols="8" class="pa-0">
                        <FormBuilder
                            ref="mainFormRef"
                            :fields="mainFormFields"
                            data-testid="editConnectionConfiguration-main-form"
                        />

                        <v-select
                            v-model="encryptWithCertificate"
                            data-testid="editConnectionConfiguration-encryptWithCertificate-select"
                            density="compact"
                            :disabled="certificatesLoading"
                            item-title="label"
                            item-value="value"
                            :items="certificateItems"
                            :label="
                                $t(
                                    'connectionConfigurations.fields.encryptWithCertificate.label',
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
                                            v-if="item.value === '__UPLOAD__'"
                                        >
                                            <FormDialog
                                                icon-activator="mdi-plus-circle-outline"
                                                color-activator="primary"
                                                label-activator=""
                                                size-activator="large"
                                                label-activator-visible
                                                :label-cancel="
                                                    $t('general.cancelButton')
                                                "
                                                :label-submit="
                                                    $t(
                                                        'certificates.createDialog.confirmButtonTitle',
                                                    )
                                                "
                                                form-id="form-certificate-upload"
                                                :get-form-fields="getFormFields"
                                                :get-item="getEmptyItem"
                                                :on-submit="
                                                    handleUploadCertificate
                                                "
                                            />
                                        </v-icon>
                                    </template>
                                </v-list-item>
                                <v-divider
                                    v-if="item.value === '__UPLOAD__'"
                                    class="my-1"
                                />
                            </template>

                            <template v-if="!hasRealCerts()" #append-item>
                                <div
                                    class="text-body-small text-grey-darken-1 px-4 py-2"
                                >
                                    {{
                                        $t(
                                            "connectionConfigurations.hints.noCertificatesUploadedYet",
                                        )
                                    }}
                                </div>
                            </template>
                        </v-select>

                        <v-divider class="my-4" />

                        <div
                            class="d-flex align-center justify-space-between mb-2"
                        >
                            <label
                                class="text-grey-darken-1 text-body-large ml-1"
                            >
                                {{
                                    $t(
                                        "connectionConfigurations.fields.withFallback.label",
                                    )
                                }}
                            </label>
                            <v-switch
                                v-model="withFallback"
                                :aria-label="
                                    $t(
                                        'connectionConfigurations.fields.withFallback.ariaLabel',
                                    )
                                "
                                color="primary"
                                density="compact"
                                hide-details
                                inset
                            />
                        </div>

                        <v-expand-transition>
                            <div v-if="withFallback">
                                <FormBuilder
                                    ref="fallbackFormRef"
                                    :fields="fallbackFormFields"
                                    data-testid="editConnectionConfiguration-fallback-form"
                                />
                            </div>
                        </v-expand-transition>
                    </v-col>
                </v-row>

                <div
                    v-if="config?.lastUpdateTime"
                    class="px-6 mt-4 text-body-medium text-grey-darken-1"
                >
                    {{ $t("connectionConfigurations.hints.lastUpdatedAt")
                    }}{{ formatDate(config.lastUpdateTime)
                    }}{{
                        config.lastUpdateUser
                            ? $t("connectionConfigurations.hints.by") +
                              config.lastUpdateUser
                            : ""
                    }}
                </div>

                <div class="d-flex justify-end ga-2 px-6 pb-4">
                    <CancelButton
                        data-testid="editConnectionConfiguration-cancel-button"
                        text="general.cancelButton"
                        @click="
                            router.push({
                                name: '/(app)/connection-configuration/',
                            })
                        "
                    />
                    <ConfirmButton
                        data-testid="editConnectionConfiguration-save-button"
                        text="general.saveButton"
                        :disabled="!isDirty"
                        @click="submit()"
                    />
                </div>
            </LoadingFallbackComponent>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { errorMessageOf } from "@/services/errors/toAppError.ts";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment-timezone";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";
import FormDialog from "@/components/widgets/formDialog/FormDialog.vue";
import { useMutation } from "@/composables/useMutation.ts";
import { notify } from "@/services/notifications/notify.ts";
import { useDirtyTracking } from "@/composables/useDirtyTracking.ts";
import { useConnectionConfigurationFormFields } from "@/pages/(app)/connection-configuration/composables/useConnectionConfigurationFormFields.ts";
import { useCertificates } from "@/pages/(app)/connection-configuration/composables/api/useCertificates.ts";
import {
    editConnectionConfiguration,
    getConnectionConfiguration,
} from "@/services/seb-server/connectionConfigurationService.ts";
import type {
    ConnectionConfiguration,
    UpdateConnectionConfigurationPar,
} from "@/models/seb-server/connectionConfiguration.ts";
import { useCertificateCreateForm } from "@/pages/(app)/certificate/composables/useCertificateCreateForm.ts";
import { CertKey } from "@/pages/(app)/certificate/types/types.ts";

definePage({
    meta: {
        titleKey: "titles.connectionConfigurationViewAndEdit",
        pageTestId: "edit-connection-configuration-page",
        isPageBlue: true,
    },
});

const route = useRoute("/(app)/connection-configuration/[id]/");
const router = useRouter();

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

const {
    certificateItems,
    loading: certificatesLoading,
    loadCertificates,
    hasRealCerts,
} = useCertificates();

const mainFormRef = ref<InstanceType<typeof FormBuilder>>();
const fallbackFormRef = ref<InstanceType<typeof FormBuilder>>();

const config = ref<ConnectionConfiguration>();
const fetchLoading = ref(false);
const fetchError = ref<string>();

const loading = computed(() => fetchLoading.value);
const errors = computed(() =>
    [fetchError.value].filter((e) => e !== undefined),
);

const {
    mutateData: save,
    data: saved,
    error: saveError,
} = useMutation(editConnectionConfiguration);

const { isDirty, snapshot } = useDirtyTracking(() => ({
    name: name.value ?? "",
    configurationPurpose: configurationPurpose.value ?? "",
    configurationPassword: configurationPassword.value ?? "",
    confirmConfigurationPassword: confirmConfigurationPassword.value ?? "",
    encryptWithCertificate: encryptWithCertificate.value ?? "",
    pingInterval: pingInterval.value ?? 0,
    asymmetricOnlyEncryption: asymmetricOnlyEncryption.value,
    withFallback: withFallback.value,
    fallbackStartUrl: fallbackStartUrl.value ?? "",
    connectionAttempts: connectionAttempts.value ?? 0,
    interval: interval.value ?? 0,
    connectionTimeout: connectionTimeout.value ?? 0,
    fallbackPassword: fallbackPassword.value ?? "",
    confirmFallbackPassword: confirmFallbackPassword.value ?? "",
    quitPassword: quitPassword.value ?? "",
    confirmQuitPassword: confirmQuitPassword.value ?? "",
}));

const toSeconds = (ms?: number) =>
    ms != null ? Math.round(Number(ms) / 1000) : undefined;
const toMs = (s: number) => Math.round(Number(s) * 1000);

onMounted(async () => {
    fetchLoading.value = true;
    try {
        const fetched = await getConnectionConfiguration(
            String(route.params.id),
        );
        config.value = fetched;

        name.value = fetched.name;
        configurationPurpose.value = fetched.sebConfigPurpose;
        pingInterval.value = toSeconds(fetched.sebServerPingTime) ?? 1;
        asymmetricOnlyEncryption.value = Boolean(fetched.cert_encryption_asym);
        encryptWithCertificate.value = fetched.cert_alias || undefined;
        configurationPassword.value = fetched.encryptSecret ?? "";
        confirmConfigurationPassword.value = fetched.encryptSecret ?? "";

        withFallback.value = Boolean(fetched.sebServerFallback);
        fallbackStartUrl.value = fetched.startURL || undefined;
        connectionAttempts.value = fetched.sebServerFallbackAttempts || 5;
        interval.value =
            toSeconds(fetched.sebServerFallbackAttemptInterval) ?? 2;
        connectionTimeout.value =
            toSeconds(fetched.sebServerFallbackTimeout) ?? 30;
        fallbackPassword.value = fetched.sebServerFallbackPasswordHash ?? "";
        confirmFallbackPassword.value =
            fetched.sebServerFallbackPasswordHash ?? "";
        quitPassword.value = fetched.hashedQuitPassword ?? "";
        confirmQuitPassword.value = fetched.hashedQuitPassword ?? "";

        snapshot();
    } catch (err) {
        fetchError.value = errorMessageOf(err);
    } finally {
        fetchLoading.value = false;
    }
});

function handleCertChange(val: string | undefined) {
    if (val === "__UPLOAD__") {
        encryptWithCertificate.value = undefined;
    }
}

async function onCertImported(key: CertKey) {
    await loadCertificates();
    encryptWithCertificate.value = key.name;
}

const { getEmptyItem, getFormFields, handleUploadCertificate } =
    useCertificateCreateForm({ onSuccess: onCertImported });

const formatDate = (input?: Date | string): string => {
    if (!input) return "";
    return moment(input).format("MMM D, YYYY HH:mm");
};

async function submit() {
    const mainResult = await mainFormRef.value?.validate();
    if (!mainResult?.valid || !config.value) return;

    if (withFallback.value) {
        const fallbackResult = await fallbackFormRef.value?.validate();
        if (!fallbackResult?.valid) return;
    }

    const par: UpdateConnectionConfigurationPar = {
        id: config.value.id.toString(),
        institutionId: config.value.institutionId.toString(),
        name: name.value ?? "",
        sebConfigPurpose: configurationPurpose.value ?? "",
        sebServerPingTime: toMs(pingInterval.value ?? 1),
        cert_alias: encryptWithCertificate.value || undefined,
        cert_encryption_asym: !!asymmetricOnlyEncryption.value,
        encryptSecret: (configurationPassword.value ?? "").trim() || undefined,
        confirm_encrypt_secret:
            (confirmConfigurationPassword.value ?? "").trim() || undefined,
        sebServerFallback: !!withFallback.value,
        vdiSetup: "NO",
    };

    if (withFallback.value) {
        par.startURL = (fallbackStartUrl.value ?? "").trim();
        par.sebServerFallbackAttempts = Number(connectionAttempts.value ?? 0);
        par.sebServerFallbackAttemptInterval = toMs(interval.value ?? 0);
        par.sebServerFallbackTimeout = toMs(connectionTimeout.value ?? 0);
        par.sebServerFallbackPasswordHash =
            (fallbackPassword.value ?? "").trim() || undefined;
        par.sebServerFallbackPasswordHashConfirm =
            (confirmFallbackPassword.value ?? "").trim() || undefined;
        par.hashedQuitPassword = (quitPassword.value ?? "").trim() || undefined;
        par.hashedQuitPasswordConfirm =
            (confirmQuitPassword.value ?? "").trim() || undefined;
    }

    await save(par);

    if (saved.value) {
        await router.push({ name: "/(app)/connection-configuration/" });
        return;
    }
    if (saveError.value) {
        notify.serverError(saveError.value, {
            contextLabel: "connectionconfiguration",
        });
    }
}
</script>
