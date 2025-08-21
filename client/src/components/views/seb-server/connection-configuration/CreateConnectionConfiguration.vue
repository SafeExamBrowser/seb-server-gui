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
                    {{ translate("titles.createConnectionConfiguration") }}
                </div>
            </v-row>


            <v-divider class="custom-divider mx-6 my-4 mt-7"/>
            <v-row class="px-8 mt-2">
                <div class="text-body-2 text-grey-darken-1">
                    {{
                        translate("connectionConfigurations.createConnectionConfigurationPage.info.createConnectionConfigurationInfo")
                    }}
                </div>
            </v-row>

            <!-- Form-->
            <v-sheet class="rounded-lg mt-4" style="min-height: 46.9vh">
                <v-form ref="formRef" @keyup.enter="submit()">


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
                                            <template v-slot:append-inner>
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
                                            :items="encryptWithCertificateItems"
                                            :return-object="false"
                                            item-title="label"
                                            item-value="value"
                                        />
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

                                    <!-- Exams (optional, multi-select) -->
                                    <v-col cols="12" md="12" class="custom-padding-textbox">
                                        <v-select
                                            prepend-inner-icon="mdi-file-document-multiple-outline"
                                            density="compact"
                                            :label="translate('connectionConfigurations.createConnectionConfigurationPage.labels.exams')"
                                            variant="outlined"
                                            v-model="exams"
                                            :items="examItems"
                                            item-title="label"
                                            item-value="value"
                                            multiple
                                            chips
                                            closable-chips
                                            :loading="examsLoading"
                                            :disabled="examsLoading"
                                        />
                                    </v-col>

                                </v-col>

                                <!-- Second Section-->
                                <v-col>
                                    <!-- Configuration Purpose (kept for layout, not required / not sent) -->
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
                                            <template v-slot:append-inner>
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
                                                            :rules="[requiredIfFallbackRule]"
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
                                                            <template v-slot:append-inner>
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
                                                            <template v-slot:append-inner>
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
                                                            v-model.number="interval"
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

                                                    <!-- Confirm Fallback Password (required iff fallbackPassword set) -->
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
                                                            <template v-slot:append-inner>
                                                                <v-btn
                                                                    density="compact"
                                                                    variant="text"
                                                                    :icon="confirmFallbackPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                                                    @click="confirmFallbackPasswordVisible = !confirmFallbackPasswordVisible"
                                                                />
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>

                                                    <!-- Confirm Quit Password (required iff quitPassword set) -->
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
                                                            <template v-slot:append-inner>
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

            <!-- Buttons-->
            <v-row class="px-6 pt-0">
                <v-col cols="12" md="12" class="pa-0 mb-4">
                    <div class="d-flex justify-end">
                        <v-btn
                            rounded="sm"
                            color="black"
                            variant="outlined"
                            @click="navigateTo(constants.CONNECTION_CONFIGURATIONS_ROUTE)"
                        >
                            {{ translate("general.cancelButton") }}
                        </v-btn>

                        <v-btn
                            rounded="sm"
                            color="primary"
                            variant="flat"
                            class="ml-2"
                            @click="submit()"
                            :disabled="isCreateDisabled"
                        >
                            {{ translate("general.createButton") }}
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, computed} from 'vue';
import {useAppBarStore, useLayoutStore} from '@/stores/store';
import {translate} from '@/utils/generalUtils';
import * as constants from '@/utils/constants';
import {navigateTo} from "@/router/navigation";
import * as connectionConfigurationViewService
    from "@/services/seb-server/component-services/connectionConfigurationViewService";


// ---- Fields mapped to CreateConnectionConfigurationPar ----
const name = ref<string>("");
const configurationPassword = ref<string>("");
const confirmConfigurationPassword = ref<string>("");
const encryptWithCertificate = ref<string | undefined>(undefined);
const pingInterval = ref<number | null>(1000);
const exams = ref<number[]>([]);
const asymmetricOnlyEncryption = ref<boolean>(false);

// Fallback toggle + fields
const withFallback = ref<boolean>(false);
const fallbackStartUrl = ref<string>("");
const interval = ref<number | null>(2000);
const connectionAttempts = ref<number | null>(5);
const connectionTimeout = ref<number | null>(30000);
const fallbackPassword = ref<string>("");
const confirmFallbackPassword = ref<string>("");
const quitPassword = ref<string>("");
const confirmQuitPassword = ref<string>("");

// kept for layout only (not sent)
const configurationPurpose = ref<string | null>(null);

// UI state
const formRef = ref();
const configurationPasswordVisible = ref<boolean>(false);
const confirmConfigurationPasswordVisible = ref<boolean>(false);
const fallbackPasswordVisible = ref<boolean>(false);
const confirmFallbackPasswordVisible = ref<boolean>(false);
const quitPasswordVisible = ref<boolean>(false);
const confirmQuitPasswordVisible = ref<boolean>(false);
const examsLoading = ref<boolean>(false);

// Stores
const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();


//pwd refs
const configPwdRef = ref<any>(null);
const confirmConfigPwdRef = ref<any>(null);


const fallbackPwdRef = ref<any>(null);
const confirmFallbackPwdRef = ref<any>(null);

const quitPwdRef = ref<any>(null);
const confirmQuitPwdRef = ref<any>(null);


// Select items
const encryptWithCertificateItems = [
    {label: '—', value: undefined},
    {label: 'Yes', value: 'YES'},
    {label: 'No', value: 'NO'}
];


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


const examItems = ref<{ label: string; value: number }[]>([]);


// Validation messages
const requiredMessage = translate("connectionConfigurations.createConnectionConfigurationPage.validation.required");
const mustMatchMessage = translate('connectionConfigurations.createConnectionConfigurationPage.validation.noMatch')
const mustBeNumberMessage = translate('connectionConfigurations.createConnectionConfigurationPage.validation.mustBeNumber')


// Rules
const requiredRule = (v: any) => {
    if (v === null || v === undefined) return requiredMessage;
    return (typeof v === 'number' ? true : String(v).trim().length > 0) || requiredMessage;
};
const numberRule = (v: any) => (v === null || v === undefined || v === '' || isNaN(Number(v)) ? mustBeNumberMessage : true);
const requiredNumberRule = (v: any) => requiredRule(v) === true && numberRule(v) === true || (isNaN(Number(v)) ? mustBeNumberMessage : requiredMessage);

const requiredIfFallbackRule = (v: any) => !withFallback.value || requiredRule(v) === true || requiredMessage;
const requiredNumberIfFallbackRule = (v: any) => !withFallback.value || requiredNumberRule(v) === true || (isNaN(Number(v)) ? mustBeNumberMessage : requiredMessage);


const isCreateDisabled = computed(() => {
    if (!name.value.trim()) return true;
    if (!configurationPurpose.value) return true; // ← require a selection
    if (pingInterval.value === null || isNaN(Number(pingInterval.value))) return true;

    if (withFallback.value) {
        if (!fallbackStartUrl.value.trim()) return true;
        if (interval.value === null || isNaN(Number(interval.value))) return true;
        if (connectionAttempts.value === null || isNaN(Number(connectionAttempts.value))) return true;
        if (connectionTimeout.value === null || isNaN(Number(connectionTimeout.value))) return true;

        // fallback pair
        {
            const fp = (fallbackPassword.value ?? '').trim();
            const fpc = (confirmFallbackPassword.value ?? '').trim();
            if (fp || fpc) {
                if (!fp || !fpc) return true;
                if (fp !== fpc) return true;
            }
        }
        // quit pair
        {
            const qp = (quitPassword.value ?? '').trim();
            const qpc = (confirmQuitPassword.value ?? '').trim();
            if (qp || qpc) {
                if (!qp || !qpc) return true;
                if (qp !== qpc) return true;
            }
        }
    }

    // main pair
    const a = (configurationPassword.value ?? '').trim();
    const b = (confirmConfigurationPassword.value ?? '').trim();
    if (a || b) {
        if (!a || !b) return true;
        if (a !== b) return true;
    }

    return false;
});




// must match when both have values password rules
const configPwdMustMatchRule = (v: any) => {
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


onMounted(async () => {
    appBarStore.title = translate("titles.createConnectionConfiguration");
    layoutStore.setBlueBackground(true);
});

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});


async function submit() {
    const {valid} = await formRef.value.validate();
    if (!valid) return;

    // build the normal, type-safe payload
    const connectionConfigParams: CreateConnectionConfigurationPar = {
        name: name.value.trim(),
        sebServerPingTime: Number(pingInterval.value!),

        sebConfigPurpose: configurationPurpose.value!,
        exam_selection: undefined,

        encryptSecret: configurationPassword.value ?? undefined,
        confirm_encrypt_secret: confirmConfigurationPassword.value?.trim() || undefined,
        cert_encryption_asym: !!asymmetricOnlyEncryption.value,

        // work
        sebServerFallback: !!withFallback.value,

        ...(withFallback.value
            ? {
                startURL: fallbackStartUrl.value.trim(),
                sebServerFallbackAttemptInterval: Number(interval.value!),
                sebServerFallbackAttempts: Number(connectionAttempts.value!),
                sebServerFallbackTimeout: Number(connectionTimeout.value!),
                sebServerFallbackPasswordHash: fallbackPassword.value?.trim() || undefined,
                sebServerFallbackPasswordHashConfirm: confirmFallbackPassword.value?.trim() || undefined,
                hashedQuitPassword: quitPassword.value?.trim() || undefined,
                hashedQuitPasswordConfirm: confirmQuitPassword.value?.trim() || undefined,
            }
            : {}),

        vdiSetup: "NO",
    };

    //todo : wait on backend to remove the space after the key
    const payload: any = {...connectionConfigParams, ['sebServerFallback ']: connectionConfigParams.sebServerFallback};

    const created = await connectionConfigurationViewService.createConnectionConfiguration(payload);
    if (!created) return;
    navigateTo(constants.CONNECTION_CONFIGURATIONS_ROUTE);
}

//pwd watchers
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
