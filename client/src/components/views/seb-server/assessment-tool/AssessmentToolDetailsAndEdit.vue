<template>
    <div class="text-white text-h5 font-weight-black ml-10 mt-5 ">
        {{ translate("titles.settings") }}
    </div>

    <v-row class="mt-10 w-98 h-100">
        <!-- settings navigation-->
        <SettingsNavigation/>

        <v-col elevation="4" cols="9" class="bg-white rounded-lg">
            <v-row class="d-flex align-center justify-space-between px-6 pt-6">
                <div class="text-primary text-h5 font-weight-bold">
                    {{ translate("titles.assessmentToolEdit") }}
                </div>
                <v-chip
                    class="ma-2 text-subtitle-1 px-5 py-2 font-weight-bold"
                    :color="active ? 'success' : 'error'"
                    text-color="white"
                    size="large"
                    label
                    :disabled="isSaving"
                    @click="!isSaving && toggleStatusLocally()"
                    style="cursor:pointer;"
                >
                    {{
                        active
                            ? translate('assessmentToolConnections.assessmentToolsPage.filters.activeSelector')
                            : translate('assessmentToolConnections.assessmentToolsPage.filters.inactiveSelector')
                    }}
                </v-chip>
            </v-row>

            <v-divider class="custom-divider mx-6 my-4 mt-7"/>
            <v-row class="px-8 mt-2">
                <div class="text-body-2 text-grey-darken-1" style="visibility: hidden">
                    {{
                        translate("assessmentToolConnections.createAssessmentToolConnectionsPage.info.assessmentToolConnectionsCreationInfo")
                    }}
                </div>
            </v-row>

            <!-- Form -->
            <v-sheet class="rounded-lg mt-4" style="min-height: 46.9vh">
                <v-form ref="formRef" @keyup.enter="onSave()">
                    <v-col cols="12" md="12" class="pa-0 mb-4 h-100">
                        <v-card-text>

                            <!-- First Section -->
                            <v-row dense>
                                <v-col>
                                    <!-- Institution (never changeable) -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            required
                                            prepend-inner-icon="mdi-domain"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.institutionLabel')"
                                            variant="outlined"
                                            v-model="institution"
                                            :items="institutions"
                                            item-title="name"
                                            item-value="modelId"
                                            :rules="[requiredRule]"
                                            :disabled="true"
                                        />
                                    </v-col>

                                    <!-- Type -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            required
                                            prepend-inner-icon="mdi-shape-outline"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.typeLabel')"
                                            variant="outlined"
                                            v-model="lmsType"
                                            :items="lmsTypeItems"
                                            item-title="label"
                                            item-value="value"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>
                                </v-col>

                                <!-- Second Column -->
                                <v-col>
                                    <!-- Name -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.nameLabel')"
                                            variant="outlined"
                                            v-model="name"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>
                                </v-col>
                            </v-row>

                            <!-- Second Section -->
                            <v-row dense>
                                <v-col>
                                    <!-- Assessment Tool Server Address-->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            prepend-inner-icon="mdi-email-outline"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.assessmentToolServerAddressLabel')"
                                            variant="outlined"
                                            v-model="assessmentToolServerAddress"
                                            :rules="[requiredRule, httpPrefixRule]"
                                            validate-on="blur"
                                        />
                                    </v-col>

                                    <!-- Access Token -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            ref="confirmPasswordFieldRef"
                                            required
                                            :type="confirmPasswordVisible ? 'text' : 'password'"
                                            prepend-inner-icon="mdi-key-variant"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.accessTokenLabel')"
                                            variant="outlined"
                                            v-model="accessToken"
                                            validate-on="blur"
                                            class="mb-2"
                                        >
                                            <template #append-inner>
                                                <v-btn
                                                    density="compact"
                                                    variant="text"
                                                    :icon="confirmPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                    @click="confirmPasswordVisible = !confirmPasswordVisible"
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                </v-col>

                                <v-col>
                                    <!-- Assessment Tool Server Username -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            prepend-inner-icon="mdi-account"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.assessmentToolServerUsernameLabel')"
                                            variant="outlined"
                                            v-model="assessmentToolServerUsername"
                                            :rules="[requiredRule]"
                                            validate-on="blur"
                                        />
                                    </v-col>

                                    <!-- Assessment Tool Server Password -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            :type="passwordVisible ? 'text' : 'password'"
                                            prepend-inner-icon="mdi-lock-outline"
                                            density="compact"
                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.assessmentToolServerPasswordLabel')"
                                            variant="outlined"
                                            v-model="assessmentToolServerPassword"
                                            :rules="[requiredRule]"
                                            validate-on="blur"
                                        >
                                            <template #append-inner>
                                                <v-btn
                                                    density="compact"
                                                    variant="text"
                                                    :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                    @click="passwordVisible = !passwordVisible"
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                </v-col>
                            </v-row>

                            <!-- Third Section for proxy stuff -->
                            <v-row dense>
                                <v-divider class="custom-divider mx-1 my-2"/>
                                <v-col>
                                    <!-- With Proxy -->
                                    <v-col cols="6" md="6" class="custom-padding-textbox">
                                        <div class="d-flex align-center justify-space-between w-100">
                                            <label class="text-grey-darken-1 text-body-1 ml-11">
                                                {{
                                                    translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.withProxyLabel')
                                                }}
                                            </label>

                                            <v-switch
                                                v-model="withProxy"
                                                inset
                                                hide-details
                                                density="compact"
                                                color="primary"
                                                class="ml-4"
                                                :aria-label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.withProxyAria')"
                                            />
                                        </div>
                                    </v-col>
                                </v-col>
                            </v-row>

                            <v-row dense>
                                <v-col>
                                    <!-- Animated expansion -->
                                    <v-expand-transition>
                                        <div v-show="withProxy">
                                            <v-row>
                                                <v-col>
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            prepend-inner-icon="mdi-server"
                                                            density="compact"
                                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyHostLabel')"
                                                            variant="outlined"
                                                            v-model="proxyHost"
                                                            :rules="[requiredIfProxyRule]"
                                                            validate-on="blur"
                                                        />
                                                    </v-col>

                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            prepend-inner-icon="mdi-numeric"
                                                            density="compact"
                                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyPortLabel')"
                                                            variant="outlined"
                                                            v-model="proxyPort"
                                                            type="number"
                                                            inputmode="numeric"
                                                            :rules="[requiredIfProxyRule, portNumberRule]"
                                                            validate-on="blur"
                                                        />
                                                    </v-col>
                                                </v-col>

                                                <v-col>
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            prepend-inner-icon="mdi-account-outline"
                                                            density="compact"
                                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyUsernameLabel')"
                                                            variant="outlined"
                                                            v-model="proxyUsername"
                                                            :rules="[requiredIfProxyRule]"
                                                            validate-on="blur"
                                                        />
                                                    </v-col>

                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            :type="proxyPasswordVisible ? 'text' : 'password'"
                                                            prepend-inner-icon="mdi-lock-outline"
                                                            density="compact"
                                                            :label="translate('assessmentToolConnections.createAssessmentToolConnectionsPage.labels.proxyPasswordLabel')"
                                                            variant="outlined"
                                                            v-model="proxyPassword"
                                                            :rules="[requiredIfProxyRule]"
                                                            validate-on="blur"
                                                        >
                                                            <template #append-inner>
                                                                <v-btn
                                                                    density="compact"
                                                                    variant="text"
                                                                    :icon="proxyPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                                    @click="proxyPasswordVisible = !proxyPasswordVisible"
                                                                />
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>
                                                </v-col>
                                            </v-row>
                                        </div>
                                    </v-expand-transition>
                                </v-col>
                            </v-row>

                        </v-card-text>
                    </v-col>
                </v-form>
            </v-sheet>

            <v-row class="px-6 pt-3">
                <v-col cols="12" md="12" class="pa-0 mb-4 ">
                    <v-row>
                        <v-spacer>
                        </v-spacer>
                        <v-col>
                            <div class="d-flex justify-end">
                                <v-btn
                                    rounded="sm"
                                    color="black"
                                    variant="outlined"
                                    @click="onBack()"
                                >
                                    {{ translate("general.backButton") }}
                                </v-btn>

                                <v-btn
                                    rounded="sm"
                                    color="primary"
                                    variant="flat"
                                    class="ml-2"
                                    :loading="isSaving"
                                    :disabled="!canSave"
                                    @click="onSave()"
                                >
                                    {{
                                        translate('assessmentToolConnections.assessmentToolDetailAndEditPage.buttons.saveChanges')
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
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue';
import {useRoute} from 'vue-router';
import {useAppBarStore, useLayoutStore} from '@/stores/store';
import {translate} from '@/utils/generalUtils';
import {useUserAccountStore as useAuthenticatedUserAccountStore} from "@/stores/authentication/authenticationStore";
import {LMSTypeEnum} from "@/models/seb-server/assessmentToolEnums";
import {getInstitutions} from "@/services/seb-server/api-services/institutionService";
import * as assessmentToolViewService from "@/services/seb-server/component-services/assessmentToolViewService";
import router from "@/router/router";
import {navigateTo} from "@/router/navigation";
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
const assessmentToolServerUsername = ref<string>("");
const assessmentToolServerPassword = ref<string>("");
const accessToken = ref<string>("");
const withProxy = ref<boolean>(false);

const proxyHost = ref<string>('');
const proxyPort = ref<string>('');
const proxyUsername = ref<string>('');
const proxyPassword = ref<string>('');
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


// Validation rules
const requiredMessage = translate("assessmentToolConnections.assessmentToolDetailAndEditPage.validation.required");
const invalidPortMessage = translate("assessmentToolConnections.assessmentToolDetailAndEditPage.validation.invalidPort") || "Invalid port";
const httpPrefixMessage = translate("assessmentToolConnections.assessmentToolDetailAndEditPage.validation.httpPrefix") || "Must start with http://";

const requiredRule = (v: string) => !!v || requiredMessage;
const requiredIfProxyRule = (v: string) => {
    if (!withProxy.value) return true;
    return (!!v && v.toString().trim().length > 0) || requiredMessage;
};


const portNumberRule = (v: string) => {
    if (!withProxy.value) return true;
    const n = Number(v);
    return (Number.isInteger(n) && n >= 1 && n <= 65535) || invalidPortMessage;
};
const httpPrefixRule = (v: string) => /^https?:\/\//i.test(v) || httpPrefixMessage;

const lmsTypeItems = Object.values(LMSTypeEnum).map((v) => ({
    label: translate(`assessmentToolConnections.lmsTypes.${v}`),
    value: v as LMSTypeEnum,
}));

const statusChanged = computed(() =>
    initialActiveStatus.value !== null && active.value !== initialActiveStatus.value
);

const canSave = computed(() =>
    !isSaving.value && (statusChanged.value || (isDirty.value && !isSaveDisabled.value))
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
        const dto: AssessmentTool | null = await assessmentToolViewService.getAssessmentTool(idNum);
        if (dto) {
            populateFromDto(dto);
            fetchedId.value = dto.id;
        }
    }

    // Fallback if institution missing
    if (!institution.value) {
        institution.value = authenticatedUserAccountStore.userAccount?.institutionId?.toString() ?? null;
    }

    takeSnapshot();
});

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});

function populateFromDto(dto: AssessmentTool) {
    institution.value = dto.institutionId != null ? String(dto.institutionId) : null;
    name.value = dto.name ?? '';
    lmsType.value = (dto.lmsType as LMSTypeEnum) ?? null;
    assessmentToolServerAddress.value = dto.lmsUrl ?? '';
    assessmentToolServerUsername.value = dto.lmsClientname ?? '';
    assessmentToolServerPassword.value = dto.lmsClientsecret ?? '';
    accessToken.value = dto.lmsRestApiToken ?? '';

    // Proxy fields
    proxyHost.value = dto.lmsProxyHost ?? '';
    proxyPort.value = dto.lmsProxyPort != null ? String(dto.lmsProxyPort) : '';
    proxyUsername.value = dto.lmsProxyAuthUsername ?? '';
    proxyPassword.value = dto.lmsProxyAuthSecret ?? '';

    active.value = !!dto.active;
    initialActiveStatus.value = !!dto.active;

    // Auto-enable withProxy if any proxy detail present
    withProxy.value = !!(
        (dto.lmsProxyHost && dto.lmsProxyHost.trim()) ||
        (dto.lmsProxyPort != null && String(dto.lmsProxyPort).trim()) ||
        (dto.lmsProxyAuthUsername && dto.lmsProxyAuthUsername.trim()) ||
        (dto.lmsProxyAuthSecret && dto.lmsProxyAuthSecret.trim())
    );
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
    return JSON.stringify(currentFormState()) !== JSON.stringify(originalSnapshot.value);
});

const isSaveDisabled = computed(() => {
    const baseMissing =
        !institution.value ||
        !name.value.trim() ||
        !lmsType.value ||
        !assessmentToolServerAddress.value.trim() ||
        !assessmentToolServerUsername.value.trim() ||
        !assessmentToolServerPassword.value.trim();

    if (baseMissing) return true;

    // address must start with http://
    if (!assessmentToolServerAddress.value.startsWith('http://')) return true;

    if (!withProxy.value) return false;

    // withProxy on -> require proxy fields
    const proxyMissing =
        !proxyHost.value.trim() ||
        !proxyPort.value.trim() ||
        !proxyUsername.value.trim() ||
        !proxyPassword.value.trim();

    const n = Number(proxyPort.value);
    const badPort = !(Number.isInteger(n) && n >= 1 && n <= 65535);

    return proxyMissing || badPort;
});

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
        const {valid} = await (formRef.value as any).validate();
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

    const payload: UpdateAssessmentToolPar = {
        id: idToSend,
        institutionId: institution.value!,
        name: name.value,
        lmsType: lmsType.value as string,
        lmsUrl: assessmentToolServerAddress.value,
        lmsClientname: assessmentToolServerUsername.value,
        lmsClientsecret: assessmentToolServerPassword.value,
        lmsRestApiToken: accessToken.value,
        ...(withProxy.value
            ? {
                lmsProxyHost: proxyHost.value,
                lmsProxyPort: Number(proxyPort.value.trim()),
                lmsProxyAuthUsername: proxyUsername.value,
                lmsProxyAuthSecret: proxyPassword.value,
            }
            : {
                lmsProxyHost: '',
                lmsProxyPort: 0,
                lmsProxyAuthUsername: '',
                lmsProxyAuthSecret: '',
            })
    };

    await assessmentToolViewService.editAssessmentTool(payload);
}

</script>

<style scoped>
.nav-hover:hover .nav-link {
    color: #215caf;
}

.w-98 {
    width: 98% !important;
}

.custom-divider {
    background-color: #DCDCDC !important;
    height: 1px;
    width: 100%;
}

.custom-padding-textbox {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
}

.custom-role-checkbox input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border: 2px solid #215CAE;
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
