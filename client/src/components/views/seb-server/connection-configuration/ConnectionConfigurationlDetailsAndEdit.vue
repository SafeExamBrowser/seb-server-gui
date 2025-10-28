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
                    data-testid="connectionConfigurationEdit-title-text"
                >
                    {{ translate("titles.connectionConfigurationViewAndEdit") }}
                </div>
                <v-chip
                    class="text-subtitle-1 px-5 py-2 font-weight-bold"
                    :color="active ? 'success' : 'error'"
                    data-testid="connectionConfigurationEdit-status-chip"
                    :disabled="isSaving"
                    label
                    size="large"
                    style="cursor: pointer"
                    @click="!isSaving && toggleStatusLocally()"
                >
                    {{
                        active
                            ? translate(
                                  "connectionConfigurations.connectionConfigurationViewAndEditPage.filters.activeSelector",
                              )
                            : translate(
                                  "connectionConfigurations.connectionConfigurationViewAndEditPage.filters.inactiveSelector",
                              )
                    }}
                </v-chip>
            </v-row>

            <v-divider class="custom-divider mx-6 my-4 mt-7" />
            <v-row class="px-8 mt-2 d-flex justify-space-between">
                <div
                    class="text-body-2 text-grey-darken-1"
                    data-testid="connectionConfigurationEdit-lastUpdated-text"
                >
                    {{
                        translate(
                            "connectionConfigurations.connectionConfigurationViewAndEditPage.info.lastUpdatedAt",
                        ) +
                        formatDisplayDate(updateDate) +
                        translate(
                            "connectionConfigurations.connectionConfigurationViewAndEditPage.info.by",
                        ) +
                        userNamesOfLastUserToUpdate
                    }}
                </div>
                <div
                    class="text-body-2 text-grey-darken-1"
                    data-testid="connectionConfigurationEdit-createdAt-text"
                >
                    {{
                        translate(
                            "connectionConfigurations.connectionConfigurationViewAndEditPage.info.createdAt",
                        ) + formatDisplayDate(creationDate)
                    }}
                </div>
            </v-row>

            <!-- Form -->
            <v-sheet
                class="rounded-lg mt-4"
                data-testid="connectionConfigurationEdit-form-sheet"
                style="min-height: 46.9vh"
            >
                <v-form
                    ref="formRef"
                    data-testid="connectionConfigurationEdit-form-root"
                    @keyup.enter="onSave()"
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
                                            data-testid="connectionConfigurationEdit-name-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.name',
                                                )
                                            "
                                            required
                                            :rules="[requiredRule]"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <!-- Configuration Purpose -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-select
                                            v-model="configurationPurpose"
                                            data-testid="connectionConfigurationEdit-configurationPurpose-select"
                                            density="compact"
                                            item-title="label"
                                            item-value="value"
                                            :items="configurationPurposeItems"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.configurationPurpose',
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
                                            data-testid="connectionConfigurationEdit-configurationPassword-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.configurationPassword',
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
                                                    data-testid="connectionConfigurationEdit-configurationPassword-toggle"
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

                                    <!-- Confirm Configuration Password (required if configurationPassword set) -->
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
                                            data-testid="connectionConfigurationEdit-confirmConfigurationPassword-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.confirmConfigurationPassword',
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
                                                    data-testid="connectionConfigurationEdit-confirmConfigurationPassword-toggle"
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

                                <!-- Second Column first section -->
                                <v-col cols-="4"> </v-col>
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
                                            data-testid="connectionConfigurationEdit-encryptWithCertificate-select"
                                            density="compact"
                                            :disabled="certificatesLoading"
                                            item-title="label"
                                            item-value="value"
                                            :items="certificateItems"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.encryptWithCertificate',
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
                                                >
                                                    {{
                                                        translate(
                                                            "connectionConfigurations.connectionConfigurationViewAndEditPage.labels.noCertificatesUploadedYet",
                                                        )
                                                    }}
                                                </div>
                                            </template>
                                        </v-select>
                                    </v-col>

                                    <!-- Ping Interval* (number) -->
                                    <v-col
                                        class="custom-padding-textbox"
                                        cols="12"
                                        md="12"
                                    >
                                        <v-text-field
                                            v-model.number="pingInterval"
                                            data-testid="connectionConfigurationEdit-pingInterval-input"
                                            density="compact"
                                            inputmode="numeric"
                                            :label="
                                                translate(
                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.pingInterval',
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
                                    <!-- Use asymmetric-only encryption (toggle preserved for layout, not sent) -->
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
                                                        "connectionConfigurations.connectionConfigurationViewAndEditPage.labels.useAsymmetricOnlyEncryption",
                                                    )
                                                }}
                                            </label>

                                            <v-switch
                                                v-model="
                                                    asymmetricOnlyEncryption
                                                "
                                                :aria-label="
                                                    translate(
                                                        'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.withFallbackArea',
                                                    )
                                                "
                                                class="ml-4"
                                                color="primary"
                                                data-testid="connectionConfigurationEdit-asymmetricOnlyEncryption-toggle"
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
                                                        "connectionConfigurations.connectionConfigurationViewAndEditPage.labels.withFallback",
                                                    )
                                                }}
                                            </label>

                                            <v-switch
                                                v-model="withFallback"
                                                :aria-label="
                                                    translate(
                                                        'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.withFallbackArea',
                                                    )
                                                "
                                                class="ml-4"
                                                color="primary"
                                                data-testid="connectionConfigurationEdit-withFallback-toggle"
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
                                            data-testid="connectionConfigurationEdit-fallback-section"
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
                                                            data-testid="connectionConfigurationEdit-fallbackStartUrl-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.fallbackStartURL',
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

                                                    <!-- Connection Attempts* (number) -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model.number="
                                                                connectionAttempts
                                                            "
                                                            data-testid="connectionConfigurationEdit-connectionAttempts-input"
                                                            density="compact"
                                                            inputmode="numeric"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.connectionAttempts',
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

                                                    <!-- Interval* (number) -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model.number="
                                                                fallbackInterval
                                                            "
                                                            data-testid="connectionConfigurationEdit-fallbackInterval-input"
                                                            density="compact"
                                                            inputmode="numeric"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.interval',
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

                                                    <!-- Connection Timeout* (number) -->
                                                    <v-col
                                                        class="custom-padding-textbox"
                                                        cols="12"
                                                        md="12"
                                                    >
                                                        <v-text-field
                                                            v-model.number="
                                                                connectionTimeout
                                                            "
                                                            data-testid="connectionConfigurationEdit-connectionTimeout-input"
                                                            density="compact"
                                                            inputmode="numeric"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.connectionTimeout',
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
                                                            data-testid="connectionConfigurationEdit-fallbackPassword-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.fallbackPassword',
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
                                                                    data-testid="connectionConfigurationEdit-fallbackPassword-toggle"
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

                                                    <!-- Confirm Fallback Password (required if fallbackPassword set) -->
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
                                                            data-testid="connectionConfigurationEdit-confirmFallbackPassword-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.confirmFallbackPassword',
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
                                                                    data-testid="connectionConfigurationEdit-confirmFallbackPassword-toggle"
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
                                                            data-testid="connectionConfigurationEdit-quitPassword-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.quitPassword',
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
                                                                    data-testid="connectionConfigurationEdit-quitPassword-toggle"
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

                                                    <!-- Confirm Quit Password (required if quitPassword set) -->
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
                                                            data-testid="connectionConfigurationEdit-confirmQuitPassword-input"
                                                            density="compact"
                                                            :label="
                                                                translate(
                                                                    'connectionConfigurations.connectionConfigurationViewAndEditPage.labels.confirmQuitPassword',
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
                                                                    data-testid="connectionConfigurationEdit-confirmQuitPassword-toggle"
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

                                                <v-col cols="4"> </v-col>
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
                <v-col class="pa-0 mb-4" cols="12" md="12">
                    <v-row>
                        <v-spacer />
                        <v-col>
                            <div class="d-flex justify-end">
                                <v-btn
                                    color="black"
                                    data-testid="connectionConfigurationEdit-back-button"
                                    rounded="sm"
                                    variant="outlined"
                                    @click="onBack()"
                                >
                                    {{ translate("general.cancelButton") }}
                                </v-btn>

                                <v-btn
                                    class="ml-2"
                                    color="primary"
                                    data-testid="connectionConfigurationEdit-save-button"
                                    :disabled="!canSave"
                                    :loading="isSaving"
                                    rounded="sm"
                                    variant="flat"
                                    @click="onSave()"
                                >
                                    {{ translate("general.saveButton") }}
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAppBarStore, useLayoutStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import { navigateTo } from "@/router/navigation";
import * as constants from "@/utils/constants";
import * as connectionConfigurationViewService from "@/services/seb-server/component-services/connectionConfigurationViewService";
import router from "@/router/router";
import * as certificateViewService from "@/services/seb-server/component-services/certificateViewService";
import moment from "moment-timezone";
import { getUserAccountById } from "@/services/seb-server/component-services/userAccountViewService";
import { UserAccount } from "@/models/userAccount";
import {
    ConnectionConfiguration,
    UpdateConnectionConfigurationPar,
} from "@/models/seb-server/connectionConfiguration";

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
const pingInterval = ref<number | null>(1);
const exams = ref<number[]>([]);
const asymmetricOnlyEncryption = ref<boolean>(false);

const withFallback = ref<boolean>(false);
const fallbackStartUrl = ref<string>("");
const fallbackInterval = ref<number | null>(2);
const connectionAttempts = ref<number | null>(5);
const connectionTimeout = ref<number | null>(30);
const fallbackPassword = ref<string>("");
const confirmFallbackPassword = ref<string>("");
const quitPassword = ref<string>("");
const confirmQuitPassword = ref<string>("");
const configurationPurpose = ref<string | null>(null);
const institutionId = ref<number | undefined>(undefined);
const creationDate = ref<string | undefined>(undefined);
const updateDate = ref<string | undefined>(undefined);

// UI state
const formRef = ref<VuetifyFormLike | null>(null);
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
const originalSnapshot = ref<FormState | null>(null);

// Refs for validation control
const configPwdRef = ref<InputLike | null>(null);
const confirmConfigPwdRef = ref<InputLike | null>(null);
const fallbackPwdRef = ref<InputLike | null>(null);
const confirmFallbackPwdRef = ref<InputLike | null>(null);
const quitPwdRef = ref<InputLike | null>(null);
const confirmQuitPwdRef = ref<InputLike | null>(null);
const userToLastUpdate = ref<UserAccount | null>(null);
const userNamesOfLastUserToUpdate = ref<string | undefined>(undefined);

type VuetifyFormLike = {
    validate: () => Promise<{ valid: boolean }>;
    resetValidation?: () => void;
};

type FormState = {
    name: string;
    configurationPurpose: string | null;
    encryptWithCertificate: string | undefined;
    pingInterval: number | null;
    exams: number[];
    asymmetricOnlyEncryption: boolean;

    withFallback: boolean;
    fallbackStartUrl: string;
    interval: number | null;
    connectionAttempts: number | null;
    connectionTimeout: number | null;

    encryptSecret: string;
    confirm_encrypt_secret: string;
    sebServerFallbackPasswordHash: string;
    sebServerFallbackPasswordHashConfirm: string;
    hashedQuitPassword: string;
    hashedQuitPasswordConfirm: string;
};

type InputLike = {
    validate?: () => void;
    resetValidation?: () => void;
};

const configurationPurposeItems = [
    {
        label: translate(
            "connectionConfigurations.connectionConfigurationViewAndEditPage.selectValues.start_exam",
        ),
        value: "START_EXAM",
    },
    {
        label: translate(
            "connectionConfigurations.connectionConfigurationViewAndEditPage.selectValues.configure_client",
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

// Validation messages
const requiredMessage = translate(
    "connectionConfigurations.connectionConfigurationViewAndEditPage.validation.required",
);
const mustMatchMessage = translate(
    "connectionConfigurations.connectionConfigurationViewAndEditPage.validation.noMatch",
);
const mustBeNumberMessage = translate(
    "connectionConfigurations.connectionConfigurationViewAndEditPage.validation.mustBePositiveNumber",
);
const mustBeUrlMessage = translate(
    "connectionConfigurations.connectionConfigurationViewAndEditPage.validation.mustBeWithUrl",
);

// Rules (same as create)
const isNil = (v: unknown): v is null | undefined =>
    v === null || v === undefined;
const isBlank = (v: unknown) =>
    typeof v === "string" ? v.trim().length === 0 : false;
const toNum = (v: unknown) => (typeof v === "number" ? v : Number(v));

// replace your rules that use (v: any) with (v: unknown)
const requiredRule = (v: unknown) => {
    if (isNil(v)) return requiredMessage;
    if (typeof v === "number") return true;
    return !isBlank(v) || requiredMessage;
};

const numberRule = (v: unknown) => {
    if (isNil(v) || v === "") return mustBeNumberMessage;
    const n = toNum(v);
    return !Number.isNaN(n) && n >= 1 ? true : mustBeNumberMessage;
};

const requiredNumberRule = (v: unknown) => {
    const req = requiredRule(v) === true;
    const num = numberRule(v) === true;
    return (
        (req && num) || (toNum(v) < 1 ? mustBeNumberMessage : requiredMessage)
    );
};

const requiredIfFallbackRule = (v: unknown) =>
    !withFallback.value || requiredRule(v) === true || requiredMessage;

const requiredNumberIfFallbackRule = (v: unknown) =>
    !withFallback.value ||
    requiredNumberRule(v) === true ||
    (toNum(v) < 1 ? mustBeNumberMessage : requiredMessage);

const urlIfFallbackRule = (v: unknown) => {
    if (!withFallback.value) return true;
    if (typeof v !== "string") return mustBeUrlMessage;
    const t = v.trim().toLowerCase();
    return (
        t.startsWith("http://") || t.startsWith("https://") || mustBeUrlMessage
    );
};

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

// Derived state
const statusChanged = computed(
    () =>
        initialActiveStatus.value !== null &&
        active.value !== initialActiveStatus.value,
);

const hasRealCerts = computed(() => certificateItems.value.length > 1);

// ToDo SEBSERV-771 This will be removed in an issue following in a couple days, for now suppressing this ESLint error is ok since the function will be completely removed anyway.

const isSaveDisabled = computed(() => {
    if (!name.value.trim()) return true;
    if (!configurationPurpose.value) return true;
    if (pingInterval.value === null || isNaN(Number(pingInterval.value)))
        return true;

    // config pwd pair
    const a = (configurationPassword.value ?? "").trim();
    const b = (confirmConfigurationPassword.value ?? "").trim();
    if (a || b) {
        if (!a || !b) return true;
        if (a !== b) return true;
    }

    if (withFallback.value) {
        if (!fallbackStartUrl.value) return true;
        if (
            fallbackInterval.value === null ||
            isNaN(Number(fallbackInterval.value))
        )
            return true;
        if (
            connectionAttempts.value === null ||
            isNaN(Number(connectionAttempts.value))
        )
            return true;
        if (
            connectionTimeout.value === null ||
            isNaN(Number(connectionTimeout.value))
        )
            return true;

        // fallback pair
        const fp = (fallbackPassword.value ?? "").trim();
        const fpc = (confirmFallbackPassword.value ?? "").trim();
        if (fp || fpc) {
            if (!fp || !fpc) return true;
            if (fp !== fpc) return true;
        }
        // quit pair
        const qp = (quitPassword.value ?? "").trim();
        const qpc = (confirmQuitPassword.value ?? "").trim();
        if (qp || qpc) {
            if (!qp || !qpc) return true;
            if (qp !== qpc) return true;
        }
    }

    return false;
});

const canSave = computed(
    () =>
        !isSaving.value &&
        (statusChanged.value || (isDirty.value && !isSaveDisabled.value)),
);

onMounted(async () => {
    appBarStore.title = translate("titles.connectionConfiguration");
    layoutStore.setBlueBackground(true);

    await loadCertificates();

    examsLoading.value = false;

    const idParam = route.params.connectionConfigId ?? route.params.id;
    const idNum = Number(idParam);
    if (idNum != null) {
        const dto: ConnectionConfiguration | null =
            await connectionConfigurationViewService
                .getConnectionConfiguration(idNum)
                .catch(() => null);
        if (dto) {
            userToLastUpdate.value = await getUserAccountById(
                dto.lastUpdateUser,
            );

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
    name.value = (dto.name ?? "").toString();
    institutionId.value = dto.institutionId;
    configurationPurpose.value = dto.sebConfigPurpose ?? null;

    const r = dto as unknown as Record<string, unknown>;
    const aliasFromBackend =
        (typeof r.cert_alias === "string" && r.cert_alias) ||
        (typeof r.certificateAlias === "string" && r.certificateAlias) ||
        (r.certificate &&
            typeof (r.certificate as Record<string, unknown>).alias ===
                "string" &&
            (r.certificate as Record<string, unknown>).alias) ||
        undefined;

    encryptWithCertificate.value =
        (aliasFromBackend as string | undefined) || undefined;

    // Convert ms → s
    pingInterval.value =
        dto.sebServerPingTime != null
            ? Math.round(Number(dto.sebServerPingTime) / 1000)
            : 1;
    fallbackInterval.value =
        dto.sebServerFallbackAttemptInterval != null
            ? Math.round(Number(dto.sebServerFallbackAttemptInterval) / 1000)
            : 2;
    connectionTimeout.value =
        dto.sebServerFallbackTimeout != null
            ? Math.round(Number(dto.sebServerFallbackTimeout) / 1000)
            : 30;
    exams.value = Array.isArray(dto.exam_selection) ? dto.exam_selection : [];
    asymmetricOnlyEncryption.value = dto.cert_encryption_asym;

    withFallback.value = !!dto.startURL;
    fallbackStartUrl.value = dto.startURL;
    connectionAttempts.value = dto.sebServerFallbackAttempts;

    // passwords
    fallbackPassword.value = dto.sebServerFallbackPasswordHash;
    confirmFallbackPassword.value = dto.sebServerFallbackPasswordHash;
    quitPassword.value = dto.hashedQuitPassword;
    confirmQuitPassword.value = dto.hashedQuitPassword;
    configurationPassword.value = dto.encryptSecret;
    confirmConfigurationPassword.value = dto.encryptSecret;

    creationDate.value = dto.date;
    updateDate.value = dto.lastUpdateTime.toString();

    userNamesOfLastUserToUpdate.value =
        userToLastUpdate.value?.name +
        " " +
        userToLastUpdate.value?.surname +
        " (" +
        userToLastUpdate.value?.username +
        ")";
}

function currentFormState(): FormState {
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
    return (
        JSON.stringify(currentFormState()) !==
        JSON.stringify(originalSnapshot.value)
    );
});

function toggleStatusLocally() {
    active.value = !active.value;
}

async function persistStatusChange() {
    const id = String(
        fetchedId.value ?? route.params.connectionConfigId ?? route.params.id,
    );
    if (active.value) {
        await connectionConfigurationViewService.activateConnectionConfiguration(
            id,
        );
    } else {
        await connectionConfigurationViewService.deactivateConnectionConfiguration(
            id,
        );
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

    const _formRef = formRef.value;
    if (_formRef != null && fieldsChanged) {
        const { valid } = await _formRef.validate();
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
    const idToSend = String(
        fetchedId.value ?? route.params.connectionConfigId ?? route.params.id,
    );

    if (institutionId.value == null) {
        console.warn("Skipping save: institutionId is not set");
        return;
    }

    // helper that converts seconds -> ms when not null
    const toMs = (s: number | null) =>
        s == null ? null : Math.round(Number(s) * 1000);

    if (!configurationPurpose.value) return;
    if (pingInterval.value == null) return;

    const pingMs = toMs(pingInterval.value);
    if (pingMs == null) return;

    const basePayload: UpdateConnectionConfigurationPar = {
        id: idToSend,
        institutionId: institutionId.value.toString(),
        name: name.value.trim(),
        sebConfigPurpose: configurationPurpose.value,
        sebServerPingTime: pingMs,
        exam_selection: exams.value?.length ? exams.value : undefined,
        cert_alias: encryptWithCertificate.value || undefined,

        encryptSecret: configurationPassword.value?.trim() || undefined,
        confirm_encrypt_secret:
            confirmConfigurationPassword.value?.trim() || undefined,

        cert_encryption_asym: !!asymmetricOnlyEncryption.value,

        sebServerFallback: !!withFallback.value,

        vdiSetup: "NO",
    };

    // ---- Fallback section only when enabled, with its own narrows ----
    let fallbackPart = {};
    if (withFallback.value) {
        if (!fallbackStartUrl.value) return;
        if (fallbackInterval.value == null) return;
        if (connectionAttempts.value == null) return;
        if (connectionTimeout.value == null) return;

        const fbIntervalMs = toMs(fallbackInterval.value);
        const fbTimeoutMs = toMs(connectionTimeout.value);
        const attemptsNum = Number(connectionAttempts.value);

        if (fbIntervalMs == null) return;
        if (!Number.isFinite(attemptsNum)) return;
        if (fbTimeoutMs == null) return;

        fallbackPart = {
            startURL: fallbackStartUrl.value.trim(),
            sebServerFallbackAttemptInterval: fbIntervalMs,
            sebServerFallbackAttempts: attemptsNum,
            sebServerFallbackTimeout: fbTimeoutMs,
            sebServerFallbackPasswordHash:
                fallbackPassword.value?.trim() || undefined,
            sebServerFallbackPasswordHashConfirm:
                confirmFallbackPassword.value?.trim() || undefined,
            hashedQuitPassword: quitPassword.value?.trim() || undefined,
            hashedQuitPasswordConfirm:
                confirmQuitPassword.value?.trim() || undefined,
        };
    } else {
        fallbackPart = {
            startURL: undefined,
            sebServerFallbackAttemptInterval: undefined,
            sebServerFallbackAttempts: undefined,
            sebServerFallbackTimeout: undefined,
            sebServerFallbackPasswordHash: undefined,
            sebServerFallbackPasswordHashConfirm: undefined,
            hashedQuitPassword: undefined,
            hashedQuitPasswordConfirm: undefined,
        };
    }

    const payload = {
        ...basePayload,
        ...fallbackPart,
    };

    const payloadRecord: Record<string, unknown> = { ...payload };
    const sebServerFallbackVal = payloadRecord["sebServerFallback"];
    delete payloadRecord["sebServerFallback"];

    const toSend: Record<string, unknown> = {
        ...payloadRecord,
        "sebServerFallback ": sebServerFallbackVal,
    };

    await connectionConfigurationViewService.editConnectionConfiguration(
        toSend as unknown as UpdateConnectionConfigurationPar,
    );
}

// watchers to live-validate password pairs
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

// certificates
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

// format date
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
