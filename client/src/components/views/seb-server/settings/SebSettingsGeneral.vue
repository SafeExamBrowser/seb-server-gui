<template>
    <v-row>
        <!-- Administrator Password -->
        <v-col>
            <v-text-field
                ref="adminPasswordFieldRef"
                v-model="hashedAdminPasswordVal"
                :label="translate('sebSettings.generalView.adminPassword')"
                density="compact"
                :rules="[adminPasswordRule]"
                :type="adminPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                :disabled="sebSettingsStore.readonly"
                max-width="600"
                @update:focused="
                    saveAdminPassword($event, hashedAdminPasswordVal)
                "
            >
                <template #append-inner>
                    <v-btn
                        density="compact"
                        :icon="adminPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        variant="text"
                        @click="adminPasswordVisible = !adminPasswordVisible"
                    />
                </template>
            </v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <!-- Confirm Administrator Password -->
        <v-col :class="sebSettingsStore.fp">
            <v-text-field
                ref="confirmAdminPasswordFieldRef"
                v-model="confirmAdminPassword"
                :label="
                    translate('sebSettings.generalView.confirmAdminPassword')
                "
                class="mb-2"
                density="compact"
                required
                :rules="[confirmAdminPasswordRule]"
                :type="confirmAdminPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                max-width="600"
                @update:focused="
                    saveAdminPassword($event, hashedAdminPasswordVal)
                "
            >
                <template #append-inner>
                    <v-btn
                        density="compact"
                        :icon="
                            confirmAdminPasswordVisible
                                ? 'mdi-eye-off'
                                : 'mdi-eye'
                        "
                        variant="text"
                        @click="
                            confirmAdminPasswordVisible =
                                !confirmAdminPasswordVisible
                        "
                    />
                </template>
            </v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <v-col :class="sebSettingsStore.cp">
            <v-checkbox-btn
                v-model="allowQuitVal"
                max-width="600"
                :disabled="sebSettingsStore.readonly"
                :label="translate('sebSettings.generalView.allowQuit')"
                @update:model-value="
                    saveSingleValue(
                        'allowQuit',
                        allowQuitVal ? 'true' : 'false',
                    )
                "
            ></v-checkbox-btn>
            <v-tooltip activator="parent" location="top left" max-width="400">
                {{ translate("sebSettings.generalView.allowQuit_tooltip") }}
            </v-tooltip>
        </v-col>
    </v-row>
    <v-row>
        <!-- Quit Password -->
        <v-col>
            <v-text-field
                ref="quitPasswordFieldRef"
                v-model="hashedQuitPasswordVal"
                :label="translate('sebSettings.generalView.quitPassword')"
                density="compact"
                :rules="[quitPasswordRule]"
                :type="quitPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                :disabled="sebSettingsStore.readonly"
                max-width="600"
                @update:focused="
                    saveQuitPassword($event, hashedQuitPasswordVal)
                "
            >
                <template #append-inner>
                    <v-btn
                        density="compact"
                        :icon="quitPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        variant="text"
                        @click="quitPasswordVisible = !quitPasswordVisible"
                    />
                </template>
            </v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <!-- Confirm Quit Password -->
        <v-col>
            <v-text-field
                ref="confirmQuitPasswordFieldRef"
                v-model="confirmQuitPassword"
                :label="
                    translate('sebSettings.generalView.confirmQuitPassword')
                "
                class="mb-2"
                density="compact"
                required
                :rules="[confirmQuitPasswordRule]"
                :type="confirmQuitPasswordVisible ? 'text' : 'password'"
                validate-on="eager"
                variant="outlined"
                max-width="600"
                @update:focused="
                    saveQuitPassword($event, hashedQuitPasswordVal)
                "
            >
                <template #append-inner>
                    <v-btn
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
    </v-row>
</template>

<script setup lang="ts">
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import { useI18n } from "vue-i18n";
import { stringToBoolean, translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, onBeforeMount } from "vue";
import {
    SEBSettingsValue,
    SEBSettingsView,
} from "@/models/seb-server/sebSettings";

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

const allowQuitVal = ref<boolean>(false);

const hashedAdminPasswordVal = ref<string>("");
const adminPasswordVisible = ref<boolean>(false);
const confirmAdminPassword = ref<string>("");
const confirmAdminPasswordVisible = ref<boolean>(false);
const adminPasswordRule = () => {
    if (hashedAdminPasswordVal.value.trim() !== hashedAdminPasswordVal.value) {
        return translate("sebSettings.pwdSpaces", i18n);
    }

    if (hashedAdminPasswordVal.value === confirmAdminPassword.value) {
        if (!clearValidations) {
            clearValidations = true;
            confirmAdminPasswordFieldRef.value?.validate?.();
            clearValidations = false;
        }
        return true;
    }
    return translate("sebSettings.pwdMismatch", i18n);
};
const confirmAdminPasswordRule = () => {
    if (hashedAdminPasswordVal.value === confirmAdminPassword.value) {
        if (!clearValidations) {
            clearValidations = true;
            adminPasswordFieldRef.value?.validate?.();
            clearValidations = false;
        }
        return true;
    }
    return translate("sebSettings.pwdMismatch", i18n);
};
const adminPasswordFieldRef = ref();
const confirmAdminPasswordFieldRef = ref();

const hashedQuitPasswordVal = ref<string>("");
const quitPasswordVisible = ref<boolean>(false);
const confirmQuitPassword = ref<string>("");
const confirmQuitPasswordVisible = ref<boolean>(false);
const quitPasswordRule = () => {
    if (hashedQuitPasswordVal.value.trim() !== hashedQuitPasswordVal.value) {
        return translate("sebSettings.pwdSpaces", i18n);
    }

    if (hashedQuitPasswordVal.value === confirmQuitPassword.value) {
        if (!clearValidations) {
            clearValidations = true;
            confirmQuitPasswordFieldRef.value?.validate?.();
            clearValidations = false;
        }
        return true;
    }
    return translate("sebSettings.pwdMismatch", i18n);
};
const confirmQuitPasswordRule = () => {
    if (hashedQuitPasswordVal.value === confirmQuitPassword.value) {
        if (!clearValidations) {
            clearValidations = true;
            quitPasswordFieldRef.value?.validate?.();
            clearValidations = false;
        }
        return true;
    }
    return translate("sebSettings.pwdMismatch", i18n);
};

const quitPasswordFieldRef = ref();
const confirmQuitPasswordFieldRef = ref();

// the parent component identifier
let componentId: string;
let singleValues: Map<string, SEBSettingsValue>;

let clearValidations = false;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const generalSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.GENERAL,
            componentId,
            sebSettingsStore.isExam,
        );
    if (generalSettings == null) {
        return;
    }

    singleValues = new Map<string, SEBSettingsValue>(
        Object.entries(generalSettings.singleValues),
    );

    allowQuitVal.value = stringToBoolean(getSingleValue("allowQuit").value);
    hashedAdminPasswordVal.value = getSingleValue("hashedAdminPassword").value;
    confirmAdminPassword.value = getSingleValue("hashedAdminPassword").value;
    hashedQuitPasswordVal.value = getSingleValue("hashedQuitPassword").value;
    confirmQuitPassword.value = getSingleValue("hashedQuitPassword").value;
});

async function saveSingleValue(name: string, value: string) {
    const setting: SEBSettingsValue = getSingleValue(name);
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        setting.id.toString(),
        value,
        sebSettingsStore.isExam,
    );
}

async function saveAdminPassword(focusIn: boolean, value: string) {
    if (
        !focusIn &&
        hashedAdminPasswordVal.value.trim() === hashedAdminPasswordVal.value &&
        hashedAdminPasswordVal.value === confirmAdminPassword.value
    ) {
        saveSingleValue("hashedAdminPassword", value);
    }
}

async function saveQuitPassword(focusIn: boolean, value: string) {
    if (
        !focusIn &&
        hashedQuitPasswordVal.value.trim() === hashedQuitPasswordVal.value &&
        hashedQuitPasswordVal.value === confirmQuitPassword.value
    ) {
        saveSingleValue("hashedQuitPassword", value);
    }
}

function getSingleValue(name: string): SEBSettingsValue {
    const value = singleValues.get(name);
    if (!value) {
        throw new Error("No Single Value" + name + " found");
    }

    return value;
}
</script>
