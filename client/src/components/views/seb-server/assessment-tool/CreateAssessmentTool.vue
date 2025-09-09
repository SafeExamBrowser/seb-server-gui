<template>
    <div
        class="text-white text-h5 font-weight-black ml-10 mt-5"
        data-testid="assessmentToolsCreate-page-title"
    >
        {{ translate("titles.settings") }}
    </div>

    <v-row class="mt-10 w-98 h-100">
        <!-- settings navigation -->
        <SettingsNavigation
            data-testid="assessmentToolsCreate-settingsNavigation-component"
        />

        <v-col
            class="bg-white rounded-lg"
            cols="9"
            data-testid="assessmentToolsCreate-form-container"
            elevation="4"
        >
            <v-row
                class="d-flex align-center justify-space-between px-6 pt-6"
                data-testid="assessmentToolsCreate-header-row"
            >
                <div
                    class="text-primary text-h5 font-weight-bold"
                    data-testid="assessmentToolsCreate-title-text"
                >
                    {{ translate("titles.createAssessmentTool") }}
                </div>
            </v-row>

            <v-divider
                class="custom-divider mx-6 my-4 mt-7"
                data-testid="assessmentToolsCreate-divider-top"
            />

            <v-row
                class="px-8 mt-2"
                data-testid="assessmentToolsCreate-intro-row"
            >
                <div
                    class="text-body-2 text-grey-darken-1"
                    data-testid="assessmentToolsCreate-intro-text"
                >
                    {{
                        translate(
                            "assessmentToolConnections.createAssessmentToolConnectionsPage.info.assessmentToolConnectionsCreationInfo",
                        )
                    }}
                </div>
            </v-row>

            <!-- Form -->
            <v-sheet
                class="rounded-lg mt-4"
                data-testid="assessmentToolsCreate-form-sheet"
                style="min-height: 46.9vh"
            >
                <v-form
                    ref="formRef"
                    data-testid="assessmentToolsCreate-form"
                    @keyup.enter="submit()"
                >
                    <v-col class="pa-0 mb-4 h-100" cols="12" md="12">
                        <v-card-text>
                            <!-- First Section -->
                            <v-row
                                data-testid="assessmentToolsCreate-form-row-1"
                                dense
                            >
                                <v-col
                                    cols="8"
                                    data-testid="assessmentToolsCreate-form-left-col"
                                >
                                    <!-- Institution -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-select
                                            v-model="institution"
                                            data-testid="assessmentToolsCreate-institution-select"
                                            density="compact"
                                            disabled
                                            item-title="name"
                                            item-value="modelId"
                                            :items="institutions"
                                            :label="
                                                translate(
                                                    'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.institutionLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Name -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="name"
                                            data-testid="assessmentToolsCreate-name-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.nameLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Type -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-select
                                            v-model="lmsType"
                                            data-testid="assessmentToolsCreate-type-select"
                                            density="compact"
                                            item-title="label"
                                            item-value="value"
                                            :items="lmsTypeItems"
                                            :label="
                                                translate(
                                                    'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.typeLabel',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Assessment Tool Server Address -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="
                                                assessmentToolServerAddress
                                            "
                                            data-testid="assessmentToolsCreate-serverAddress-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.assessmentToolServerAddressLabel',
                                                )
                                            "
                                            :rules="[
                                                requiredRule,
                                                httpPrefixRule,
                                            ]"
                                            validate-on="blur"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Auth Mode -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <div
                                            class="d-flex align-center justify-space-between"
                                            data-testid="assessmentToolsCreate-authMode-row"
                                        >
                                            <label
                                                class="text-grey-darken-1 text-body-1 ml-1 mb-6 mt-3"
                                                data-testid="assessmentToolsCreate-authMode-label"
                                            >
                                                {{
                                                    translate(
                                                        "assessmentToolConnections.createAssessmentToolConnectionsPage.labels.authenticationMode",
                                                    )
                                                }}
                                            </label>
                                            <v-btn-toggle
                                                v-model="authMode"
                                                class="ml-4 mb-6 mt-3"
                                                data-testid="assessmentToolsCreate-authMode-toggle"
                                                density="comfortable"
                                                mandatory
                                            >
                                                <v-btn
                                                    data-testid="assessmentToolsCreate-authMode-client-button"
                                                    value="client"
                                                >
                                                    {{
                                                        translate(
                                                            "assessmentToolConnections.createAssessmentToolConnectionsPage.labels.clientCredentials",
                                                        )
                                                    }}
                                                </v-btn>
                                                <v-btn
                                                    data-testid="assessmentToolsCreate-authMode-token-button"
                                                    value="token"
                                                >
                                                    {{
                                                        translate(
                                                            "assessmentToolConnections.createAssessmentToolConnectionsPage.labels.restApiToken",
                                                        )
                                                    }}
                                                </v-btn>
                                            </v-btn-toggle>
                                        </div>
                                    </v-col>

                                    <!-- Client Credentials (shown only in client mode) -->
                                    <template v-if="authMode === 'client'">
                                        <!-- Username -->
                                        <v-col
                                            class="custom-padding-textbox"
                                            cols="12"
                                            md="12"
                                        >
                                            <v-text-field
                                                v-model="
                                                    assessmentToolServerUsername
                                                "
                                                data-testid="assessmentToolsCreate-client-username-input"
                                                density="compact"
                                                :label="
                                                    translate(
                                                        'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.assessmentToolServerUsernameLabel',
                                                    )
                                                "
                                                :rules="[requiredIfClientRule]"
                                                validate-on="blur"
                                                variant="outlined"
                                            />
                                        </v-col>

                                        <!-- Password -->
                                        <v-col
                                            class="custom-padding-textbox"
                                            cols="12"
                                            md="12"
                                        >
                                            <v-text-field
                                                v-model="
                                                    assessmentToolServerPassword
                                                "
                                                data-testid="assessmentToolsCreate-client-password-input"
                                                density="compact"
                                                :label="
                                                    translate(
                                                        'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.assessmentToolServerPasswordLabel',
                                                    )
                                                "
                                                :rules="[requiredIfClientRule]"
                                                :type="
                                                    passwordVisible
                                                        ? 'text'
                                                        : 'password'
                                                "
                                                validate-on="blur"
                                                variant="outlined"
                                            >
                                                <template #append-inner>
                                                    <v-btn
                                                        data-testid="assessmentToolsCreate-client-password-toggle"
                                                        density="compact"
                                                        :icon="
                                                            passwordVisible
                                                                ? 'mdi-eye-off'
                                                                : 'mdi-eye'
                                                        "
                                                        variant="text"
                                                        @click="
                                                            passwordVisible =
                                                                !passwordVisible
                                                        "
                                                    />
                                                </template>
                                            </v-text-field>
                                        </v-col>
                                    </template>

                                    <!-- REST API Token (shown only in token mode) -->
                                    <template v-else>
                                        <v-col
                                            class="custom-padding-textbox"
                                            cols="12"
                                            md="12"
                                        >
                                            <v-text-field
                                                ref="confirmPasswordFieldRef"
                                                v-model="accessToken"
                                                class="mb-2"
                                                data-testid="assessmentToolsCreate-token-input"
                                                density="compact"
                                                :label="
                                                    translate(
                                                        'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.accessTokenLabel',
                                                    )
                                                "
                                                :rules="[requiredIfTokenRule]"
                                                :type="
                                                    confirmPasswordVisible
                                                        ? 'text'
                                                        : 'password'
                                                "
                                                validate-on="blur"
                                                variant="outlined"
                                            >
                                                <template #append-inner>
                                                    <v-btn
                                                        data-testid="assessmentToolsCreate-token-toggle"
                                                        density="compact"
                                                        :icon="
                                                            confirmPasswordVisible
                                                                ? 'mdi-eye-off'
                                                                : 'mdi-eye'
                                                        "
                                                        variant="text"
                                                        @click="
                                                            confirmPasswordVisible =
                                                                !confirmPasswordVisible
                                                        "
                                                    />
                                                </template>
                                            </v-text-field>
                                        </v-col>
                                    </template>
                                </v-col>

                                <!-- Second Column first Section (placeholder) -->
                                <v-col
                                    cols="4"
                                    data-testid="assessmentToolsCreate-form-right-col"
                                >
                                </v-col>
                            </v-row>

                            <!-- Proxy toggle and expansion -->
                            <v-row
                                data-testid="assessmentToolsCreate-proxy-section"
                                dense
                            >
                                <v-divider
                                    class="custom-divider mx-1 my-2"
                                    data-testid="assessmentToolsCreate-divider-proxy"
                                />

                                <v-col>
                                    <!-- With Proxy Toggle -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="6"
                                        md="6"
                                    >
                                        <div
                                            class="d-flex align-center justify-space-between w-100"
                                        >
                                            <label
                                                class="text-grey-darken-1 text-body-1 ml-11"
                                                data-testid="assessmentToolsCreate-proxy-label"
                                            >
                                                {{
                                                    translate(
                                                        "assessmentToolConnections.createAssessmentToolConnectionsPage.labels.withProxyLabel",
                                                    )
                                                }}
                                            </label>

                                            <v-switch
                                                v-model="withProxy"
                                                :aria-label="
                                                    translate(
                                                        'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.withProxyAria',
                                                    )
                                                "
                                                class="ml-4"
                                                color="primary"
                                                data-testid="assessmentToolsCreate-proxy-switch"
                                                density="compact"
                                                hide-details
                                                inset
                                            />
                                        </div>
                                    </v-col>
                                </v-col>
                            </v-row>

                            <v-row
                                data-testid="assessmentToolsCreate-proxy-fields-row"
                                dense
                            >
                                <v-col>
                                    <!-- Animated expansion -->
                                    <v-expand-transition>
                                        <div
                                            v-show="withProxy"
                                            data-testid="assessmentToolsCreate-proxy-fields"
                                        >
                                            <v-row>
                                                <v-col cols="8">
                                                    <!-- Proxy Host -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model="proxyHost"
                                                            data-testid="assessmentToolsCreate-proxy-host-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyHostLabel',
                                                                )
                                                            "
                                                            :rules="[
                                                                requiredIfProxyRule,
                                                            ]"
                                                            validate-on="blur"
                                                            variant="outlined"
                                                        />
                                                    </v-col>

                                                    <!-- Proxy Port -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model="proxyPort"
                                                            data-testid="assessmentToolsCreate-proxy-port-input"
                                                            density="compact"
                                                            inputmode="numeric"
                                                            :label="
                                                                translate(
                                                                    'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyPortLabel',
                                                                )
                                                            "
                                                            :rules="[
                                                                requiredIfProxyRule,
                                                                portNumberRule,
                                                            ]"
                                                            type="number"
                                                            validate-on="blur"
                                                            variant="outlined"
                                                        />
                                                    </v-col>

                                                    <!-- Proxy Username -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model="
                                                                proxyUsername
                                                            "
                                                            data-testid="assessmentToolsCreate-proxy-username-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyUsernameLabel',
                                                                )
                                                            "
                                                            :rules="[
                                                                requiredIfProxyRule,
                                                            ]"
                                                            validate-on="blur"
                                                            variant="outlined"
                                                        />
                                                    </v-col>

                                                    <!-- Proxy Password -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model="
                                                                proxyPassword
                                                            "
                                                            data-testid="assessmentToolsCreate-proxy-password-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyPasswordLabel',
                                                                )
                                                            "
                                                            :rules="[
                                                                requiredIfProxyRule,
                                                            ]"
                                                            :type="
                                                                proxyPasswordVisible
                                                                    ? 'text'
                                                                    : 'password'
                                                            "
                                                            validate-on="blur"
                                                            variant="outlined"
                                                        >
                                                            <template
                                                                #append-inner
                                                            >
                                                                <v-btn
                                                                    data-testid="assessmentToolsCreate-proxy-password-toggle"
                                                                    density="compact"
                                                                    :icon="
                                                                        proxyPasswordVisible
                                                                            ? 'mdi-eye-off'
                                                                            : 'mdi-eye'
                                                                    "
                                                                    variant="text"
                                                                    @click="
                                                                        proxyPasswordVisible =
                                                                            !proxyPasswordVisible
                                                                    "
                                                                />
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>
                                                </v-col>

                                                <v-col cols="4"></v-col>
                                            </v-row>
                                        </div>
                                    </v-expand-transition>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-col>
                </v-form>
            </v-sheet>

            <!-- Buttons -->
            <v-row
                class="px-6 pt-0"
                data-testid="assessmentToolsCreate-actions-row"
            >
                <v-col class="pa-0 mb-4" cols="12" md="12">
                    <div class="d-flex justify-end">
                        <v-btn
                            color="black"
                            data-testid="assessmentToolsCreate-cancel-button"
                            rounded="sm"
                            variant="outlined"
                            @click="
                                navigateTo(
                                    constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE,
                                )
                            "
                        >
                            {{ translate("general.cancelButton") }}
                        </v-btn>

                        <v-btn
                            class="ml-2"
                            color="primary"
                            data-testid="assessmentToolsCreate-save-button"
                            :disabled="isCreateDisabled"
                            rounded="sm"
                            variant="flat"
                            @click="submit()"
                        >
                            {{ translate("general.saveButton") }}
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useAppBarStore, useLayoutStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import * as constants from "@/utils/constants";
import { getInstitutions } from "@/services/seb-server/component-services/registerAccountViewService";
import { navigateTo } from "@/router/navigation";
import { useI18n } from "vue-i18n";
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/authenticationStore";
import { createAssessmentTool } from "@/services/seb-server/component-services/assessmentToolViewService";
import { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums";

const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();

// fields
const institution = ref<string | null>(null);
const name = ref<string>("");
const lmsType = ref<LMSTypeEnum | null>(null);
const assessmentToolServerAddress = ref<string>("");
const assessmentToolServerUsername = ref<string>("");
const assessmentToolServerPassword = ref<string>("");
const accessToken = ref<string>("");
const withProxy = ref<boolean>(false);

const proxyHost = ref<string>("");
const proxyPort = ref<string>("");
const proxyUsername = ref<string>("");
const proxyPassword = ref<string>("");
const proxyPasswordVisible = ref<boolean>(false);

const i18n = useI18n();

const formRef = ref();

const createdSuccess = ref(false);
const passwordVisible = ref<boolean>(false);
const confirmPasswordVisible = ref<boolean>(false);
const confirmPasswordFieldRef = ref();
const institutionSelectDisabled = ref(true);
const createdAssessmentToolName = ref<string>("");

const institutions = ref<Institution[]>([]);
const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();

type AuthMode = "client" | "token";
const authMode = ref<AuthMode>("token");

// validation rules
const requiredMessage = translate(
    "assessmentToolConnections.createAssessmentToolConnectionsPage.validation.required",
);
const invalidPortMessage = translate(
    "assessmentToolConnections.createAssessmentToolConnectionsPage.validation.invalidPort",
);
const httpPrefixMessage = translate(
    "assessmentToolConnections.createAssessmentToolConnectionsPage.validation.httpPrefix",
);

const requiredRule = (v: string) => !!v || requiredMessage;

const httpPrefixRule = (v: string) =>
    /^https?:\/\//i.test(v) || httpPrefixMessage;

// Required only when withProxy is true
const requiredIfProxyRule = (v: string) => {
    if (!withProxy.value) return true;
    return (!!v && v.toString().trim().length > 0) || requiredMessage;
};

// Port number rule (1..65535)
const portNumberRule = (v: string) => {
    if (!withProxy.value) return true;
    const n = Number(v);
    return (Number.isInteger(n) && n >= 1 && n <= 65535) || invalidPortMessage;
};

const requiredIfClientRule = (v: string) => {
    if (authMode.value !== "client") return true;
    return (!!v && v.toString().trim().length > 0) || requiredMessage;
};

const requiredIfTokenRule = (v: string) => {
    if (authMode.value !== "token") return true;
    return (!!v && v.toString().trim().length > 0) || requiredMessage;
};

const isAuthValid = computed(() => {
    const hasClient =
        !!assessmentToolServerUsername.value &&
        !!assessmentToolServerPassword.value;
    const hasToken = !!accessToken.value;
    return (
        (authMode.value === "client" && hasClient && !hasToken) ||
        (authMode.value === "token" && hasToken && !hasClient)
    );
});

const lmsTypeItems = Object.values(LMSTypeEnum).map((v) => ({
    label: translate(`assessmentToolConnections.lmsTypes.${v}`),
    value: v as LMSTypeEnum,
}));

onMounted(async () => {
    appBarStore.title = translate("titles.createAssessmentTool");
    layoutStore.setBlueBackground(true);

    const user = authenticatedUserAccountStore.userAccount;

    const result: Institution[] | null = await getInstitutions();
    institutions.value = result ?? [];

    const userInstitutionId = String(user?.institutionId);
    const matchedInstitution = institutions.value.find(
        (inst) => inst.modelId === userInstitutionId,
    );

    if (matchedInstitution) {
        institution.value = matchedInstitution.modelId;
        institutionSelectDisabled.value = true;
        institutions.value = [matchedInstitution];
    } else {
        console.warn("User's institution not found in fetched institutions.");
    }
});

// Create button disabled state
const isCreateDisabled = computed(() => {
    const baseMissing =
        !institution.value ||
        !name.value ||
        !lmsType.value ||
        !assessmentToolServerAddress.value;

    if (baseMissing) return true;

    if (!isAuthValid.value) return true;

    if (!withProxy.value) return false;

    const proxyMissing =
        !proxyHost.value ||
        !proxyPort.value ||
        !proxyUsername.value ||
        !proxyPassword.value;

    const n = Number(proxyPort.value);
    const badPort = !(Number.isInteger(n) && n >= 1 && n <= 65535);

    return proxyMissing || badPort;
});

async function submit() {
    const { valid } = await formRef.value.validate();
    if (!valid) return;

    const common: any = {
        institutionId: institution.value!,
        name: name.value,
        lmsType: lmsType.value!,
        lmsUrl: assessmentToolServerAddress.value,
        ...(withProxy.value
            ? {
                  lmsProxyHost: proxyHost.value,
                  lmsProxyPort: Number(proxyPort.value.trim()).toString(),
                  lmsProxyAuthUsername: proxyUsername.value,
                  lmsProxyAuthSecret: proxyPassword.value,
              }
            : {}),
    };

    // Auth mode spreads (XOR)
    const authPart =
        authMode.value === "client"
            ? {
                  lmsClientname: assessmentToolServerUsername.value,
                  lmsClientsecret: assessmentToolServerPassword.value,
              }
            : {
                  lmsRestApiToken: accessToken.value,
              };

    const createAssessmentToolsParams = {
        ...common,
        ...authPart,
    } as CreateAssessmentToolPar;

    const createdAssessmentToolResponse: any | null =
        await createAssessmentTool(createAssessmentToolsParams);

    if (!createdAssessmentToolResponse) return;

    createdAssessmentToolName.value = createdAssessmentToolResponse.name;
    createdSuccess.value = true;
    setTimeout(() => {
        createdSuccess.value = false;
        navigateTo(constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE);
    }, 1500);
}
onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});

watch(authMode, (mode) => {
    if (mode === "client") {
        accessToken.value = "";
    } else {
        assessmentToolServerUsername.value = "";
        assessmentToolServerPassword.value = "";
    }
});
</script>

<style scoped>
.nav-hover:hover .nav-link {
    color: #215caf;
}

.w-98 {
    width: 98% !important;
}

.custom-divider {
    background-color: #dcdcdc !important;
    height: 1px;
    width: 100%;
}

.custom-padding-textbox {
    padding-top: 1px !important;
    padding-bottom: 1px !important;
}

.custom-role-checkbox input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #215cae;
    border-radius: 50%;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    flex-shrink: 0;
}

.custom-role-checkbox input[type="checkbox"]:checked {
    border-width: 6px;
}

.custom-role-checkbox label {
    color: #215caf;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    font-family: Roboto, sans-serif;
    letter-spacing: 0.15px;
    cursor: pointer;
}
</style>
