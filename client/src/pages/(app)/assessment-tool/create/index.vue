<template>
    <BasicPage
        :title="$t('titles.createAssessmentTool')"
        :bread-crumb="[
            {
                label: $t('titles.assessmentToolConnections'),
                link: { name: '/(app)/assessment-tool/' },
            },
            { label: $t('titles.createAssessmentTool') },
        ]"
        data-testid="createAssessmentTool-page"
    >
        <template #SubNav>
            <SettingsNavigation />
        </template>

        <template #PanelMain>
            <HintText
                text-identifier="assessmentToolConnections.hints.create"
                class="px-6 py-2"
                data-testid="createAssessmentTool-info-text"
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
                            data-testid="createAssessmentTool-main-form"
                        />
                    </LoadingFallbackComponent>

                    <div
                        class="d-flex align-center justify-space-between mb-2"
                        data-testid="createAssessmentTool-authMode-row"
                    >
                        <label
                            class="text-grey-darken-1 text-body-large ml-1"
                            data-testid="createAssessmentTool-authMode-label"
                        >
                            {{ $t("assessmentToolConnections.authMode.label") }}
                        </label>
                        <v-btn-toggle
                            v-model="authMode"
                            color="primary"
                            data-testid="createAssessmentTool-authMode-toggle"
                            density="comfortable"
                            divided
                            mandatory
                            variant="outlined"
                        >
                            <v-btn
                                data-testid="createAssessmentTool-authMode-token-button"
                                value="token"
                            >
                                {{
                                    $t(
                                        "assessmentToolConnections.authMode.restApiToken",
                                    )
                                }}
                            </v-btn>
                            <v-btn
                                data-testid="createAssessmentTool-authMode-client-button"
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
                        data-testid="createAssessmentTool-auth-form"
                    />

                    <v-divider class="my-4" />

                    <div
                        class="d-flex align-center justify-space-between mb-2"
                        data-testid="createAssessmentTool-proxy-row"
                    >
                        <label
                            class="text-grey-darken-1 text-body-large ml-1"
                            data-testid="createAssessmentTool-proxy-label"
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
                            data-testid="createAssessmentTool-proxy-switch"
                            density="compact"
                            hide-details
                            inset
                        />
                    </div>

                    <v-expand-transition>
                        <div
                            v-if="withProxy"
                            data-testid="createAssessmentTool-proxy-fields"
                        >
                            <FormBuilder
                                ref="proxyFormRef"
                                :fields="proxyFormFields"
                                data-testid="createAssessmentTool-proxy-form"
                            />
                        </div>
                    </v-expand-transition>
                </v-col>
            </v-row>

            <div class="d-flex justify-end ga-2 px-6 pb-4">
                <CancelButton
                    data-testid="createAssessmentTool-cancel-button"
                    text="general.cancelButton"
                    @click="router.push({ name: '/(app)/assessment-tool/' })"
                />
                <ConfirmButton
                    data-testid="createAssessmentTool-save-button"
                    text="general.saveButton"
                    @click="submit()"
                />
            </div>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useAssessmentToolFormFields } from "@/pages/(app)/assessment-tool/composables/useAssessmentToolFormFields.ts";
import { useCreateAssessmentToolMutation } from "@/pages/(app)/assessment-tool/api/useCreateAssessmentToolMutation.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { applyBackendFieldErrors } from "@/services/errors/formErrorMapping.ts";
import {
    assessmentToolCreateSchema,
    type AssessmentToolCreateRequest,
} from "@/models/assessmentTool.ts";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import HintText from "@/components/widgets/HintText.vue";
import { useRouter } from "vue-router";

definePage({
    meta: {
        titleKey: "titles.createAssessmentTool",
        pageTestId: "create-assessment-tool-page",
        isPageBlue: true,
    },
});

const router = useRouter();

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
} = useAssessmentToolFormFields("create");

const { mutateAsync: createTool, error: createMutationError } =
    useCreateAssessmentToolMutation();
const createError = computed(() =>
    toAppErrorOrUndefined(createMutationError.value),
);

const mainFormRef = ref<InstanceType<typeof FormBuilder>>();
const authFormRef = ref<InstanceType<typeof FormBuilder>>();
const proxyFormRef = ref<InstanceType<typeof FormBuilder>>();

const ASSESSMENT_TOOL_FIELD_ALIASES = {
    lmsRestApiToken: "accessToken",
    lmsProxyHost: "proxyHost",
    lmsProxyPort: "proxyPort",
    lmsProxyAuthUsername: "proxyUsername",
    lmsProxyAuthSecret: "proxyPassword",
};

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
    const selectedInstitutionId = institutionId.value;
    const selectedName = name.value;
    const selectedServerAddress = lmsUrl.value;

    if (
        !parsedLmsType.success ||
        !selectedInstitutionId ||
        !selectedName ||
        !selectedServerAddress
    ) {
        return;
    }

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

    const created = await submitWithFormErrors({
        run: () => createTool(params),
        applyErrors: (err) =>
            applyBackendFieldErrors(err, {
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
                        fields: proxyFormFields.value.map(
                            (field) => field.name,
                        ),
                    },
                ],
            }),
        error: createError,
        contextLabel: "assessmenttool",
    });
    if (!created) return;
    await router.push({
        name: "/(app)/assessment-tool/",
        query: { search: created.name },
    });
}
</script>
