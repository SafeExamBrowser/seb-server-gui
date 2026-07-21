<template>
    <BasicPage
        :title="title"
        :bread-crumb="breadCrumb"
        :data-testid="`${dataTestPrefix}-page`"
    >
        <template #SubNav>
            <SettingsNavigation />
        </template>

        <template #PanelMain>
            <HintText
                :text-identifier="`assessmentToolConnections.hints.${mode}`"
                class="px-6 py-2"
                :data-testid="`${dataTestPrefix}-info-text`"
            />

            <v-row class="px-6 mt-2" no-gutters>
                <v-col cols="8" class="pa-0">
                    <LoadingFallbackComponent
                        :loading="loading"
                        :errors="errors"
                    >
                        <FormBuilder
                            ref="mainFormRef"
                            :fields="mainFormFields"
                            :data-testid="`${dataTestPrefix}-main-form`"
                        />
                    </LoadingFallbackComponent>

                    <div
                        class="d-flex align-center justify-space-between mb-2"
                        :data-testid="`${dataTestPrefix}-authMode-row`"
                    >
                        <label
                            class="text-grey-darken-1 text-body-large ml-1"
                            :data-testid="`${dataTestPrefix}-authMode-label`"
                        >
                            {{ $t("assessmentToolConnections.authMode.label") }}
                        </label>
                        <v-btn-toggle
                            v-model="authMode"
                            color="primary"
                            :data-testid="`${dataTestPrefix}-authMode-toggle`"
                            density="comfortable"
                            divided
                            mandatory
                            variant="outlined"
                        >
                            <v-btn
                                :data-testid="`${dataTestPrefix}-authMode-token-button`"
                                value="token"
                            >
                                {{
                                    $t(
                                        "assessmentToolConnections.authMode.restApiToken",
                                    )
                                }}
                            </v-btn>
                            <v-btn
                                :data-testid="`${dataTestPrefix}-authMode-client-button`"
                                value="client"
                            >
                                {{
                                    $t(
                                        "assessmentToolConnections.authMode.clientCredentials",
                                    )
                                }}
                            </v-btn>
                        </v-btn-toggle>
                    </div>

                    <FormBuilder
                        ref="authFormRef"
                        :fields="authFormFields"
                        :data-testid="`${dataTestPrefix}-auth-form`"
                    />

                    <v-divider class="my-4" />

                    <div
                        class="d-flex align-center justify-space-between mb-2"
                        :data-testid="`${dataTestPrefix}-proxy-row`"
                    >
                        <label
                            class="text-grey-darken-1 text-body-large ml-1"
                            :data-testid="`${dataTestPrefix}-proxy-label`"
                        >
                            {{
                                $t(
                                    "assessmentToolConnections.fields.withProxy.label",
                                )
                            }}
                        </label>
                        <v-switch
                            v-model="withProxy"
                            :aria-label="
                                $t(
                                    'assessmentToolConnections.fields.withProxy.ariaLabel',
                                )
                            "
                            color="primary"
                            :data-testid="`${dataTestPrefix}-proxy-switch`"
                            density="compact"
                            hide-details
                            inset
                        />
                    </div>

                    <v-expand-transition>
                        <div
                            v-if="withProxy"
                            :data-testid="`${dataTestPrefix}-proxy-fields`"
                        >
                            <FormBuilder
                                ref="proxyFormRef"
                                :fields="proxyFormFields"
                                :data-testid="`${dataTestPrefix}-proxy-form`"
                            />
                        </div>
                    </v-expand-transition>
                </v-col>
            </v-row>

            <div class="d-flex justify-end ga-2 px-6 pb-4">
                <CancelButton
                    :data-testid="`${dataTestPrefix}-cancel-button`"
                    text="general.cancelButton"
                    @click="emit('cancel')"
                />
                <ConfirmButton
                    :data-testid="`${dataTestPrefix}-save-button`"
                    text="general.saveButton"
                    :disabled="mode !== 'create' && !isDirty"
                    @click="submit"
                />
            </div>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import BasicPage from "@/components/layout/pages/BasicPage.vue";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import HintText from "@/components/widgets/HintText.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import { useDirtyTracking } from "@/composables/useDirtyTracking.ts";
import i18n from "@/i18n";
import {
    type AssessmentTool,
    type AssessmentToolCreateRequest,
    assessmentToolCreateSchema,
    type AssessmentToolEditRequest,
} from "@/models/assessmentTool.ts";
import {
    type AssessmentToolFormMode,
    useAssessmentToolFormFields,
} from "@/pages/(app)/assessment-tool/composables/useAssessmentToolFormFields.ts";
import {
    type ApplyBackendErrorsResult,
    applyBackendFieldErrors,
} from "@/services/errors/formErrorMapping.ts";
import type { BackendFieldAliasMap } from "@/services/errors/types.ts";

const ASSESSMENT_TOOL_FIELD_ALIASES = {
    lmsRestApiToken: "accessToken",
    lmsProxyHost: "proxyHost",
    lmsProxyPort: "proxyPort",
    lmsProxyAuthUsername: "proxyUsername",
    lmsProxyAuthSecret: "proxyPassword",
} satisfies BackendFieldAliasMap;

const props = defineProps<{
    title: string;
    mode: AssessmentToolFormMode;
    initialTool?: AssessmentTool;
    dataTestPrefix: string;
}>();

const emit = defineEmits<{
    createSubmit: [payload: AssessmentToolCreateRequest];
    editSubmit: [payload: AssessmentToolEditRequest];
    cancel: [];
}>();

const mainFormRef = ref<InstanceType<typeof FormBuilder>>();
const authFormRef = ref<InstanceType<typeof FormBuilder>>();
const proxyFormRef = ref<InstanceType<typeof FormBuilder>>();

const {
    mainFormFields,
    authFormFields,
    proxyFormFields,
    authMode,
    withProxy,
    loading,
    errors,
    institutionId,
    name,
    lmsType,
    lmsUrl,
    lmsClientname,
    lmsClientsecret,
    accessToken,
    proxyHost,
    proxyPort,
    proxyUsername,
    proxyPassword,
} = useAssessmentToolFormFields(props.mode);

const breadCrumb = computed<BreadCrumbItem[]>(() => [
    {
        label: i18n.global.t("titles.assessmentToolConnections"),
        link: { name: "/(app)/assessment-tool/" },
    },
    {
        label:
            props.mode === "create"
                ? props.title
                : (props.initialTool?.name ?? props.title),
    },
]);

const { isDirty, snapshot } = useDirtyTracking(() => ({
    institutionId: institutionId.value ?? "",
    name: name.value ?? "",
    lmsType: lmsType.value ?? "",
    lmsUrl: lmsUrl.value ?? "",
    authMode: authMode.value,
    lmsClientname: lmsClientname.value ?? "",
    lmsClientsecret: lmsClientsecret.value ?? "",
    accessToken: accessToken.value ?? "",
    withProxy: withProxy.value,
    proxyHost: proxyHost.value ?? "",
    proxyPort: proxyPort.value ?? "",
    proxyUsername: proxyUsername.value ?? "",
    proxyPassword: proxyPassword.value ?? "",
}));

const hydrate = (fetched: AssessmentTool) => {
    institutionId.value = String(fetched.institutionId);
    name.value = fetched.name;
    lmsType.value = fetched.lmsType;
    lmsUrl.value = fetched.lmsUrl;

    if (fetched.lmsRestApiToken) {
        authMode.value = "token";
        accessToken.value = fetched.lmsRestApiToken;
    } else {
        authMode.value = "client";
        lmsClientname.value = fetched.lmsClientname;
        lmsClientsecret.value = fetched.lmsClientsecret ?? "";
    }

    withProxy.value = Boolean(fetched.lmsProxyHost || fetched.lmsProxyPort);
    proxyHost.value = fetched.lmsProxyHost;
    proxyPort.value = fetched.lmsProxyPort?.toString();
    proxyUsername.value = fetched.lmsProxyAuthUsername;
    proxyPassword.value = fetched.lmsProxyAuthSecret ?? "";

    snapshot();
};

onMounted(() => {
    if (props.initialTool) {
        hydrate(props.initialTool);
    }
});

watch(
    () => props.initialTool,
    (tool) => {
        if (tool) {
            hydrate(tool);
        }
    },
);

async function submit() {
    const [mainResult, authResult] = await Promise.all([
        mainFormRef.value?.validate(),
        authFormRef.value?.validate(),
    ]);
    if (!mainResult?.valid || !authResult?.valid) return;

    if (withProxy.value) {
        const proxyResult = await proxyFormRef.value?.validate();
        if (!proxyResult?.valid) return;
    }

    const parsedLmsType = assessmentToolCreateSchema.shape.lmsType.safeParse(
        lmsType.value,
    );
    const selectedName = name.value;
    const selectedServerAddress = lmsUrl.value;
    if (!parsedLmsType.success || !selectedName || !selectedServerAddress) {
        return;
    }

    if (props.mode === "create") {
        const selectedInstitutionId = institutionId.value;
        if (!selectedInstitutionId) return;

        const params: AssessmentToolCreateRequest = {
            institutionId: Number(selectedInstitutionId),
            name: selectedName,
            lmsType: parsedLmsType.data,
            lmsUrl: selectedServerAddress,
        };

        if (withProxy.value) {
            params.lmsProxyHost = proxyHost.value || undefined;
            params.lmsProxyPort = proxyPort.value
                ? Number(proxyPort.value)
                : undefined;
            params.lmsProxyAuthUsername = proxyUsername.value || undefined;
            params.lmsProxyAuthSecret = proxyPassword.value || undefined;
        }

        if (authMode.value === "token") {
            const selectedToken = accessToken.value;
            if (!selectedToken) return;
            params.lmsRestApiToken = selectedToken;
        } else {
            const selectedUsername = lmsClientname.value;
            const selectedPassword = lmsClientsecret.value;
            if (!selectedUsername || !selectedPassword) return;
            params.lmsClientname = selectedUsername;
            params.lmsClientsecret = selectedPassword;
        }

        emit("createSubmit", params);
        return;
    }

    if (!props.initialTool) return;

    const par: AssessmentToolEditRequest = {
        id: props.initialTool.id,
        institutionId: props.initialTool.institutionId,
        name: selectedName,
        lmsType: parsedLmsType.data,
        lmsUrl: selectedServerAddress,
        lmsClientname:
            authMode.value === "client" ? (lmsClientname.value ?? "") : "",
        lmsClientsecret:
            authMode.value === "client" ? (lmsClientsecret.value ?? "") : "",
        lmsRestApiToken:
            authMode.value === "token" ? (accessToken.value ?? "") : "",
        lmsProxyHost: withProxy.value ? proxyHost.value : undefined,
        lmsProxyPort:
            withProxy.value && proxyPort.value
                ? Number(proxyPort.value)
                : undefined,
        lmsProxyAuthUsername: withProxy.value ? proxyUsername.value : undefined,
        lmsProxyAuthSecret: withProxy.value ? proxyPassword.value : undefined,
    };

    emit("editSubmit", par);
}

function applyBackendErrors(error: unknown): ApplyBackendErrorsResult {
    return applyBackendFieldErrors(error, {
        aliases: ASSESSMENT_TOOL_FIELD_ALIASES,
        forms: [
            {
                form: mainFormRef.value,
                fields: mainFormFields.value.map((field) => field.name),
            },
            {
                form: authFormRef.value,
                fields: authFormFields.value.map((field) => field.name),
            },
            {
                form: proxyFormRef.value,
                fields: proxyFormFields.value.map((field) => field.name),
            },
        ],
    });
}

defineExpose({
    snapshot,
    applyBackendErrors,
});
</script>
