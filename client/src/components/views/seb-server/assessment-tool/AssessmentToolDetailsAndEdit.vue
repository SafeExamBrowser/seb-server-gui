<template>
    <div
        class="text-white text-h5 font-weight-black ml-10 mt-5"
        data-testid="assessmentToolsEdit-page-title"
    >
        {{ translate("titles.settings") }}
    </div>

    <v-row class="mt-10 w-98 h-100">
        <!-- settings navigation -->
        <SettingsNavigation
            data-testid="assessmentToolsEdit-settingsNavigation-component"
        />

        <v-col
            class="bg-white rounded-lg"
            cols="9"
            data-testid="assessmentToolsEdit-form-container"
            elevation="4"
        >
            <v-row
                class="d-flex align-center justify-space-between px-6 pt-6"
                data-testid="assessmentToolsEdit-header-row"
            >
                <div
                    class="text-primary text-h5 font-weight-bold"
                    data-testid="assessmentToolsEdit-title-text"
                >
                    {{ translate("titles.assessmentToolEdit") }}
                </div>

                <v-chip
                    class="ma-2 text-subtitle-1 px-5 py-2 font-weight-bold"
                    :color="active ? 'success' : 'error'"
                    data-testid="assessmentToolsEdit-status-toggle"
                    :disabled="isSaving"
                    label
                    size="large"
                    style="cursor: pointer"
                    text-color="white"
                    @click="!isSaving && toggleStatusLocally()"
                >
                    {{
                        active
                            ? translate(
                                  "assessmentToolConnections.assessmentToolsPage.filters.activeSelector",
                              )
                            : translate(
                                  "assessmentToolConnections.assessmentToolsPage.filters.inactiveSelector",
                              )
                    }}
                </v-chip>
            </v-row>

            <v-divider
                class="custom-divider mx-6 my-4 mt-7"
                data-testid="assessmentToolsEdit-divider-top"
            />

            <v-row
                class="px-8 mt-2"
                data-testid="assessmentToolsEdit-intro-row"
            >
                <div
                    class="text-body-2 text-grey-darken-1"
                    data-testid="assessmentToolsEdit-intro-text"
                    style="visibility: hidden"
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
                data-testid="assessmentToolsEdit-form-sheet"
                style="min-height: 46.9vh"
            >
                <v-form
                    ref="formRef"
                    data-testid="assessmentToolsEdit-form"
                    @keyup.enter="onSave()"
                >
                    <v-col class="pa-0 mb-4 h-100" cols="12" md="12">
                        <v-card-text>
                            <!-- First Section -->
                            <v-row
                                data-testid="assessmentToolsEdit-form-row-1"
                                dense
                            >
                                <v-col
                                    cols="8"
                                    data-testid="assessmentToolsEdit-form-left-col"
                                >
                                    <!-- Institution (never changeable) -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-select
                                            v-model="institution"
                                            data-testid="assessmentToolsEdit-institution-select"
                                            density="compact"
                                            :disabled="true"
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
                                            data-testid="assessmentToolsEdit-name-input"
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
                                            data-testid="assessmentToolsEdit-type-select"
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

                                    <!-- Assessment Tool Server Address-->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="
                                                assessmentToolServerAddress
                                            "
                                            data-testid="assessmentToolsEdit-serverAddress-input"
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
                                            data-testid="assessmentToolsEdit-authMode-row"
                                        >
                                            <label
                                                class="text-grey-darken-1 text-body-1 ml-1 mb-6 mt-3"
                                                data-testid="assessmentToolsEdit-authMode-label"
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
                                                data-testid="assessmentToolsEdit-authMode-toggle"
                                                density="comfortable"
                                                mandatory
                                            >
                                                <v-btn
                                                    data-testid="assessmentToolsEdit-authMode-client-button"
                                                    value="client"
                                                >
                                                    {{
                                                        translate(
                                                            "assessmentToolConnections.createAssessmentToolConnectionsPage.labels.clientCredentials",
                                                        )
                                                    }}
                                                </v-btn>
                                                <v-btn
                                                    data-testid="assessmentToolsEdit-authMode-token-button"
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

                                    <!-- Client Credentials (only in client mode) -->
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
                                                data-testid="assessmentToolsEdit-client-username-input"
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
                                                data-testid="assessmentToolsEdit-client-password-input"
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
                                                        data-testid="assessmentToolsEdit-client-password-toggle"
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

                                    <!-- REST API Token (only in token mode) -->
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
                                                data-testid="assessmentToolsEdit-token-input"
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
                                                        data-testid="assessmentToolsEdit-token-toggle"
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

                                <!-- Second Column first section -->
                                <v-col
                                    cols="4"
                                    data-testid="assessmentToolsEdit-form-right-col"
                                >
                                </v-col>
                            </v-row>

                            <!-- Proxy toggle and expansion -->
                            <v-row
                                data-testid="assessmentToolsEdit-proxy-section"
                                dense
                            >
                                <v-divider
                                    class="custom-divider mx-1 my-2"
                                    data-testid="assessmentToolsEdit-divider-proxy"
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
                                                data-testid="assessmentToolsEdit-proxy-label"
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
                                                        'assessmentToolConnections.createAssessmentToolConnectionsPage.labels.withProxyArea',
                                                    )
                                                "
                                                class="ml-4"
                                                color="primary"
                                                data-testid="assessmentToolsEdit-proxy-switch"
                                                density="compact"
                                                hide-details
                                                inset
                                            />
                                        </div>
                                    </v-col>
                                </v-col>
                            </v-row>

                            <v-row
                                data-testid="assessmentToolsEdit-proxy-fields-row"
                                dense
                            >
                                <v-col>
                                    <!-- Animated expansion -->
                                    <v-expand-transition>
                                        <div
                                            v-show="withProxy"
                                            data-testid="assessmentToolsEdit-proxy-fields"
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
                                                            data-testid="assessmentToolsEdit-proxy-host-input"
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
                                                            data-testid="assessmentToolsEdit-proxy-port-input"
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
                                                            data-testid="assessmentToolsEdit-proxy-username-input"
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
                                                            data-testid="assessmentToolsEdit-proxy-password-input"
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
                                                                    data-testid="assessmentToolsEdit-proxy-password-toggle"
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

            <!-- Actions -->
            <v-row
                class="px-6 pt-3"
                data-testid="assessmentToolsEdit-actions-row"
            >
                <v-col class="pa-0 mb-4" cols="12" md="12">
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col>
                            <div class="d-flex justify-end">
                                <v-btn
                                    color="black"
                                    data-testid="assessmentToolsEdit-back-button"
                                    rounded="sm"
                                    variant="outlined"
                                    @click="onBack()"
                                >
                                    {{ translate("general.backButton") }}
                                </v-btn>

                                <v-btn
                                    class="ml-2"
                                    color="primary"
                                    data-testid="assessmentToolsEdit-save-button"
                                    :disabled="!canSave"
                                    :loading="isSaving"
                                    rounded="sm"
                                    variant="flat"
                                    @click="onSave()"
                                >
                                    {{
                                        translate(
                                            "assessmentToolConnections.assessmentToolDetailAndEditPage.buttons.saveChanges",
                                        )
                                    }}
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAppBarStore, useLayoutStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import { useUserAccountStore as useAuthenticatedUserAccountStore } from "@/stores/authentication/authenticationStore";
import { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums";
import { getInstitutions } from "@/services/seb-server/api-services/institutionService";
import * as assessmentToolViewService from "@/services/seb-server/component-services/assessmentToolViewService";
import router from "@/router/router";
import { navigateTo } from "@/router/navigation";
import * as constants from "@/utils/constants";

// Router
const route = useRoute();

// Stores
const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();
const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();

// Fields
const institution = ref<string | null>(null);
const name = ref<string>("");
const lmsType = ref<LMSTypeEnum | null>(null);
const assessmentToolServerAddress = ref<string>("");
const assessmentToolServerUsername = ref<string | null>("");
const assessmentToolServerPassword = ref<string | null>("");
const accessToken = ref<string | null>("");
const withProxy = ref<boolean>(false);

const proxyHost = ref<string | null>(null);
const proxyPort = ref<string | null>(null);
const proxyUsername = ref<string | null>(null);
const proxyPassword = ref<string | null>(null);
const proxyPasswordVisible = ref<boolean>(false);

const formRef = ref();
const passwordVisible = ref<boolean>(false);
const confirmPasswordVisible = ref<boolean>(false);
const confirmPasswordFieldRef = ref();

const institutions = ref<Institution[]>([]);

// Internal state
const originalSnapshot = ref<Record<string, any> | null>(null);
const fetchedId = ref<number | null>(null);
const active = ref<boolean>(false);
const initialActiveStatus = ref<boolean | null>(null);
const isSaving = ref(false);

type AuthMode = "client" | "token";
const authMode = ref<AuthMode>("token");

// Validation rules
const requiredMessage = translate(
    "assessmentToolConnections.assessmentToolDetailAndEditPage.validation.required",
);
const invalidPortMessage =
    translate(
        "assessmentToolConnections.assessmentToolDetailAndEditPage.validation.invalidPort",
    ) || "Invalid port";
const httpPrefixMessage =
    translate(
        "assessmentToolConnections.assessmentToolDetailAndEditPage.validation.mustBeWithUrl",
    ) || "Must start with http://";

const requiredRule = (v: string) => !!v || requiredMessage;
const requiredIfProxyRule = (v: string | null) => {
    if (!withProxy.value) return true;
    return safeTrim(v) !== "" || requiredMessage;
};
const portNumberRule = (v: string | null) => {
    if (!withProxy.value) return true;
    const n = Number(safeTrim(v));
    return (Number.isInteger(n) && n >= 1 && n <= 65535) || invalidPortMessage;
};

const httpPrefixRule = (v: string) =>
    /^https?:\/\//i.test(v) || httpPrefixMessage;

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

const statusChanged = computed(
    () =>
        initialActiveStatus.value !== null &&
        active.value !== initialActiveStatus.value,
);

const canSave = computed(
    () =>
        !isSaving.value &&
        (statusChanged.value || (isDirty.value && !isSaveDisabled.value)),
);

onMounted(async () => {
    appBarStore.title = translate("titles.assessmentTool");
    layoutStore.setBlueBackground(true);

    // Load institutions so the disabled select shows a label
    const inst = await getInstitutions().catch(() => null);
    institutions.value = inst ?? [];

    // Fetch the tool
    const idNum = Number(route.params.lmsId);
    if (Number.isFinite(idNum)) {
        const dto: AssessmentTool | null =
            await assessmentToolViewService.getAssessmentTool(idNum);
        if (dto) {
            populateFromDto(dto);
            fetchedId.value = dto.id;
        }
    }

    // Fallback if institution missing
    if (!institution.value) {
        institution.value =
            authenticatedUserAccountStore.userAccount?.institutionId?.toString() ??
            null;
    }

    takeSnapshot();
});

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});

function populateFromDto(dto: AssessmentTool) {
    institution.value =
        dto.institutionId != null ? String(dto.institutionId) : null;
    name.value = dto.name ?? "";
    lmsType.value = (dto.lmsType as LMSTypeEnum) ?? null;
    assessmentToolServerAddress.value = dto.lmsUrl ?? "";

    // auth mode
    const hasToken = !!safeTrim(dto.lmsRestApiToken);
    const hasClient =
        !!safeTrim(dto.lmsClientname) && !!safeTrim(dto.lmsClientsecret);

    if (hasToken) {
        authMode.value = "token";
        accessToken.value = dto.lmsRestApiToken ?? "";
        assessmentToolServerUsername.value = null;
        assessmentToolServerPassword.value = null;
    } else if (hasClient) {
        authMode.value = "client";
        assessmentToolServerUsername.value = dto.lmsClientname ?? "";
        assessmentToolServerPassword.value = dto.lmsClientsecret ?? "";
        accessToken.value = null;
    } else {
        authMode.value = "token";
        accessToken.value = null;
        assessmentToolServerUsername.value = null;
        assessmentToolServerPassword.value = null;
    }

    // proxy (leave null if backend omitted)
    proxyHost.value = dto.lmsProxyHost ?? null;
    proxyPort.value =
        dto.lmsProxyPort != null ? String(dto.lmsProxyPort) : null;
    proxyUsername.value = dto.lmsProxyAuthUsername ?? null;
    proxyPassword.value = dto.lmsProxyAuthSecret ?? null;

    withProxy.value = !!(
        safeTrim(dto.lmsProxyHost) ||
        (dto.lmsProxyPort != null && String(dto.lmsProxyPort).trim() !== "") ||
        safeTrim(dto.lmsProxyAuthUsername) ||
        safeTrim(dto.lmsProxyAuthSecret)
    );

    active.value = !!dto.active;
    initialActiveStatus.value = !!dto.active;
}

function toggleStatusLocally() {
    active.value = !active.value;
}

async function persistStatusChange() {
    const id = String(fetchedId.value ?? route.params.lmsId);
    if (active.value) {
        await assessmentToolViewService.activateAssessmentTool(id);
    } else {
        await assessmentToolViewService.deactivateAssessmentTool(id);
    }
}

function currentFormState() {
    return {
        institution: institution.value,
        name: name.value,
        lmsType: lmsType.value,
        assessmentToolServerAddress: assessmentToolServerAddress.value,
        assessmentToolServerUsername: assessmentToolServerUsername.value,
        assessmentToolServerPassword: assessmentToolServerPassword.value,
        accessToken: accessToken.value,
        withProxy: withProxy.value,
        proxyHost: proxyHost.value,
        proxyPort: proxyPort.value,
        proxyUsername: proxyUsername.value,
        proxyPassword: proxyPassword.value,
    };
}

function takeSnapshot() {
    originalSnapshot.value = JSON.parse(JSON.stringify(currentFormState()));
}

// show Save/Cancel only when any value differs from snapshot
const isDirty = computed(() => {
    if (!originalSnapshot.value) return false;
    return (
        JSON.stringify(currentFormState()) !==
        JSON.stringify(originalSnapshot.value)
    );
});

const isSaveDisabled = computed(() => {
    const baseMissing =
        !institution.value ||
        safeTrim(name.value) === "" ||
        !lmsType.value ||
        safeTrim(assessmentToolServerAddress.value) === "";

    if (baseMissing) return true;
    if (!/^https?:\/\//i.test(assessmentToolServerAddress.value ?? ""))
        return true;
    if (!isAuthValid.value) return true;

    if (!withProxy.value) return false;

    const proxyMissing =
        safeTrim(proxyHost.value) === "" ||
        safeTrim(proxyPort.value) === "" ||
        safeTrim(proxyUsername.value) === "" ||
        safeTrim(proxyPassword.value) === "";

    const n = Number(safeTrim(proxyPort.value));
    const badPort = !(Number.isInteger(n) && n >= 1 && n <= 65535);

    return proxyMissing || badPort;
});

const safeTrim = (v: string | null | undefined) => (v ?? "").trim();

function onBack() {
    if (window.history.length > 1) {
        router.back();
    } else {
        navigateTo(constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE);
    }
}

async function onSave() {
    if (isSaving.value) return;
    const fieldsChanged = isDirty.value;
    const statusWasChanged = statusChanged.value;

    // If fields changed, validate; status-only skips validation
    if (fieldsChanged) {
        const { valid } = await (formRef.value as any).validate();
        if (!valid || isSaveDisabled.value) return;
    }

    isSaving.value = true;
    try {
        // 1) Only status changed
        if (!fieldsChanged && statusWasChanged) {
            await persistStatusChange();
            initialActiveStatus.value = active.value;
            return;
        }

        // 2) Only fields changed
        if (fieldsChanged && !statusWasChanged) {
            await editAssessmentToolOnly();
            takeSnapshot();
            return;
        }

        // 3) Both changed: status first, then fields
        if (fieldsChanged && statusWasChanged) {
            await persistStatusChange();
            await editAssessmentToolOnly();
            initialActiveStatus.value = active.value;
            takeSnapshot();
        }
    } finally {
        isSaving.value = false;
    }
}

async function editAssessmentToolOnly() {
    const idToSend = String(fetchedId.value ?? route.params.lmsId);

    const common: any = {
        id: idToSend,
        institutionId: institution.value!,
        name: name.value,
        lmsType: lmsType.value as string,
        lmsUrl: assessmentToolServerAddress.value,
        ...(withProxy.value && {
            lmsProxyHost: proxyHost.value ?? undefined,
            lmsProxyPort:
                proxyPort.value != null && String(proxyPort.value).trim() !== ""
                    ? Number(String(proxyPort.value).trim())
                    : undefined,
            lmsProxyAuthUsername: proxyUsername.value ?? undefined,
            lmsProxyAuthSecret: proxyPassword.value ?? undefined,
        }),
    };

    const authPart =
        authMode.value === "client"
            ? {
                  lmsClientname: assessmentToolServerUsername.value,
                  lmsClientsecret: assessmentToolServerPassword.value,
                  lmsRestApiToken: "",
              }
            : {
                  lmsRestApiToken: accessToken.value,
                  lmsClientname: "",
                  lmsClientsecret: "",
              };

    const payload: UpdateAssessmentToolPar = {
        ...common,
        ...authPart,
    };

    await assessmentToolViewService.editAssessmentTool(payload);
}

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
