<template>
    <BasicSettingsPage
        :title="$t('titles.assessmentToolEdit')"
        data-testid="editAssessmentTool-page"
    >
        <template #PanelMain>
            <LoadingFallbackComponent :loading="loading" :errors="errors">
                <v-row class="px-6 pt-4" no-gutters>
                    <v-col cols="8">
                        <HintText
                            text-identifier="assessmentToolConnections.hints.edit"
                            data-testid="editAssessmentTool-info-text"
                        />
                    </v-col>
                </v-row>

                <v-row class="px-6 mt-2" no-gutters>
                    <v-col cols="8" class="pa-0">
                        <FormBuilder
                            ref="mainFormRef"
                            :fields="mainFormFields"
                            data-testid="editAssessmentTool-main-form"
                        />

                        <div
                            class="d-flex align-center justify-space-between mb-2"
                            data-testid="editAssessmentTool-authMode-row"
                        >
                            <label
                                class="text-grey-darken-1 text-body-large ml-1"
                            >
                                {{
                                    $t(
                                        "assessmentToolConnections.authMode.label",
                                    )
                                }}
                            </label>
                            <v-btn-toggle
                                v-model="authMode"
                                data-testid="editAssessmentTool-authMode-toggle"
                                density="comfortable"
                                mandatory
                            >
                                <v-btn value="token">
                                    {{
                                        $t(
                                            "assessmentToolConnections.authMode.restApiToken",
                                        )
                                    }}
                                </v-btn>
                                <v-btn value="client">
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
                            data-testid="editAssessmentTool-auth-form"
                        />

                        <v-divider class="my-4" />

                        <div
                            class="d-flex align-center justify-space-between mb-2"
                        >
                            <label
                                class="text-grey-darken-1 text-body-large ml-1"
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
                                density="compact"
                                hide-details
                                inset
                            />
                        </div>

                        <v-expand-transition>
                            <div v-if="withProxy">
                                <FormBuilder
                                    ref="proxyFormRef"
                                    :fields="proxyFormFields"
                                    data-testid="editAssessmentTool-proxy-form"
                                />
                            </div>
                        </v-expand-transition>
                    </v-col>
                </v-row>

                <div class="d-flex justify-end ga-2 px-6 pb-4">
                    <CancelButton
                        data-testid="editAssessmentTool-cancel-button"
                        text="general.cancelButton"
                        @click="
                            router.push({ name: '/(app)/assessment-tool/' })
                        "
                    />
                    <ConfirmButton
                        data-testid="editAssessmentTool-save-button"
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
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";
import { useMutation } from "@/composables/useMutation.ts";
import { useDirtyTracking } from "@/composables/useDirtyTracking.ts";
import { useAssessmentToolFormFields } from "@/pages/(app)/assessment-tool/composables/useAssessmentToolFormFields.ts";
import {
    editAssessmentTool,
    getAssessmentTool,
} from "@/services/seb-server/assessmentToolService.ts";
import type {
    AssessmentTool,
    UpdateAssessmentToolPar,
} from "@/models/seb-server/assessmentTool.ts";

definePage({
    meta: {
        titleKey: "titles.assessmentToolEdit",
        pageTestId: "edit-assessment-tool-page",
        isPageBlue: true,
    },
});

const route = useRoute("/(app)/assessment-tool/[id]/");
const router = useRouter();

const {
    mainFormFields,
    authFormFields,
    proxyFormFields,
    authMode,
    withProxy,
    loading: formLoading,
    errors: formErrors,
    institutionId,
    name,
    lmsType,
    serverAddress,
    clientUsername,
    clientPassword,
    accessToken,
    proxyHost,
    proxyPort,
    proxyUsername,
    proxyPassword,
} = useAssessmentToolFormFields();

const mainFormRef = ref<InstanceType<typeof FormBuilder>>();
const authFormRef = ref<InstanceType<typeof FormBuilder>>();
const proxyFormRef = ref<InstanceType<typeof FormBuilder>>();

const tool = ref<AssessmentTool>();
const fetchLoading = ref(false);
const fetchError = ref<string>();

const loading = computed(() => formLoading.value || fetchLoading.value);
const errors = computed(() =>
    [...formErrors.value, fetchError.value].filter((e) => e !== undefined),
);

const { mutateData: saveTool, data: savedTool } =
    useMutation(editAssessmentTool);

const { isDirty, snapshot } = useDirtyTracking(() => ({
    institutionId: institutionId.value ?? "",
    name: name.value ?? "",
    lmsType: lmsType.value ?? "",
    serverAddress: serverAddress.value ?? "",
    authMode: authMode.value,
    clientUsername: clientUsername.value ?? "",
    clientPassword: clientPassword.value ?? "",
    accessToken: accessToken.value ?? "",
    withProxy: withProxy.value,
    proxyHost: proxyHost.value ?? "",
    proxyPort: proxyPort.value ?? "",
    proxyUsername: proxyUsername.value ?? "",
    proxyPassword: proxyPassword.value ?? "",
}));

onMounted(async () => {
    fetchLoading.value = true;
    try {
        const id = Number(route.params.id);
        if (!Number.isInteger(id)) {
            throw new Error(
                `Invalid assessment tool id in route: ${String(route.params.id)}`,
            );
        }
        const fetched = await getAssessmentTool(id);
        tool.value = fetched;

        institutionId.value = fetched.institutionId.toString();
        name.value = fetched.name;
        lmsType.value = fetched.lmsType;
        serverAddress.value = fetched.lmsUrl;

        if (fetched.lmsClientname) {
            authMode.value = "client";
            clientUsername.value = fetched.lmsClientname;
            clientPassword.value = "";
        } else {
            authMode.value = "token";
            accessToken.value = "";
        }

        withProxy.value = Boolean(fetched.lmsProxyHost || fetched.lmsProxyPort);
        proxyHost.value = fetched.lmsProxyHost;
        proxyPort.value = fetched.lmsProxyPort?.toString();
        proxyUsername.value = fetched.lmsProxyAuthUsername;
        proxyPassword.value = "";

        snapshot();
    } catch (err) {
        fetchError.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
        fetchLoading.value = false;
    }
});

async function submit() {
    const [mainResult, authResult] = await Promise.all([
        mainFormRef.value?.validate(),
        authFormRef.value?.validate(),
    ]);
    if (!mainResult?.valid || !authResult?.valid || !tool.value) return;

    if (withProxy.value) {
        const proxyResult = await proxyFormRef.value?.validate();
        if (!proxyResult?.valid) return;
    }

    const par: UpdateAssessmentToolPar = {
        id: tool.value.id.toString(),
        institutionId: institutionId.value ?? "",
        name: name.value ?? "",
        lmsType: lmsType.value ?? "",
        lmsUrl: serverAddress.value ?? "",
        lmsClientname:
            authMode.value === "client" ? (clientUsername.value ?? "") : "",
        lmsClientsecret:
            authMode.value === "client" ? (clientPassword.value ?? "") : "",
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

    await saveTool(par);

    if (savedTool.value) {
        await router.push({ name: "/(app)/assessment-tool/" });
    }
}
</script>
