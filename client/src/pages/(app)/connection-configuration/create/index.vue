<template>
    <BasicSettingsPage
        :title="$t('titles.createConnectionConfiguration')"
        data-testid="createConnectionConfiguration-page"
    >
        <template #PanelMain>
            <HintText
                text-identifier="connectionConfigurations.hints.create"
                class="px-6 py-2"
                data-testid="createConnectionConfiguration-info-text"
            />

            <v-row class="px-6 mt-2" no-gutters>
                <v-col cols="8" class="pa-0">
                    <FormBuilder
                        ref="mainFormRef"
                        :fields="mainFormFields"
                        data-testid="createConnectionConfiguration-main-form"
                    />

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
                                    <v-icon v-if="item.value === '__UPLOAD__'">
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
                                            :on-submit="handleUploadCertificate"
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
                                data-testid="createConnectionConfiguration-noCertificates-label"
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
                        data-testid="createConnectionConfiguration-fallback-row"
                    >
                        <label
                            class="text-grey-darken-1 text-body-large ml-1"
                            data-testid="createConnectionConfiguration-fallback-label"
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

            <div class="d-flex justify-end ga-2 px-6 pb-4">
                <CancelButton
                    data-testid="createConnectionConfiguration-cancel-button"
                    text="general.cancelButton"
                    @click="
                        router.push({
                            name: '/(app)/connection-configuration/',
                        })
                    "
                />
                <ConfirmButton
                    data-testid="createConnectionConfiguration-save-button"
                    text="general.saveButton"
                    @click="submit()"
                />
            </div>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import { useConnectionConfigurationFormFields } from "@/pages/(app)/connection-configuration/composables/useConnectionConfigurationFormFields.ts";
import { useMutation } from "@/composables/useMutation.ts";
import { notify } from "@/services/notifications/notify.ts";
import { applyBackendFieldErrors } from "@/services/errors/formErrorMapping.ts";
import {
    activateConnectionConfiguration,
    createConnectionConfiguration,
} from "@/services/seb-server/connectionConfigurationService.ts";
import i18n from "@/i18n";
import { useCertificates } from "@/pages/(app)/connection-configuration/composables/api/useCertificates.ts";
import type { CreateConnectionConfigurationPar } from "@/models/seb-server/connectionConfiguration.ts";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";
import FormDialog from "@/components/widgets/formDialog/FormDialog.vue";
import { useRouter } from "vue-router";
import { useCertificateCreateForm } from "@/pages/(app)/certificate/composables/useCertificateCreateForm.ts";
import { CertKey } from "@/pages/(app)/certificate/types/types.ts";

definePage({
    meta: {
        titleKey: "titles.createConnectionConfiguration",
        pageTestId: "create-connection-configuration-page",
        isPageBlue: true,
    },
});

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
    mutateData: createConfig,
    data: createdConfig,
    error: configError,
} = useMutation(createConnectionConfiguration);

const entityLabel = i18n.global.t(
    "activateAfterCreate.entity.connectionConfiguration",
);
const {
    certificateItems,
    loading: certificatesLoading,
    loadCertificates,
    hasRealCerts,
} = useCertificates();

const mainFormRef = ref<InstanceType<typeof FormBuilder>>();
const fallbackFormRef = ref<InstanceType<typeof FormBuilder>>();

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

    if (configError.value) {
        const applied = applyBackendFieldErrors(configError.value, {
            aliases: CONNECTION_CONFIG_FIELD_ALIASES,
            forms: [
                {
                    form: mainFormRef.value,
                    fields: mainFormFields.value.map((field) => field.name),
                },
                {
                    form: fallbackFormRef.value,
                    fields: fallbackFormFields.value.map((field) => field.name),
                },
            ],
        });
        if (!applied.fullyHandled) {
            notify.serverError(applied.appError, {
                contextLabel: "connectionconfiguration",
                onlyMessages: applied.unhandledMessages,
            });
        }
        return;
    }
    if (createdConfig.value) {
        const id = createdConfig.value.id;
        const search = createdConfig.value.name;
        notify.success(
            i18n.global.t("activateAfterCreate.created", {
                entity: entityLabel,
            }),
            i18n.global.t("activateAfterCreate.createdHint"),
            {
                actionLabel: i18n.global.t(
                    "activateAfterCreate.activateButton",
                ),
                onAction: () => activateCreated(id),
            },
        );
        await router.push({
            name: "/(app)/connection-configuration/",
            query: { search },
        });
    }
}

async function activateCreated(id: number) {
    try {
        await activateConnectionConfiguration(String(id));
        notify.success(
            i18n.global.t("activateAfterCreate.success", {
                entity: entityLabel,
            }),
        );
    } catch (err) {
        notify.serverError(err, {
            contextLabel: "connectionconfiguration",
        });
    }
}
</script>
