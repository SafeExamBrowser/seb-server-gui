<template>
    <BasicPage
        :title="$t('titles.connectionConfigurationViewAndEdit')"
        :bread-crumb="[
            {
                label: $t('titles.connectionConfigurations'),
                link: { name: '/(app)/connection-configuration/' },
            },
            {
                label:
                    config?.name ??
                    $t('titles.connectionConfigurationViewAndEdit'),
            },
        ]"
        data-testid="editConnectionConfiguration-page"
    >
        <template #SubNav>
            <SettingsNavigation />
        </template>

        <template #PanelMain>
            <LoadingFallbackComponent
                :loading="loading"
                :errors="fetchError ? [fetchError] : []"
            >
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
                            data-testid="editConnectionConfiguration-fallback-row"
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
    </BasicPage>
</template>

<script setup lang="ts">
import moment from "moment-timezone";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import BasicPage from "@/components/layout/pages/BasicPage.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import FormDialog from "@/components/widgets/formDialog/FormDialog.vue";
import HintText from "@/components/widgets/HintText.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import { useDirtyTracking } from "@/composables/useDirtyTracking.ts";
import {
    connectionConfigurationCreateSchema,
    type ConnectionConfigurationEditRequest,
} from "@/models/connectionConfiguration.ts";
import { useCertificateCreateForm } from "@/pages/(app)/certificate/composables/useCertificateCreateForm.ts";
import { CertKey } from "@/pages/(app)/certificate/types/types.ts";
import { useConnectionConfigurationQuery } from "@/pages/(app)/connection-configuration/api/useConnectionConfigurationQuery.ts";
import { useEditConnectionConfigurationMutation } from "@/pages/(app)/connection-configuration/api/useEditConnectionConfigurationMutation.ts";
import { useCertificates } from "@/pages/(app)/connection-configuration/composables/api/useCertificates.ts";
import { useConnectionConfigurationFormFields } from "@/pages/(app)/connection-configuration/composables/useConnectionConfigurationFormFields.ts";
import { applyBackendFieldErrors } from "@/services/errors/formErrorMapping.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

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

const id = computed(() => {
    const value = route.params.id;
    return typeof value === "string" ? value : undefined;
});
const {
    data: config,
    isPending: loading,
    error: fetchQueryError,
} = useConnectionConfigurationQuery(id);
const fetchError = computed(() => toAppErrorOrUndefined(fetchQueryError.value));

const { mutateAsync: save, error: saveMutationError } =
    useEditConnectionConfigurationMutation();
const saveError = computed(() =>
    toAppErrorOrUndefined(saveMutationError.value),
);

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
    ms !== undefined ? Math.round(Number(ms) / 1000) : undefined;
const toMs = (s: number) => Math.round(Number(s) * 1000);

watch(
    config,
    (fetched) => {
        if (!fetched) return;
        name.value = fetched.name;
        configurationPurpose.value = fetched.sebConfigPurpose;
        pingInterval.value = toSeconds(fetched.sebServerPingTime) ?? 1;
        asymmetricOnlyEncryption.value = Boolean(fetched.cert_encryption_asym);
        encryptWithCertificate.value = fetched.cert_alias || undefined;
        // The read model no longer carries the write-only password values (they
        // come back only as { empty } indicators), so start the inputs empty.
        configurationPassword.value = "";
        confirmConfigurationPassword.value = "";

        withFallback.value = Boolean(fetched.sebServerFallback);
        fallbackStartUrl.value = fetched.startURL || undefined;
        connectionAttempts.value = fetched.sebServerFallbackAttempts || 5;
        interval.value =
            toSeconds(fetched.sebServerFallbackAttemptInterval) ?? 2;
        connectionTimeout.value =
            toSeconds(fetched.sebServerFallbackTimeout) ?? 30;
        fallbackPassword.value = "";
        confirmFallbackPassword.value = "";
        quitPassword.value = "";
        confirmQuitPassword.value = "";

        snapshot();
    },
    { immediate: true },
);

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

const CONNECTION_CONFIG_FIELD_ALIASES = {
    sebConfigPurpose: "configurationPurpose",
    confirm_encrypt_secret: "confirmConfigurationPassword",
    startURL: "fallbackStartUrl",
    sebServerFallbackAttemptInterval: "interval",
    sebServerFallbackAttempts: "connectionAttempts",
    sebServerFallbackTimeout: "connectionTimeout",
    sebServerFallbackPasswordHashConfirm: "confirmFallbackPassword",
    hashedQuitPasswordConfirm: "confirmQuitPassword",
};

async function submit() {
    const mainResult = await mainFormRef.value?.validate();
    if (!mainResult?.valid || !config.value) return;

    if (withFallback.value) {
        const fallbackResult = await fallbackFormRef.value?.validate();
        if (!fallbackResult?.valid) return;
    }

    const purpose =
        connectionConfigurationCreateSchema.shape.sebConfigPurpose.safeParse(
            configurationPurpose.value,
        );
    if (!purpose.success) {
        return;
    }

    const par: ConnectionConfigurationEditRequest = {
        id: config.value.id,
        institutionId: config.value.institutionId,
        name: name.value ?? "",
        sebConfigPurpose: purpose.data,
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

    const saved = await submitWithFormErrors({
        run: () => save(par),
        applyErrors: (err) =>
            applyBackendFieldErrors(err, {
                aliases: CONNECTION_CONFIG_FIELD_ALIASES,
                forms: [
                    {
                        form: mainFormRef.value,
                        fields: mainFormFields.value.map((field) => field.name),
                    },
                    {
                        form: fallbackFormRef.value,
                        fields: fallbackFormFields.value.map(
                            (field) => field.name,
                        ),
                    },
                ],
            }),
        error: saveError,
        contextLabel: "connectionconfiguration",
    });
    if (!saved) return;
    await router.push({ name: "/(app)/connection-configuration/" });
}
</script>
