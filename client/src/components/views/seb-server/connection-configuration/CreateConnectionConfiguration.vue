```vue
<template>
    <div class="text-white text-h5 font-weight-black ml-10 mt-5">
        {{ translate("titles.settings") }}
    </div>
    <v-row class="mt-10 w-98 h-100">
        <!-- settings navigation-->
        <SettingsNavigation />

        <v-col class="bg-white rounded-lg" cols="9" elevation="4">
            <v-row class="d-flex align-center justify-space-between px-6 pt-6">
                <div
                    class="text-primary text-h5 font-weight-bold"
                    data-testid="connectionConfigurationCreation-title-text"
                >
                    {{ translate("titles.createConnectionConfiguration") }}
                </div>
            </v-row>

            <v-divider class="custom-divider mx-6 my-4 mt-7" />
            <v-row class="px-8 mt-2">
                <div
                    class="text-body-2 text-grey-darken-1"
                    data-testid="connectionConfigurationCreation-info-text"
                >
                    {{
                        translate(
                            "connectionConfigurations.createConnectionConfigurationPage.info.createConnectionConfigurationInfo",
                        )
                    }}
                </div>
            </v-row>

            <!-- Form-->
            <v-sheet class="rounded-lg mt-4" style="min-height: 46.9vh">
                <v-form
                    ref="formRef"
                    data-testid="connectionConfigurationCreation-form"
                    @keyup.enter="submit()"
                >
                    <v-col class="pa-0 mb-4 h-100" cols="12" md="12">
                        <v-card-text>
                            <!-- First Section -->
                            <v-row dense>
                                <v-col cols="8">
                                    <!-- Name* -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model="name"
                                            data-testid="connectionConfigurationCreation-name-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.name',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Configuration Purpose-->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-select
                                            v-model="configurationPurpose"
                                            data-testid="connectionConfigurationCreation-configurationPurpose-select"
                                            density="compact"
                                            item-title="label"
                                            item-value="value"
                                            :items="configurationPurposeItems"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.configurationPurpose',
                                                )
                                            "
                                            :rules="[requiredRule]"
                                            validate-on="input"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Configuration Password (optional) -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            ref="configPwdRef"
                                            v-model="configurationPassword"
                                            data-testid="connectionConfigurationCreation-configurationPassword-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.configurationPassword',
                                                )
                                            "
                                            :type="
                                                configurationPasswordVisible
                                                    ? 'text'
                                                    : 'password'
                                            "
                                            validate-on="input"
                                            variant="outlined"
                                        >
                                            <template #append-inner>
                                                <v-btn
                                                    data-testid="connectionConfigurationCreation-configurationPassword-toggle"
                                                    density="compact"
                                                    :icon="
                                                        configurationPasswordVisible
                                                            ? 'mdi-eye-off'
                                                            : 'mdi-eye'
                                                    "
                                                    variant="text"
                                                    @click="
                                                        configurationPasswordVisible =
                                                            !configurationPasswordVisible
                                                    "
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>

                                    <!-- Confirm Configuration Password -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            ref="confirmConfigPwdRef"
                                            v-model="
                                                confirmConfigurationPassword
                                            "
                                            data-testid="connectionConfigurationCreation-confirmConfigurationPassword-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.confirmConfigurationPassword',
                                                )
                                            "
                                            :rules="[configPwdMustMatchRule]"
                                            :type="
                                                confirmConfigurationPasswordVisible
                                                    ? 'text'
                                                    : 'password'
                                            "
                                            validate-on="input"
                                            variant="outlined"
                                        >
                                            <template #append-inner>
                                                <v-btn
                                                    data-testid="connectionConfigurationCreation-confirmConfigurationPassword-toggle"
                                                    density="compact"
                                                    :icon="
                                                        confirmConfigurationPasswordVisible
                                                            ? 'mdi-eye-off'
                                                            : 'mdi-eye'
                                                    "
                                                    variant="text"
                                                    @click="
                                                        confirmConfigurationPasswordVisible =
                                                            !confirmConfigurationPasswordVisible
                                                    "
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>
                                </v-col>
                                <v-col cols="4"></v-col>
                            </v-row>

                            <!-- Second Section-->
                            <v-row class="mt-0" dense>
                                <v-col cols="8">
                                    <!-- Encrypt With Certificate (optional) -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-select
                                            v-model="encryptWithCertificate"
                                            data-testid="connectionConfigurationCreation-encryptWithCertificate-select"
                                            density="compact"
                                            :disabled="certificatesLoading"
                                            item-title="label"
                                            item-value="value"
                                            :items="certificateItems"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.encryptWithCertificate',
                                                )
                                            "
                                            :loading="certificatesLoading"
                                            :menu-props="{ maxHeight: 240 }"
                                            variant="outlined"
                                            @update:model-value="
                                                handleCertChange
                                            "
                                        >
                                            <template #item="{ props, item }">
                                                <v-list-item v-bind="props">
                                                    <template #prepend>
                                                        <v-icon
                                                            v-if="
                                                                item.raw
                                                                    .value ===
                                                                '__UPLOAD__'
                                                            "
                                                            >mdi-upload</v-icon
                                                        >
                                                    </template>
                                                </v-list-item>
                                                <v-divider
                                                    v-if="
                                                        item.raw.value ===
                                                        '__UPLOAD__'
                                                    "
                                                    class="my-1"
                                                />
                                            </template>

                                            <template
                                                v-if="!hasRealCerts"
                                                #append-item
                                            >
                                                <div
                                                    class="text-caption text-grey-darken-1 px-4 py-2"
                                                    data-testid="connectionConfigurationCreation-noCertificates-label"
                                                >
                                                    {{
                                                        translate(
                                                            "connectionConfigurations.createConnectionConfigurationPage.labels.noCertificatesUploadedYet",
                                                        )
                                                    }}
                                                </div>
                                            </template>
                                        </v-select>
                                    </v-col>

                                    <!-- Ping Interval* -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model.number="pingInterval"
                                            data-testid="connectionConfigurationCreation-pingInterval-input"
                                            density="compact"
                                            inputmode="numeric"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.pingInterval',
                                                )
                                            "
                                            :rules="[requiredNumberRule]"
                                            type="number"
                                            validate-on="blur"
                                            variant="outlined"
                                        />
                                    </v-col>
                                </v-col>

                                <v-col cols="4">
                                    <!-- Use asymmetric-only encryption (toggle preserved for layout) -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <div
                                            class="d-flex align-center justify-space-between w-100"
                                        >
                                            <label
                                                class="text-grey-darken-1 text-body-1 ml-11"
                                            >
                                                {{
                                                    translate(
                                                        "connectionConfigurations.createConnectionConfigurationPage.labels.useAsymmetricOnlyEncryption",
                                                    )
                                                }}
                                            </label>

                                            <v-switch
                                                v-model="
                                                    asymmetricOnlyEncryption
                                                "
                                                :aria-label="
                                                    translate(
                                                        'connectionConfigurations.createConnectionConfigurationPage.labels.withFallbackArea',
                                                    )
                                                "
                                                class="ml-4"
                                                color="primary"
                                                data-testid="connectionConfigurationCreation-asymmetricOnlyEncryption-toggle"
                                                density="compact"
                                                hide-details
                                                inset
                                            />
                                        </div>
                                    </v-col>
                                </v-col>
                            </v-row>

                            <!-- Third Section for Fallback -->
                            <v-row dense>
                                <v-divider class="custom-divider mx-1 my-2" />

                                <v-col>
                                    <!-- With Fallback -->
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
                                            >
                                                {{
                                                    translate(
                                                        "connectionConfigurations.createConnectionConfigurationPage.labels.withFallback",
                                                    )
                                                }}
                                            </label>

                                            <v-switch
                                                v-model="withFallback"
                                                :aria-label="
                                                    translate(
                                                        'connectionConfigurations.createConnectionConfigurationPage.labels.withFallbackArea',
                                                    )
                                                "
                                                class="ml-4"
                                                color="primary"
                                                data-testid="connectionConfigurationCreation-withFallback-toggle"
                                                density="compact"
                                                hide-details
                                                inset
                                            />
                                        </div>
                                    </v-col>
                                </v-col>
                            </v-row>

                            <v-row dense>
                                <v-col>
                                    <!-- Animated expansion -->
                                    <v-expand-transition>
                                        <div
                                            v-show="withFallback"
                                            data-testid="connectionConfigurationCreation-fallbackSection-container"
                                        >
                                            <v-row>
                                                <v-col cols="8">
                                                    <!-- Fallback Start URL* -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model="
                                                                fallbackStartUrl
                                                            "
                                                            data-testid="connectionConfigurationCreation-fallbackStartUrl-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.fallbackStartURL',
                                                                )
                                                            "
                                                            :rules="[
                                                                requiredIfFallbackRule,
                                                                urlIfFallbackRule,
                                                            ]"
                                                            validate-on="blur"
                                                            variant="outlined"
                                                        />
                                                    </v-col>

                                                    <!-- Connection Attempts* -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model.number="
                                                                connectionAttempts
                                                            "
                                                            data-testid="connectionConfigurationCreation-connectionAttempts-input"
                                                            density="compact"
                                                            inputmode="numeric"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.connectionAttempts',
                                                                )
                                                            "
                                                            :rules="[
                                                                requiredNumberIfFallbackRule,
                                                            ]"
                                                            type="number"
                                                            validate-on="blur"
                                                            variant="outlined"
                                                        />
                                                    </v-col>

                                                    <!-- Interval* -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model.number="
                                                                interval
                                                            "
                                                            data-testid="connectionConfigurationCreation-interval-input"
                                                            density="compact"
                                                            inputmode="numeric"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.interval',
                                                                )
                                                            "
                                                            :rules="[
                                                                requiredNumberIfFallbackRule,
                                                            ]"
                                                            type="number"
                                                            validate-on="blur"
                                                            variant="outlined"
                                                        />
                                                    </v-col>

                                                    <!-- Connection Timeout* -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model.number="
                                                                connectionTimeout
                                                            "
                                                            data-testid="connectionConfigurationCreation-connectionTimeout-input"
                                                            density="compact"
                                                            inputmode="numeric"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.connectionTimeout',
                                                                )
                                                            "
                                                            :rules="[
                                                                requiredNumberIfFallbackRule,
                                                            ]"
                                                            type="number"
                                                            validate-on="blur"
                                                            variant="outlined"
                                                        />
                                                    </v-col>

                                                    <!-- Fallback Password (optional) -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            ref="fallbackPwdRef"
                                                            v-model="
                                                                fallbackPassword
                                                            "
                                                            data-testid="connectionConfigurationCreation-fallbackPassword-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.fallbackPassword',
                                                                )
                                                            "
                                                            :type="
                                                                fallbackPasswordVisible
                                                                    ? 'text'
                                                                    : 'password'
                                                            "
                                                            validate-on="input"
                                                            variant="outlined"
                                                        >
                                                            <template
                                                                #append-inner
                                                            >
                                                                <v-btn
                                                                    data-testid="connectionConfigurationCreation-fallbackPassword-toggle"
                                                                    density="compact"
                                                                    :icon="
                                                                        fallbackPasswordVisible
                                                                            ? 'mdi-eye-off'
                                                                            : 'mdi-eye'
                                                                    "
                                                                    variant="text"
                                                                    @click="
                                                                        fallbackPasswordVisible =
                                                                            !fallbackPasswordVisible
                                                                    "
                                                                />
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>

                                                    <!-- Confirm Fallback Password -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            ref="confirmFallbackPwdRef"
                                                            v-model="
                                                                confirmFallbackPassword
                                                            "
                                                            data-testid="connectionConfigurationCreation-confirmFallbackPassword-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.confirmFallbackPassword',
                                                                )
                                                            "
                                                            :rules="[
                                                                fallbackPwdMustMatchRule,
                                                            ]"
                                                            :type="
                                                                confirmFallbackPasswordVisible
                                                                    ? 'text'
                                                                    : 'password'
                                                            "
                                                            validate-on="input"
                                                            variant="outlined"
                                                        >
                                                            <template
                                                                #append-inner
                                                            >
                                                                <v-btn
                                                                    data-testid="connectionConfigurationCreation-confirmFallbackPassword-toggle"
                                                                    density="compact"
                                                                    :icon="
                                                                        confirmFallbackPasswordVisible
                                                                            ? 'mdi-eye-off'
                                                                            : 'mdi-eye'
                                                                    "
                                                                    variant="text"
                                                                    @click="
                                                                        confirmFallbackPasswordVisible =
                                                                            !confirmFallbackPasswordVisible
                                                                    "
                                                                />
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>

                                                    <!-- Quit Password (optional) -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            ref="quitPwdRef"
                                                            v-model="
                                                                quitPassword
                                                            "
                                                            data-testid="connectionConfigurationCreation-quitPassword-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.quitPassword',
                                                                )
                                                            "
                                                            :type="
                                                                quitPasswordVisible
                                                                    ? 'text'
                                                                    : 'password'
                                                            "
                                                            validate-on="input"
                                                            variant="outlined"
                                                        >
                                                            <template
                                                                #append-inner
                                                            >
                                                                <v-btn
                                                                    data-testid="connectionConfigurationCreation-quitPassword-toggle"
                                                                    density="compact"
                                                                    :icon="
                                                                        quitPasswordVisible
                                                                            ? 'mdi-eye-off'
                                                                            : 'mdi-eye'
                                                                    "
                                                                    variant="text"
                                                                    @click="
                                                                        quitPasswordVisible =
                                                                            !quitPasswordVisible
                                                                    "
                                                                />
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>

                                                    <!-- Confirm Quit Password -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            ref="confirmQuitPwdRef"
                                                            v-model="
                                                                confirmQuitPassword
                                                            "
                                                            data-testid="connectionConfigurationCreation-confirmQuitPassword-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.createConnectionConfigurationPage.labels.confirmQuitPassword',
                                                                )
                                                            "
                                                            :rules="[
                                                                quitPwdMustMatchRule,
                                                            ]"
                                                            :type="
                                                                confirmQuitPasswordVisible
                                                                    ? 'text'
                                                                    : 'password'
                                                            "
                                                            validate-on="input"
                                                            variant="outlined"
                                                        >
                                                            <template
                                                                #append-inner
                                                            >
                                                                <v-btn
                                                                    data-testid="connectionConfigurationCreation-confirmQuitPassword-toggle"
                                                                    density="compact"
                                                                    :icon="
                                                                        confirmQuitPasswordVisible
                                                                            ? 'mdi-eye-off'
                                                                            : 'mdi-eye'
                                                                    "
                                                                    variant="text"
                                                                    @click="
                                                                        confirmQuitPasswordVisible =
                                                                            !confirmQuitPasswordVisible
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

            <!-- Buttons-->
            <v-row class="px-6 pt-0">
                <v-col class="pa-0 mb-4" cols="12" md="12">
                    <div class="d-flex justify-end">
                        <v-btn
                            color="black"
                            data-testid="connectionConfigurationCreation-cancel-button"
                            rounded="sm"
                            variant="outlined"
                            @click="
                                navigateTo(
                                    constants.CONNECTION_CONFIGURATIONS_ROUTE,
                                )
                            "
                        >
                            {{ translate("general.cancelButton") }}
                        </v-btn>

                        <v-btn
                            class="ml-2"
                            color="primary"
                            data-testid="connectionConfigurationCreation-save-button"
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

        <!-- Upload Certificate Dialog (opened from select) -->
        <AddCertificateDialog
            v-model="certDialog"
            :simulate="true"
            @imported="onCertImported"
        />
    </v-row>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useAppBarStore, useLayoutStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import * as constants from "@/utils/constants";
import { navigateTo } from "@/router/navigation";
import * as connectionConfigurationViewService from "@/services/seb-server/component-services/connectionConfigurationViewService";
import * as certificateViewService from "@/services/seb-server/component-services/certificateViewService";
import { CreateConnectionConfigurationPar } from "@/models/seb-server/connectionConfiguration";

const name = ref<string>("");
const configurationPassword = ref<string>("");
const confirmConfigurationPassword = ref<string>("");
const encryptWithCertificate = ref<string | undefined>(undefined);
const pingInterval = ref<number | null>(1);
const asymmetricOnlyEncryption = ref<boolean>(false);

const withFallback = ref<boolean>(false);
const fallbackStartUrl = ref<string>("");
const interval = ref<number | null>(2);
const connectionAttempts = ref<number | null>(5);
const connectionTimeout = ref<number | null>(30);
const fallbackPassword = ref<string>("");
const confirmFallbackPassword = ref<string>("");
const quitPassword = ref<string>("");
const confirmQuitPassword = ref<string>("");
const configurationPurpose = ref<string | null>(null);

// UI state
const formRef = ref<VuetifyFormLike | null>(null);
const configurationPasswordVisible = ref<boolean>(false);
const confirmConfigurationPasswordVisible = ref<boolean>(false);
const fallbackPasswordVisible = ref<boolean>(false);
const confirmFallbackPasswordVisible = ref<boolean>(false);
const quitPasswordVisible = ref<boolean>(false);
const confirmQuitPasswordVisible = ref<boolean>(false);
const certDialog = ref(false);
const certificatesLoading = ref<boolean>(false);

// Stores
const appBarStore = useAppBarStore();
const layoutStore = useLayoutStore();

// pwd refs
const configPwdRef = ref<InputLike | null>(null);
const confirmConfigPwdRef = ref<InputLike | null>(null);
const fallbackPwdRef = ref<InputLike | null>(null);
const confirmFallbackPwdRef = ref<InputLike | null>(null);
const quitPwdRef = ref<InputLike | null>(null);
const confirmQuitPwdRef = ref<InputLike | null>(null);

const configurationPurposeItems = [
    {
        label: translate(
            "connectionConfigurations.createConnectionConfigurationPage.selectValues.start_exam",
        ),
        value: "START_EXAM",
    },
    {
        label: translate(
            "connectionConfigurations.createConnectionConfigurationPage.selectValues.configure_client",
        ),
        value: "CONFIGURE_CLIENT",
    },
];

const certificateItems = ref<{ label: string; value: string }[]>([
    {
        label: translate("certificates.certificateDialog.uploadCertificate"),
        value: "__UPLOAD__",
    },
]);

type VuetifyFormLike = {
    validate: () => Promise<{ valid: boolean }>;
    resetValidation?: () => void;
};
type InputLike = {
    validate?: () => void;
    resetValidation?: () => void;
};

// Validation messages
const requiredMessage = translate(
    "connectionConfigurations.createConnectionConfigurationPage.validation.required",
);
const mustMatchMessage = translate(
    "connectionConfigurations.createConnectionConfigurationPage.validation.noMatch",
);
const mustBeNumberMessage = translate(
    "connectionConfigurations.createConnectionConfigurationPage.validation.mustBeNumber",
);
const mustBeUrlMessage = translate(
    "connectionConfigurations.createConnectionConfigurationPage.validation.mustBeWithUrl",
);

// Rules helpers
const isNil = (v: unknown): v is null | undefined =>
    v === null || v === undefined;
const isBlank = (v: unknown) =>
    typeof v === "string" ? v.trim().length === 0 : false;
const toNum = (v: unknown) => (typeof v === "number" ? v : Number(v));

// Rules
const requiredRule = (v: unknown) => {
    if (isNil(v)) return requiredMessage;
    if (typeof v === "number") return true;
    return !isBlank(v) || requiredMessage;
};

const numberRule = (v: unknown) => {
    if (isNil(v) || v === "") return mustBeNumberMessage;
    const n = toNum(v);
    return !Number.isNaN(n) ? true : mustBeNumberMessage;
};

const requiredNumberRule = (v: unknown) =>
    (requiredRule(v) === true && numberRule(v) === true) ||
    (Number.isNaN(toNum(v)) ? mustBeNumberMessage : requiredMessage);

const requiredIfFallbackRule = (v: unknown) =>
    !withFallback.value || requiredRule(v) === true || requiredMessage;

const requiredNumberIfFallbackRule = (v: unknown) =>
    !withFallback.value ||
    requiredNumberRule(v) === true ||
    (Number.isNaN(toNum(v)) ? mustBeNumberMessage : requiredMessage);

const urlIfFallbackRule = (v: unknown) => {
    if (!withFallback.value) return true;
    if (typeof v !== "string") return mustBeUrlMessage;
    const t = v.trim().toLowerCase();
    return (
        t.startsWith("http://") || t.startsWith("https://") || mustBeUrlMessage
    );
};

// must match pwd rules
const configPwdMustMatchRule = () => {
    const a = (configurationPassword.value ?? "").trim();
    const b = (confirmConfigurationPassword.value ?? "").trim();

    if (!a && !b) return true;
    if (!a || !b) return mustMatchMessage;
    return a === b || mustMatchMessage;
};

const fallbackPwdMustMatchRule = () => {
    const a = (fallbackPassword.value ?? "").trim();
    const b = (confirmFallbackPassword.value ?? "").trim();
    if (!a && !b) return true;
    if (!a || !b) return mustMatchMessage;
    return a === b || mustMatchMessage;
};

const quitPwdMustMatchRule = () => {
    const a = (quitPassword.value ?? "").trim();
    const b = (confirmQuitPassword.value ?? "").trim();
    if (!a && !b) return true;
    if (!a || !b) return mustMatchMessage;
    return a === b || mustMatchMessage;
};

onMounted(async () => {
    appBarStore.title = translate("titles.createConnectionConfiguration");
    layoutStore.setBlueBackground(true);
    await loadCertificates();
});

onBeforeUnmount(() => {
    layoutStore.setBlueBackground(false);
});
async function submit() {
    const { valid } = await formRef.value!.validate();
    if (!valid) return;

    const toMs = (s: number | null) =>
        s == null ? null : Math.round(Number(s) * 1000);

    // ---- Narrow required base fields ----
    if (!configurationPurpose.value) return;
    if (pingInterval.value == null) return;
    const pingMs = toMs(pingInterval.value);
    if (pingMs == null) return;

    // Build base params
    const connectionConfigParams: CreateConnectionConfigurationPar = {
        name: name.value,
        sebServerPingTime: pingMs,
        sebConfigPurpose: configurationPurpose.value,
        cert_alias: encryptWithCertificate.value || undefined,
        exam_selection: undefined,
        encryptSecret: (configurationPassword.value ?? "").trim() || undefined,
        confirm_encrypt_secret:
            (confirmConfigurationPassword.value ?? "").trim() || undefined,
        cert_encryption_asym: !!asymmetricOnlyEncryption.value,
        sebServerFallback: !!withFallback.value,
        vdiSetup: "NO",
        ...(withFallback.value
            ? (() => {
                  // ---- fallback-only fields ----
                  if (!fallbackStartUrl.value) return {};
                  if (interval.value == null) return {};
                  if (connectionAttempts.value == null) return {};
                  if (connectionTimeout.value == null) return {};

                  const fbIntervalMs = toMs(interval.value);
                  const fbTimeoutMs = toMs(connectionTimeout.value);
                  const attemptsNum = Number(connectionAttempts.value);

                  if (fbIntervalMs == null) return {};
                  if (!Number.isFinite(attemptsNum)) return {};
                  if (fbTimeoutMs == null) return {};

                  return {
                      startURL: fallbackStartUrl.value.trim(),
                      sebServerFallbackAttemptInterval: fbIntervalMs,
                      sebServerFallbackAttempts: attemptsNum,
                      sebServerFallbackTimeout: fbTimeoutMs,
                      sebServerFallbackPasswordHash:
                          (fallbackPassword.value ?? "").trim() || undefined,
                      sebServerFallbackPasswordHashConfirm:
                          (confirmFallbackPassword.value ?? "").trim() ||
                          undefined,
                      hashedQuitPassword:
                          (quitPassword.value ?? "").trim() || undefined,
                      hashedQuitPasswordConfirm:
                          (confirmQuitPassword.value ?? "").trim() || undefined,
                  };
              })()
            : {}),
    };

    const payloadRecord: Record<string, unknown> = {
        ...connectionConfigParams,
        "sebServerFallback ": connectionConfigParams.sebServerFallback,
    };

    const created =
        await connectionConfigurationViewService.createConnectionConfiguration(
            payloadRecord as unknown as CreateConnectionConfigurationPar,
        );
    if (!created) return;

    navigateTo(constants.CONNECTION_CONFIGURATIONS_ROUTE);
}

// pwd watchers
watch([configurationPassword, confirmConfigurationPassword], ([a, b]) => {
    const aTrim = (a ?? "").trim();
    const bTrim = (b ?? "").trim();
    if (!aTrim && !bTrim) {
        configPwdRef.value?.resetValidation?.();
        confirmConfigPwdRef.value?.resetValidation?.();
        return;
    }
    configPwdRef.value?.validate?.();
    confirmConfigPwdRef.value?.validate?.();
});

watch([fallbackPassword, confirmFallbackPassword], ([a, b]) => {
    const aTrim = (a ?? "").trim();
    const bTrim = (b ?? "").trim();
    if (!aTrim && !bTrim) {
        fallbackPwdRef.value?.resetValidation?.();
        confirmFallbackPwdRef.value?.resetValidation?.();
        return;
    }
    fallbackPwdRef.value?.validate?.();
    confirmFallbackPwdRef.value?.validate?.();
});

watch([quitPassword, confirmQuitPassword], ([a, b]) => {
    const aTrim = (a ?? "").trim();
    const bTrim = (b ?? "").trim();
    if (!aTrim && !bTrim) {
        quitPwdRef.value?.resetValidation?.();
        confirmQuitPwdRef.value?.resetValidation?.();
        return;
    }
    quitPwdRef.value?.validate?.();
    confirmQuitPwdRef.value?.validate?.();
});

const hasRealCerts = computed(() => certificateItems.value.length > 1);

async function loadCertificates() {
    certificatesLoading.value = true;
    try {
        const optionalParams = { page_number: 1, page_size: 500 };
        const response =
            await certificateViewService.getCertificates(optionalParams);

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
    if (val === "__UPLOAD__") {
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
