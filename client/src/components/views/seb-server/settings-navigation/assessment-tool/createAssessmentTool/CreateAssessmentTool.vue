<template>
    <BasicSettingsPage
        :title="$t('titles.createAssessmentTool')"
        data-testid="createAssessmentTool-page"
    >
        <template #PanelMain>
            <HintText
                text-identifier="assessmentToolConnections.createAssessmentToolConnectionsPage.info.assessmentToolConnectionsCreationInfo"
                class="px-6 py-2"
                data-testid="createAssessmentTool-info-text"
            />

            <v-row class="px-6 mt-2">
                <v-col cols="8">
                    <LoadingFallbackComponent
                        :loading="loading"
                        :errors="errors"
                    >
                        <FormBuilder
                            ref="mainFormRef"
                            v-model="isMainFormValid"
                            :fields="mainFormFields"
                            data-testid="createAssessmentTool-main-form"
                        />
                    </LoadingFallbackComponent>

                    <!-- Auth mode toggle -->
                    <div
                        class="d-flex align-center justify-space-between mb-2"
                        data-testid="createAssessmentTool-authMode-row"
                    >
                        <label
                            class="text-grey-darken-1 text-body-1 ml-1"
                            data-testid="createAssessmentTool-authMode-label"
                        >
                            {{
                                $t(
                                    "assessmentToolConnections.createAssessmentToolConnectionsPage.labels.authenticationMode",
                                )
                            }}
                        </label>
                        <v-btn-toggle
                            v-model="authMode"
                            data-testid="createAssessmentTool-authMode-toggle"
                            density="comfortable"
                            mandatory
                        >
                            <v-btn
                                data-testid="createAssessmentTool-authMode-token-button"
                                value="token"
                            >
                                {{
                                    $t(
                                        "assessmentToolConnections.createAssessmentToolConnectionsPage.labels.restApiToken",
                                    )
                                }}
                            </v-btn>
                            <v-btn
                                data-testid="createAssessmentTool-authMode-client-button"
                                value="client"
                            >
                                {{
                                    $t(
                                        "assessmentToolConnections.createAssessmentToolConnectionsPage.labels.clientCredentials",
                                    )
                                }}
                            </v-btn>
                        </v-btn-toggle>
                    </div>

                    <FormBuilder
                        ref="authFormRef"
                        v-model="isAuthFormValid"
                        :fields="authFormFields"
                        data-testid="createAssessmentTool-auth-form"
                    />

                    <v-divider class="my-4" />

                    <!-- Proxy toggle -->
                    <div
                        class="d-flex align-center justify-space-between mb-2"
                        data-testid="createAssessmentTool-proxy-row"
                    >
                        <label
                            class="text-grey-darken-1 text-body-1 ml-1"
                            data-testid="createAssessmentTool-proxy-label"
                        >
                            {{
                                $t(
                                    "assessmentToolConnections.createAssessmentToolConnectionsPage.labels.withProxyLabel",
                                )
                            }}
                        </label>
                        <v-switch
                            v-model="withProxy"
                            :aria-label="
                                $t(
                                    'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.withProxyAria',
                                )
                            "
                            color="primary"
                            data-testid="createAssessmentTool-proxy-switch"
                            density="compact"
                            hide-details
                            inset
                        />
                    </div>

                    <v-expand-transition>
                        <div
                            v-show="withProxy"
                            data-testid="createAssessmentTool-proxy-fields"
                        >
                            <FormBuilder
                                ref="proxyFormRef"
                                v-model="isProxyFormValid"
                                :fields="proxyFormFields"
                                data-testid="createAssessmentTool-proxy-form"
                            />
                        </div>
                    </v-expand-transition>
                </v-col>
            </v-row>

            <!-- Action buttons -->
            <v-row class="px-6 pb-4">
                <v-col class="d-flex justify-end pa-0">
                    <CancelButton
                        data-testid="createAssessmentTool-cancel-button"
                        text="general.cancelButton"
                        @click="navigateToRoute({ name: 'AssessmentToolList' })"
                    />
                    <ConfirmButton
                        data-testid="createAssessmentTool-save-button"
                        text="general.saveButton"
                        @click="submit()"
                    />
                </v-col>
            </v-row>
        </template>
    </BasicSettingsPage>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import HintText from "@/components/views/seb-server/settings-navigation/widgets/HintText.vue";
import CancelButton from "@/components/views/seb-server/settings-navigation/widgets/CancelButton.vue";
import ConfirmButton from "@/components/views/seb-server/settings-navigation/widgets/ConfirmButton.vue";
import { navigateToRoute } from "@/router/navigation";
import { useAssessmentToolFormFields } from "./composable/useAssessmentToolFormFields";
import { useCreateAssessmentTool } from "./composable/api/useCreateAssessmentTool";
import { useCreateAssessmentToolStore } from "./composable/store/useCreateAssessmentToolStore";
import type { CommonAssessmentToolPar } from "@/models/seb-server/assessmentTool";

const store = useCreateAssessmentToolStore();
const { withProxy, authMode } = storeToRefs(store);

const {
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
} = storeToRefs(store);

const { mainFormFields, authFormFields, proxyFormFields, loading, errors } =
    useAssessmentToolFormFields();

const { submit: createTool } = useCreateAssessmentTool();

const mainFormRef = ref<InstanceType<typeof FormBuilder>>();
const authFormRef = ref<InstanceType<typeof FormBuilder>>();
const proxyFormRef = ref<InstanceType<typeof FormBuilder>>();
const isMainFormValid = ref<boolean | null>(null);
const isAuthFormValid = ref<boolean | null>(null);
const isProxyFormValid = ref<boolean | null>(null);

watch(authMode, (mode) => {
    if (mode === "client") {
        accessToken.value = undefined;
    } else {
        clientUsername.value = undefined;
        clientPassword.value = undefined;
    }
});

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

    const selectedInstitutionId = institutionId.value;
    const selectedName = name.value;
    const selectedLmsType = lmsType.value;
    const selectedServerAddress = serverAddress.value;

    if (
        !selectedInstitutionId ||
        !selectedName ||
        !selectedLmsType ||
        !selectedServerAddress
    ) {
        return;
    }

    const common: CommonAssessmentToolPar = {
        institutionId: selectedInstitutionId,
        name: selectedName,
        lmsType: selectedLmsType,
        lmsUrl: selectedServerAddress,
        ...(withProxy.value
            ? {
                  lmsProxyHost: proxyHost.value,
                  lmsProxyPort: proxyPort.value,
                  lmsProxyAuthUsername: proxyUsername.value,
                  lmsProxyAuthSecret: proxyPassword.value,
              }
            : {}),
    };

    if (authMode.value === "token") {
        const token = accessToken.value;
        if (!token) return;

        const result = await createTool({
            ...common,
            authMode: "token",
            lmsRestApiToken: token,
        });

        if (result !== null) {
            store.$reset();
            navigateToRoute({ name: "AssessmentToolList" });
        }
    } else {
        const username = clientUsername.value;
        const password = clientPassword.value;
        if (!username || !password) return;

        const result = await createTool({
            ...common,
            authMode: "client",
            lmsClientname: username,
            lmsClientsecret: password,
        });

        if (result !== null) {
            store.$reset();
            navigateToRoute({ name: "AssessmentToolList" });
        }
    }
}
</script>
