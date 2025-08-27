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
                    {{ translate("connectionConfigurations.assessmentToolDetailAndEditPage.title") }}
                </div>
                <v-chip
                    class=" text-subtitle-1 px-5 py-2 font-weight-bold"
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
            <v-row class="px-8 mt-2 d-flex justify-space-between">
                <div class="text-body-2 text-grey-darken-1" style="visibility: hidden">
                    {{ translate("connectionConfigurations.assessmentToolDetailAndEditPage.info") }}
                </div>
                <div class="text-body-2 text-grey-darken-1">
                    {{
                        translate("userAccount.userAccountDetailAndEditPage.info.createdAtInfo") + formatDisplayDate(creationDate)
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
                                    <!-- Name* -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            required
                                            prepend-inner-icon="mdi-account-outline"
                                            density="compact"
                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.name')"
                                            variant="outlined"
                                            v-model="name"
                                            :rules="[requiredRule]"
                                        />
                                    </v-col>

                                    <!-- Configuration Password (optional) -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            ref="configPwdRef"
                                            :type="configurationPasswordVisible ? 'text' : 'password'"
                                            prepend-inner-icon="mdi-key-variant"
                                            density="compact"
                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.configurationPassword')"
                                            variant="outlined"
                                            v-model="configurationPassword"
                                            validate-on="input"
                                        >
                                            <template #append-inner>
                                                <v-btn
                                                    density="compact"
                                                    variant="text"
                                                    :icon="configurationPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                    @click="configurationPasswordVisible = !configurationPasswordVisible"
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>

                                    <!-- Encrypt With Certificate (optional) -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            prepend-inner-icon="mdi-shield-key-outline"
                                            density="compact"
                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.encryptWithCertificate')"
                                            variant="outlined"
                                            v-model="encryptWithCertificate"
                                            :items="certificateItems"
                                            item-title="label"
                                            item-value="value"
                                            :loading="certificatesLoading"
                                            :disabled="certificatesLoading"
                                            :menu-props="{ maxHeight: 240 }"
                                            @update:modelValue="handleCertChange"
                                        >
                                            <template #item="{ props, item }">
                                                <v-list-item v-bind="props">
                                                    <template #prepend>
                                                        <v-icon v-if="item.raw.value === '__UPLOAD__'">mdi-upload</v-icon>
                                                    </template>
                                                </v-list-item>

                                                <v-divider v-if="item.raw.value === '__UPLOAD__'" class="my-1" />
                                            </template>

                                            <template v-if="!hasRealCerts" #append-item>
                                                <div class="text-caption text-grey-darken-1 px-4 py-2">
                                                    {{ translate('connectionConfigurations.createConnectionConfigurationPage.labels.noCertificatesUploadedYet') }}
                                                </div>
                                            </template>
                                        </v-select>
                                    </v-col>

                                    <!-- Ping Interval* (number) -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            prepend-inner-icon="mdi-timer-outline"
                                            density="compact"
                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.pingInterval')"
                                            variant="outlined"
                                            v-model.number="pingInterval"
                                            type="number"
                                            inputmode="numeric"
                                            :rules="[requiredNumberRule]"
                                            validate-on="blur"
                                        />
                                    </v-col>

                                </v-col>

                                <!-- Second Section -->
                                <v-col>
                                    <!-- Configuration Purpose -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            prepend-inner-icon="mdi-shape-outline"
                                            density="compact"
                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.configurationPurpose')"
                                            variant="outlined"
                                            v-model="configurationPurpose"
                                            :items="configurationPurposeItems"
                                            item-title="label"
                                            item-value="value"
                                            :rules="[requiredRule]"
                                            validate-on="input"
                                        />
                                    </v-col>

                                    <!-- Confirm Configuration Password (required if configurationPassword set) -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-text-field
                                            ref="confirmConfigPwdRef"
                                            :type="confirmConfigurationPasswordVisible ? 'text' : 'password'"
                                            prepend-inner-icon="mdi-lock-outline"
                                            density="compact"
                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.confirmConfigurationPassword')"
                                            variant="outlined"
                                            v-model="confirmConfigurationPassword"
                                            validate-on="input"
                                            :rules="[configPwdMustMatchRule]"
                                        >
                                            <template #append-inner>
                                                <v-btn
                                                    density="compact"
                                                    variant="text"
                                                    :icon="confirmConfigurationPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                    @click="confirmConfigurationPasswordVisible = !confirmConfigurationPasswordVisible"
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>

                                    <!-- Use asymmetric-only encryption (toggle preserved for layout, not sent) -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <div class="d-flex align-center justify-space-between w-100">
                                            <label class="text-grey-darken-1 text-body-1 ml-11">
                                                {{
                                                    translate('connectionConfigurations.createConnectionConfigurationPage.labels.useAsymmetricOnlyEncryption')
                                                }}
                                            </label>

                                            <v-switch
                                                v-model="asymmetricOnlyEncryption"
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

                            <!-- Third Section for Fallback -->
                            <v-row dense>
                                <v-divider class="custom-divider mx-1 my-2"/>

                                <v-col>
                                    <!-- With Fallback -->
                                    <v-col cols="6" md="6" class="custom-padding-textbox">
                                        <div class="d-flex align-center justify-space-between w-100">
                                            <label class="text-grey-darken-1 text-body-1 ml-11">
                                                {{
                                                    translate('connectionConfigurations.createConnectionConfigurationPage.labels.withFallback')
                                                }}
                                            </label>

                                            <v-switch
                                                v-model="withFallback"
                                                inset
                                                hide-details
                                                density="compact"
                                                color="primary"
                                                class="ml-4"
                                                :aria-label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.withFallbackArea')"
                                            />
                                        </div>
                                    </v-col>
                                </v-col>
                            </v-row>

                            <v-row dense>
                                <v-col>
                                    <!-- Animated expansion -->
                                    <v-expand-transition>
                                        <div v-show="withFallback">
                                            <v-row>
                                                <v-col>
                                                    <!-- Fallback Start URL* -->
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            prepend-inner-icon="mdi-server"
                                                            density="compact"
                                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.fallbackStartURL')"
                                                            variant="outlined"
                                                            v-model="fallbackStartUrl"
                                                            :rules="[requiredIfFallbackRule, urlIfFallbackRule]"
                                                            validate-on="blur"
                                                        />
                                                    </v-col>

                                                    <!-- Connection Attempts* (number) -->
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            prepend-inner-icon="mdi-numeric"
                                                            density="compact"
                                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.connectionAttempts')"
                                                            variant="outlined"
                                                            v-model.number="connectionAttempts"
                                                            type="number"
                                                            inputmode="numeric"
                                                            :rules="[requiredNumberIfFallbackRule]"
                                                            validate-on="blur"
                                                        />
                                                    </v-col>

                                                    <!-- Fallback Password (optional) -->
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            ref="fallbackPwdRef"
                                                            :type="fallbackPasswordVisible ? 'text' : 'password'"
                                                            prepend-inner-icon="mdi-key-variant"
                                                            density="compact"
                                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.fallbackPassword')"
                                                            variant="outlined"
                                                            v-model="fallbackPassword"
                                                            validate-on="input"
                                                        >
                                                            <template #append-inner>
                                                                <v-btn
                                                                    density="compact"
                                                                    variant="text"
                                                                    :icon="fallbackPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                                    @click="fallbackPasswordVisible = !fallbackPasswordVisible"
                                                                />
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>

                                                    <!-- Quit Password (optional) -->
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            ref="quitPwdRef"
                                                            :type="quitPasswordVisible ? 'text' : 'password'"
                                                            prepend-inner-icon="mdi-key-variant"
                                                            density="compact"
                                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.quitPassword')"
                                                            variant="outlined"
                                                            v-model="quitPassword"
                                                            validate-on="input"
                                                        >
                                                            <template #append-inner>
                                                                <v-btn
                                                                    density="compact"
                                                                    variant="text"
                                                                    :icon="quitPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                                    @click="quitPasswordVisible = !quitPasswordVisible"
                                                                />
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>
                                                </v-col>
                                                <v-col>

                                                    <!-- Interval* (number) -->
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            prepend-inner-icon="mdi-timer-outline"
                                                            density="compact"
                                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.interval')"
                                                            variant="outlined"
                                                            v-model.number="fallbackInterval"
                                                            type="number"
                                                            inputmode="numeric"
                                                            :rules="[requiredNumberIfFallbackRule]"
                                                            validate-on="blur"
                                                        />
                                                    </v-col>

                                                    <!-- Connection Timeout* (number) -->
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            prepend-inner-icon="mdi-clock-outline"
                                                            density="compact"
                                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.connectionTimeout')"
                                                            variant="outlined"
                                                            v-model.number="connectionTimeout"
                                                            type="number"
                                                            inputmode="numeric"
                                                            :rules="[requiredNumberIfFallbackRule]"
                                                            validate-on="blur"
                                                        />
                                                    </v-col>

                                                    <!-- Confirm Fallback Password (required if fallbackPassword set) -->
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            ref="confirmFallbackPwdRef"
                                                            :type="confirmFallbackPasswordVisible ? 'text' : 'password'"
                                                            prepend-inner-icon="mdi-key-variant"
                                                            density="compact"
                                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.confirmFallbackPassword')"
                                                            variant="outlined"
                                                            v-model="confirmFallbackPassword"
                                                            validate-on="input"
                                                            :rules="[fallbackPwdMustMatchRule]"
                                                        >
                                                            <template #append-inner>
                                                                <v-btn
                                                                    density="compact"
                                                                    variant="text"
                                                                    :icon="confirmFallbackPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                                    @click="confirmFallbackPasswordVisible = !confirmFallbackPasswordVisible"
                                                                />
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>

                                                    <!-- Confirm Quit Password (required if quitPassword set) -->
                                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                                        <v-text-field
                                                            ref="confirmQuitPwdRef"
                                                            :type="confirmQuitPasswordVisible ? 'text' : 'password'"
                                                            prepend-inner-icon="mdi-key-variant"
                                                            density="compact"
                                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.confirmQuitPassword')"
                                                            variant="outlined"
                                                            v-model="confirmQuitPassword"
                                                            validate-on="input"
                                                            :rules="[quitPwdMustMatchRule]"
                                                        >
                                                            <template #append-inner>
                                                                <v-btn
                                                                    density="compact"
                                                                    variant="text"
                                                                    :icon="confirmQuitPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                                    @click="confirmQuitPasswordVisible = !confirmQuitPasswordVisible"
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
                        <v-spacer/>
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
                                    {{ translate('connectionConfigurations.assessmentToolDetailAndEditPage.buttons.saveChanges') }}
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>
        </v-col>

        <!-- Upload Certificate Dialog-->
        <AddCertificateDialog
            v-model="certDialog"
            :simulate="true"
            @imported="onCertImported"
        />
    </v-row>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue';
import {useRoute} from 'vue-router';
import {useAppBarStore, useLayoutStore} from '@/stores/store';
import {translate} from '@/utils/generalUtils';
import {navigateTo} from '@/router/navigation';
import * as constants from '@/utils/constants';
import * as connectionConfigurationViewService from '@/services/seb-server/component-services/connectionConfigurationViewService';
import router from '@/router/router';
import * as certificateViewService from "@/services/seb-server/component-services/certificateViewService";
import moment from "moment-timezone";

// Router
const route = useRoute();

// Stores
const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();

// Fields (mirroring the Create page)
const name = ref<string>("");
const configurationPassword = ref<string>("");
const confirmConfigurationPassword = ref<string>("");
const encryptWithCertificate = ref<string | undefined>(undefined);
const pingInterval = ref<number | null>(1000);
const exams = ref<number[]>([]);
const asymmetricOnlyEncryption = ref<boolean>(false);

const withFallback = ref<boolean>(false);
const fallbackStartUrl = ref<string>("");
const fallbackInterval = ref<number | null>(2000);
const connectionAttempts = ref<number | null>(5);
const connectionTimeout = ref<number | null>(30000);
const fallbackPassword = ref<string>("");
const confirmFallbackPassword = ref<string>("");
const quitPassword = ref<string>("");
const confirmQuitPassword = ref<string>("");
const configurationPurpose = ref<string | null>(null);
const institutionId = ref<number | undefined>(undefined);
const creationDate = ref<string | undefined>(undefined);

// UI state
const formRef = ref();
const configurationPasswordVisible = ref<boolean>(false);
const confirmConfigurationPasswordVisible = ref<boolean>(false);
const fallbackPasswordVisible = ref<boolean>(false);
const confirmFallbackPasswordVisible = ref<boolean>(false);
const quitPasswordVisible = ref<boolean>(false);
const confirmQuitPasswordVisible = ref<boolean>(false);
const examsLoading = ref<boolean>(false);
const certificatesLoading = ref<boolean>(false);
const certDialog = ref(false);


// status/state
const active = ref<boolean>(false);
const initialActiveStatus = ref<boolean | null>(null);
const isSaving = ref<boolean>(false);
const fetchedId = ref<number | null>(null);
const originalSnapshot = ref<Record<string, any> | null>(null);

// Refs for validation control
const configPwdRef = ref<any>(null);
const confirmConfigPwdRef = ref<any>(null);
const fallbackPwdRef = ref<any>(null);
const confirmFallbackPwdRef = ref<any>(null);
const quitPwdRef = ref<any>(null);
const confirmQuitPwdRef = ref<any>(null);



const configurationPurposeItems = [
    {
        label: translate('connectionConfigurations.createConnectionConfigurationPage.selectValues.start_exam'),
        value: 'START_EXAM'
    },
    {
        label: translate('connectionConfigurations.createConnectionConfigurationPage.selectValues.configure_client'),
        value: 'CONFIGURE_CLIENT'
    }
];

const certificateItems = ref<{ label: string; value: string }[]>([
    {
        label: translate('certificates.certificateDialog.uploadCertificate'),
        value: '__UPLOAD__',
    },
]);


// Validation messages
const requiredMessage = translate("connectionConfigurations.createConnectionConfigurationPage.validation.required");
const mustMatchMessage = translate('connectionConfigurations.createConnectionConfigurationPage.validation.noMatch');
const mustBeNumberMessage = translate('connectionConfigurations.createConnectionConfigurationPage.validation.mustBeNumber');
const mustBeUrlMessage = translate('connectionConfigurations.createConnectionConfigurationPage.validation.assessmentToolServerAddressLabel');

// Rules (same as create)
const requiredRule = (v: any) => {
    if (v === null || v === undefined) return requiredMessage;
    return (typeof v === 'number' ? true : String(v).trim().length > 0) || requiredMessage;
};
const numberRule = (v: any) => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? mustBeNumberMessage : true);
const requiredNumberRule = (v: any) => requiredRule(v) === true && numberRule(v) === true || (isNaN(Number(v)) ? mustBeNumberMessage : requiredMessage);

const requiredIfFallbackRule = (v: any) => !withFallback.value || requiredRule(v) === true || requiredMessage;
const requiredNumberIfFallbackRule = (v: any) => !withFallback.value || requiredNumberRule(v) === true || (isNaN(Number(v)) ? mustBeNumberMessage : requiredMessage);
const urlIfFallbackRule = (v: any) => {
    if (!withFallback.value) return true; // only check when fallback enabled
    if (!v || typeof v !== 'string') return mustBeUrlMessage;
    const trimmed = v.trim().toLowerCase();
    return (trimmed.startsWith("http://") || trimmed.startsWith("https://")) || mustBeUrlMessage;
};

const configPwdMustMatchRule = (_v: any) => {
    const a = (configurationPassword.value ?? '').trim();
    const b = (confirmConfigurationPassword.value ?? '').trim();
    if (!a && !b) return true;
    if (!a || !b) return mustMatchMessage;
    return a === b || mustMatchMessage;
};

const fallbackPwdMustMatchRule = (_v: any) => {
    const a = (fallbackPassword.value ?? '').trim();
    const b = (confirmFallbackPassword.value ?? '').trim();
    if (!a && !b) return true;
    if (!a || !b) return mustMatchMessage;
    return a === b || mustMatchMessage;
};

const quitPwdMustMatchRule = (_v: any) => {
    const a = (quitPassword.value ?? '').trim();
    const b = (confirmQuitPassword.value ?? '').trim();
    if (!a && !b) return true;
    if (!a || !b) return mustMatchMessage;
    return a === b || mustMatchMessage;
};

// Derived state
const statusChanged = computed(() => initialActiveStatus.value !== null && active.value !== initialActiveStatus.value);

const hasRealCerts = computed(() => certificateItems.value.length > 1);

const isSaveDisabled = computed(() => {
    if (!name.value.trim()) return true;
    if (!configurationPurpose.value) return true;
    if (pingInterval.value === null || isNaN(Number(pingInterval.value))) return true;

    // config pwd pair
    const a = (configurationPassword.value ?? '').trim();
    const b = (confirmConfigurationPassword.value ?? '').trim();
    if (a || b) {
        if (!a || !b) return true;
        if (a !== b) return true;
    }

    if (withFallback.value) {
        if (!fallbackStartUrl.value) return true;
        if (fallbackInterval.value === null || isNaN(Number(fallbackInterval.value))) return true;
        if (connectionAttempts.value === null || isNaN(Number(connectionAttempts.value))) return true;
        if (connectionTimeout.value === null || isNaN(Number(connectionTimeout.value))) return true;

        // fallback pair
        const fp = (fallbackPassword.value ?? '').trim();
        const fpc = (confirmFallbackPassword.value ?? '').trim();
        if (fp || fpc) {
            if (!fp || !fpc) return true;
            if (fp !== fpc) return true;
        }
        // quit pair
        const qp = (quitPassword.value ?? '').trim();
        const qpc = (confirmQuitPassword.value ?? '').trim();
        if (qp || qpc) {
            if (!qp || !qpc) return true;
            if (qp !== qpc) return true;
        }
    }

    return false;
});

const canSave = computed(() => !isSaving.value && (statusChanged.value || (isDirty.value && !isSaveDisabled.value)));

onMounted(async () => {
    appBarStore.title = translate("titles.connectionConfiguration");
    layoutStore.setBlueBackground(true);

    await loadCertificates();

    examsLoading.value = false;

    const idParam = route.params.connectionConfigId ?? route.params.id;
    const idNum = Number(idParam);
    if (idNum != null) {
        const dto: ConnectionConfiguration | null = await connectionConfigurationViewService.getConnectionConfiguration(idNum).catch(() => null);
        if (dto) {
            populateFromDto(dto);
            fetchedId.value = dto.id ?? idNum;
            initialActiveStatus.value = dto.active;
            active.value = dto.active;
        }
    }

    takeSnapshot();
});

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});

function populateFromDto(dto: ConnectionConfiguration) {
    name.value = (dto.name ?? '').toString();
    institutionId.value = dto.institutionId;
    configurationPurpose.value = dto.sebConfigPurpose ?? null;
    const aliasFromBackend =
        (dto as any).cert_alias ??
        (dto as any).certificateAlias ??
        (dto as any).certificate?.alias ??
        undefined;

    encryptWithCertificate.value = aliasFromBackend || undefined;
    pingInterval.value = dto.sebServerPingTime != null ? Number(dto.sebServerPingTime) : 1000;
    exams.value = Array.isArray(dto.exam_selection) ? dto.exam_selection : [];
    asymmetricOnlyEncryption.value = dto.cert_encryption_asym;

    withFallback.value = !!dto.startURL;
    fallbackStartUrl.value = dto.startURL;
    fallbackInterval.value = dto.sebServerFallbackAttemptInterval;
    connectionAttempts.value = dto.sebServerFallbackAttempts;
    connectionTimeout.value = dto.sebServerFallbackTimeout;

    // passwords
    fallbackPassword.value = dto.sebServerFallbackPasswordHash;
    confirmFallbackPassword.value = dto.sebServerFallbackPasswordHash;
    quitPassword.value = dto.hashedQuitPassword;
    confirmQuitPassword.value = dto.hashedQuitPassword;
    configurationPassword.value = dto.encryptSecret;
    confirmConfigurationPassword.value = dto.encryptSecret;

    creationDate.value = dto.date
}

function currentFormState() {
    return {
        name: name.value,
        configurationPurpose: configurationPurpose.value,
        encryptWithCertificate: encryptWithCertificate.value,
        pingInterval: pingInterval.value,
        exams: exams.value,
        asymmetricOnlyEncryption: asymmetricOnlyEncryption.value,
        withFallback: withFallback.value,
        fallbackStartUrl: fallbackStartUrl.value,
        interval: fallbackInterval.value,
        connectionAttempts: connectionAttempts.value,
        connectionTimeout: connectionTimeout.value,

        encryptSecret: configurationPassword.value,
        confirm_encrypt_secret: confirmConfigurationPassword.value,
        sebServerFallbackPasswordHash: fallbackPassword.value,
        sebServerFallbackPasswordHashConfirm: confirmFallbackPassword.value,
        hashedQuitPassword: quitPassword.value,
        hashedQuitPasswordConfirm: confirmQuitPassword.value,
    };
}

function takeSnapshot() {
    originalSnapshot.value = JSON.parse(JSON.stringify(currentFormState()));
}

const isDirty = computed(() => {
    if (!originalSnapshot.value) return false;
    return JSON.stringify(currentFormState()) !== JSON.stringify(originalSnapshot.value);
});

function toggleStatusLocally() {
    active.value = !active.value;
}

async function persistStatusChange() {
    const id = String(fetchedId.value ?? route.params.connectionConfigId ?? route.params.id);
    if (active.value) {
        await connectionConfigurationViewService.activateConnectionConfiguration(id);
    } else {
        await connectionConfigurationViewService.deactivateConnectionConfiguration(id);
    }
}

function onBack() {
    if (window.history.length > 1) {
        router.back();
    } else {
        navigateTo(constants.CONNECTION_CONFIGURATIONS_ROUTE);
    }
}

async function onSave() {
    if (isSaving.value) return;
    const fieldsChanged = isDirty.value;
    const statusWasChanged = statusChanged.value;

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
            await editConnectionConfigurationOnly();
            takeSnapshot();
            return;
        }

        // 3) Both changed
        if (fieldsChanged && statusWasChanged) {
            await persistStatusChange();
            await editConnectionConfigurationOnly();
            initialActiveStatus.value = active.value;
            takeSnapshot();
        }
    } finally {
        isSaving.value = false;
    }
}

async function editConnectionConfigurationOnly() {
    const idToSend = String(fetchedId.value ?? route.params.connectionConfigId ?? route.params.id);

    if (institutionId.value == null) {
        console.warn("Skipping save: institutionId is not set");
        return;
    }

    const basePayload: UpdateConnectionConfigurationPar = {
        id: idToSend,
        institutionId: institutionId.value.toString(),
        name: name.value.trim(),
        sebConfigPurpose: configurationPurpose.value!,
        sebServerPingTime: Number(pingInterval.value!),
        exam_selection: exams.value?.length ? exams.value : undefined,
        cert_alias: encryptWithCertificate.value || undefined,

        encryptSecret: configurationPassword.value?.trim() || undefined,
        confirm_encrypt_secret: confirmConfigurationPassword.value?.trim() || undefined,

        cert_encryption_asym: !!asymmetricOnlyEncryption.value,

        sebServerFallback: !!withFallback.value,

        vdiSetup: "NO",
    };

    const payload = {
        ...basePayload,
        ...(withFallback.value
            ? {
                startURL: fallbackStartUrl.value.trim(),
                sebServerFallbackAttemptInterval: Number(fallbackInterval.value!),
                sebServerFallbackAttempts: Number(connectionAttempts.value!),
                sebServerFallbackTimeout: Number(connectionTimeout.value!),
                sebServerFallbackPasswordHash: fallbackPassword.value?.trim() || undefined,
                sebServerFallbackPasswordHashConfirm: confirmFallbackPassword.value?.trim() || undefined,
                hashedQuitPassword: quitPassword.value?.trim() || undefined,
                hashedQuitPasswordConfirm: confirmQuitPassword.value?.trim() || undefined,
            }
            : {
                startURL: undefined,
                sebServerFallbackAttemptInterval: undefined,
                sebServerFallbackAttempts: undefined,
                sebServerFallbackTimeout: undefined,
                sebServerFallbackPasswordHash: undefined,
                sebServerFallbackPasswordHashConfirm: undefined,
                hashedQuitPassword: undefined,
                hashedQuitPasswordConfirm: undefined,
            }),
    };

    //todo this removes the default key and replaces it with sebserverfallback with a space at the end to satisfy backend bug
    const { sebServerFallback, ...rest } = payload as any;
    const toSend = {
        ...rest,
        ['sebServerFallback ']: sebServerFallback,
    };
    await connectionConfigurationViewService.editConnectionConfiguration(toSend as any);
}

// watchers to live-validate password pairs
watch([configurationPassword, confirmConfigurationPassword], ([a, b]) => {
    const aTrim = (a ?? '').trim();
    const bTrim = (b ?? '').trim();
    if (!aTrim && !bTrim) {
        configPwdRef.value?.resetValidation?.();
        confirmConfigPwdRef.value?.resetValidation?.();
        return;
    }
    configPwdRef.value?.validate?.();
    confirmConfigPwdRef.value?.validate?.();
});

watch([fallbackPassword, confirmFallbackPassword], ([a, b]) => {
    const aTrim = (a ?? '').trim();
    const bTrim = (b ?? '').trim();
    if (!aTrim && !bTrim) {
        fallbackPwdRef.value?.resetValidation?.();
        confirmFallbackPwdRef.value?.resetValidation?.();
        return;
    }
    fallbackPwdRef.value?.validate?.();
    confirmFallbackPwdRef.value?.validate?.();
});

watch([quitPassword, confirmQuitPassword], ([a, b]) => {
    const aTrim = (a ?? '').trim();
    const bTrim = (b ?? '').trim();
    if (!aTrim && !bTrim) {
        quitPwdRef.value?.resetValidation?.();
        confirmQuitPwdRef.value?.resetValidation?.();
        return;
    }
    quitPwdRef.value?.validate?.();
    confirmQuitPwdRef.value?.validate?.();
});

//certificates
async function loadCertificates() {
    certificatesLoading.value = true;
    try {
        const optionalParams = { page_number: 1, page_size: 500 };
        const response = await certificateViewService.getCertificates(optionalParams);

        const certAliases: { label: string; value: string }[] =
            response?.content?.map((c: { alias: string }) => ({
                label: c.alias,
                value: c.alias,
            })) ?? [];

        certificateItems.value = [certificateItems.value[0], ...certAliases];
    } finally {
        certificatesLoading.value = false;
    }
}

function handleCertChange(val: string | undefined) {
    if (val === '__UPLOAD__') {
        certDialog.value = true;
        encryptWithCertificate.value = undefined;
    } else {
        encryptWithCertificate.value = val;
    }
}

async function onCertImported(created: { id: string; name: string }) {
    const uploadedAlias = created.name;
    await loadCertificates();
    encryptWithCertificate.value = uploadedAlias;
}

//format date
function formatDisplayDate(dateString?: string): string {
    if (!dateString) return "";
    return moment(dateString).format("MMM D, YYYY");
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
